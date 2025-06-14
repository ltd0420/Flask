/**
 * Apriori Association Rules Engine
 * Phân tích dữ liệu đặt tour để tạo gợi ý combo thông minh
 */

class AprioriEngine {
  constructor(options = {}) {
    this.minSupport = options.minSupport || 0.05
    this.minConfidence = options.minConfidence || 0.3
    this.minLift = options.minLift || 1.0
    this.maxItemsetSize = options.maxItemsetSize || 4

    // Cache để tối ưu performance
    this.cache = new Map()
    this.cacheExpiry = 5 * 60 * 1000 // 5 phút

    // Event listeners
    this.listeners = {
      "analysis-start": [],
      "analysis-progress": [],
      "analysis-complete": [],
      "recommendations-ready": [],
    }
  }

  /**
   * Đăng ký event listener
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    }
  }

  /**
   * Trigger event
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data))
    }
  }

  /**
   * Tải và phân tích dữ liệu giao dịch
   */
  async analyzeTransactions(tourId = null) {
    const cacheKey = `analysis_${tourId || "all"}`

    // Kiểm tra cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        this.emit("analysis-complete", cached.data)
        return cached.data
      }
    }

    this.emit("analysis-start", { tourId })

    try {
      // Tải dữ liệu giao dịch
      const transactions = await this.loadTransactionData(tourId)

      if (transactions.length === 0) {
        throw new Error("Không có dữ liệu giao dịch để phân tích")
      }

      this.emit("analysis-progress", {
        step: "data-loaded",
        count: transactions.length,
      })

      // Chạy thuật toán Apriori
      const frequentItemsets = await this.findFrequentItemsets(transactions)

      this.emit("analysis-progress", {
        step: "frequent-itemsets",
        count: this.countTotalItemsets(frequentItemsets),
      })

      // Tạo association rules
      const associationRules = await this.generateAssociationRules(frequentItemsets)

      this.emit("analysis-progress", {
        step: "association-rules",
        count: associationRules.length,
      })

      // Chuẩn bị kết quả
      const result = {
        transactions: transactions.length,
        frequentItemsets,
        associationRules,
        metadata: {
          minSupport: this.minSupport,
          minConfidence: this.minConfidence,
          minLift: this.minLift,
          analyzedAt: new Date().toISOString(),
        },
      }

      // Lưu cache
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      })

      this.emit("analysis-complete", result)
      return result
    } catch (error) {
      console.error("Lỗi trong phân tích Apriori:", error)
      throw error
    }
  }

  /**
   * Tải dữ liệu giao dịch từ server
   */
  async loadTransactionData(tourId = null) {
    try {
      let url = "/api/apriori/transactions"
      if (tourId) {
        url += `?tour_id=${tourId}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      return this.preprocessTransactions(data.transactions || [])
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu giao dịch:", error)
      return []
    }
  }

  /**
   * Tiền xử lý dữ liệu giao dịch
   */
  preprocessTransactions(rawTransactions) {
    const transactions = []

    rawTransactions.forEach((transaction) => {
      const items = []

      // Thêm tour vào transaction
      if (transaction.tour_id) {
        items.push(`tour_${transaction.tour_id}`)
      }

      // Thêm dịch vụ phụ trợ
      if (transaction.services && Array.isArray(transaction.services)) {
        transaction.services.forEach((serviceId) => {
          if (serviceId) {
            items.push(`service_${serviceId}`)
          }
        })
      }

      // Thêm thông tin bổ sung
      if (transaction.departure_location) {
        items.push(`departure_${transaction.departure_location}`)
      }

      if (transaction.season) {
        items.push(`season_${transaction.season}`)
      }

      if (transaction.group_size) {
        if (transaction.group_size <= 2) {
          items.push("group_small")
        } else if (transaction.group_size <= 6) {
          items.push("group_medium")
        } else {
          items.push("group_large")
        }
      }

      if (items.length >= 2) {
        // Chỉ lấy transaction có ít nhất 2 items
        transactions.push(items)
      }
    })

    return transactions
  }

  /**
   * Tìm frequent itemsets sử dụng thuật toán Apriori
   */
  async findFrequentItemsets(transactions) {
    const frequentItemsets = new Map()
    const totalTransactions = transactions.length
    const minSupportCount = Math.ceil(this.minSupport * totalTransactions)

    // Tìm frequent 1-itemsets
    const itemCounts = new Map()
    transactions.forEach((transaction) => {
      transaction.forEach((item) => {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1)
      })
    })

    const frequent1 = new Map()
    itemCounts.forEach((count, item) => {
      if (count >= minSupportCount) {
        const support = count / totalTransactions
        frequent1.set(JSON.stringify([item]), {
          itemset: [item],
          support,
          count,
        })
      }
    })

    if (frequent1.size === 0) {
      return frequentItemsets
    }

    frequentItemsets.set(1, frequent1)

    // Tìm frequent k-itemsets (k > 1)
    for (let k = 2; k <= this.maxItemsetSize; k++) {
      const candidateK = this.generateCandidates(frequentItemsets.get(k - 1))

      if (candidateK.length === 0) break

      const frequentK = new Map()

      // Đếm support cho từng candidate
      candidateK.forEach((candidate) => {
        let count = 0
        transactions.forEach((transaction) => {
          if (this.isSubset(candidate, transaction)) {
            count++
          }
        })

        if (count >= minSupportCount) {
          const support = count / totalTransactions
          frequentK.set(JSON.stringify(candidate), {
            itemset: candidate,
            support,
            count,
          })
        }
      })

      if (frequentK.size === 0) break
      frequentItemsets.set(k, frequentK)

      // Emit progress
      this.emit("analysis-progress", {
        step: `frequent-${k}-itemsets`,
        count: frequentK.size,
      })
    }

    return frequentItemsets
  }

  /**
   * Tạo candidate itemsets từ frequent (k-1)-itemsets
   */
  generateCandidates(frequentKMinus1) {
    const candidates = []
    const itemsets = Array.from(frequentKMinus1.values()).map((item) => item.itemset)

    for (let i = 0; i < itemsets.length; i++) {
      for (let j = i + 1; j < itemsets.length; j++) {
        const union = [...new Set([...itemsets[i], ...itemsets[j]])]

        // Kiểm tra điều kiện Apriori: tất cả subset (k-1) phải frequent
        if (union.length === itemsets[i].length + 1) {
          if (this.hasFrequentSubsets(union, frequentKMinus1)) {
            candidates.push(union.sort())
          }
        }
      }
    }

    // Loại bỏ duplicate candidates
    const uniqueCandidates = []
    const seen = new Set()

    candidates.forEach((candidate) => {
      const key = JSON.stringify(candidate)
      if (!seen.has(key)) {
        seen.add(key)
        uniqueCandidates.push(candidate)
      }
    })

    return uniqueCandidates
  }

  /**
   * Kiểm tra tất cả subset (k-1) có frequent không
   */
  hasFrequentSubsets(itemset, frequentKMinus1) {
    for (let i = 0; i < itemset.length; i++) {
      const subset = itemset.filter((_, index) => index !== i)
      const subsetKey = JSON.stringify(subset.sort())

      if (!frequentKMinus1.has(subsetKey)) {
        return false
      }
    }
    return true
  }

  /**
   * Kiểm tra itemset có phải subset của transaction không
   */
  isSubset(itemset, transaction) {
    return itemset.every((item) => transaction.includes(item))
  }

  /**
   * Tạo association rules từ frequent itemsets
   */
  async generateAssociationRules(frequentItemsets) {
    const rules = []

    // Duyệt qua tất cả frequent itemsets có size >= 2
    for (let k = 2; k <= this.maxItemsetSize; k++) {
      if (!frequentItemsets.has(k)) continue

      const itemsetsK = frequentItemsets.get(k)

      itemsetsK.forEach((itemsetData) => {
        const { itemset, support } = itemsetData

        // Tạo tất cả possible antecedents
        for (let i = 1; i < itemset.length; i++) {
          const antecedents = this.getCombinations(itemset, i)

          antecedents.forEach((antecedent) => {
            const consequent = itemset.filter((item) => !antecedent.includes(item))

            // Tính confidence
            const antecedentKey = JSON.stringify(antecedent.sort())
            const antecedentSupport = this.findItemsetSupport(antecedent, frequentItemsets)

            if (antecedentSupport > 0) {
              const confidence = support / antecedentSupport

              if (confidence >= this.minConfidence) {
                // Tính lift
                const consequentSupport = this.findItemsetSupport(consequent, frequentItemsets)
                const lift = consequentSupport > 0 ? confidence / consequentSupport : 0

                if (lift >= this.minLift) {
                  rules.push({
                    antecedent: antecedent.sort(),
                    consequent: consequent.sort(),
                    support: Number.parseFloat(support.toFixed(4)),
                    confidence: Number.parseFloat(confidence.toFixed(4)),
                    lift: Number.parseFloat(lift.toFixed(4)),
                    antecedentSupport: Number.parseFloat(antecedentSupport.toFixed(4)),
                    consequentSupport: Number.parseFloat(consequentSupport.toFixed(4)),
                  })
                }
              }
            }
          })
        }
      })
    }

    // Sắp xếp rules theo lift và confidence
    return rules.sort((a, b) => {
      if (Math.abs(a.lift - b.lift) > 0.001) {
        return b.lift - a.lift
      }
      return b.confidence - a.confidence
    })
  }

  /**
   * Tìm support của một itemset
   */
  findItemsetSupport(itemset, frequentItemsets) {
    const size = itemset.length
    if (!frequentItemsets.has(size)) return 0

    const itemsetsOfSize = frequentItemsets.get(size)
    const key = JSON.stringify(itemset.sort())

    const found = itemsetsOfSize.get(key)
    return found ? found.support : 0
  }

  /**
   * Tạo tất cả combinations của một array
   */
  getCombinations(array, size) {
    if (size === 1) {
      return array.map((item) => [item])
    }

    const combinations = []
    for (let i = 0; i < array.length; i++) {
      const rest = array.slice(i + 1)
      const restCombinations = this.getCombinations(rest, size - 1)

      restCombinations.forEach((combination) => {
        combinations.push([array[i], ...combination])
      })
    }

    return combinations
  }

  /**
   * Đếm tổng số itemsets
   */
  countTotalItemsets(frequentItemsets) {
    let total = 0
    frequentItemsets.forEach((itemsets) => {
      total += itemsets.size
    })
    return total
  }

  /**
   * Lấy gợi ý dựa trên items đã chọn
   */
  async getRecommendations(selectedItems, options = {}) {
    const maxRecommendations = options.maxRecommendations || 10
    const includeRelatedTours = options.includeRelatedTours || false

    try {
      // Phân tích dữ liệu nếu chưa có
      const analysisResult = await this.analyzeTransactions()
      const rules = analysisResult.associationRules

      const recommendations = []
      const selectedSet = new Set(selectedItems)

      // Tìm rules phù hợp
      rules.forEach((rule) => {
        const antecedentSet = new Set(rule.antecedent)
        const consequentSet = new Set(rule.consequent)

        // Kiểm tra antecedent có subset của selected items không
        const isAntecedentSubset = rule.antecedent.every((item) => selectedSet.has(item))

        // Kiểm tra consequent chưa được chọn
        const hasUnselectedConsequent = rule.consequent.some((item) => !selectedSet.has(item))

        if (isAntecedentSubset && hasUnselectedConsequent) {
          rule.consequent.forEach((item) => {
            if (!selectedSet.has(item)) {
              recommendations.push({
                item,
                confidence: rule.confidence,
                lift: rule.lift,
                support: rule.support,
                rule: {
                  antecedent: rule.antecedent,
                  consequent: rule.consequent,
                },
              })
            }
          })
        }
      })

      // Loại bỏ duplicate và sắp xếp
      const uniqueRecommendations = this.deduplicateRecommendations(recommendations)
      const sortedRecommendations = uniqueRecommendations
        .sort((a, b) => {
          if (Math.abs(a.confidence - b.confidence) > 0.001) {
            return b.confidence - a.confidence
          }
          return b.lift - a.lift
        })
        .slice(0, maxRecommendations)

      // Enrich với thông tin chi tiết
      const enrichedRecommendations = await this.enrichRecommendations(sortedRecommendations)

      this.emit("recommendations-ready", {
        selectedItems,
        recommendations: enrichedRecommendations,
        totalRules: rules.length,
      })

      return enrichedRecommendations
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý:", error)
      return []
    }
  }

  /**
   * Loại bỏ duplicate recommendations
   */
  deduplicateRecommendations(recommendations) {
    const seen = new Map()

    recommendations.forEach((rec) => {
      const existing = seen.get(rec.item)
      if (!existing || rec.confidence > existing.confidence) {
        seen.set(rec.item, rec)
      }
    })

    return Array.from(seen.values())
  }

  /**
   * Enrich recommendations với thông tin chi tiết
   */
  async enrichRecommendations(recommendations) {
    const enriched = []

    for (const rec of recommendations) {
      const item = rec.item
      let enrichedRec = { ...rec }

      try {
        if (item.startsWith("service_")) {
          const serviceId = item.replace("service_", "")
          const serviceInfo = await this.getServiceInfo(serviceId)

          if (serviceInfo) {
            enrichedRec = {
              ...enrichedRec,
              type: "service",
              id: serviceId,
              name: serviceInfo.ten_dich_vu,
              description: serviceInfo.mo_ta,
              price: serviceInfo.gia,
              category: serviceInfo.loai_dich_vu,
            }
          }
        } else if (item.startsWith("tour_")) {
          const tourId = item.replace("tour_", "")
          const tourInfo = await this.getTourInfo(tourId)

          if (tourInfo) {
            enrichedRec = {
              ...enrichedRec,
              type: "tour",
              id: tourId,
              name: tourInfo.ten_tour,
              destination: tourInfo.dia_diem_den,
              price: tourInfo.gia_nguoi_lon,
              duration: tourInfo.thoi_gian_tour,
            }
          }
        } else {
          // Các loại item khác (departure, season, group_size)
          enrichedRec = {
            ...enrichedRec,
            type: "attribute",
            name: this.getAttributeName(item),
            description: this.getAttributeDescription(item),
          }
        }

        enriched.push(enrichedRec)
      } catch (error) {
        console.error(`Lỗi khi enrich recommendation cho ${item}:`, error)
        // Vẫn thêm recommendation cơ bản
        enriched.push(enrichedRec)
      }
    }

    return enriched
  }

  /**
   * Lấy thông tin dịch vụ
   */
  async getServiceInfo(serviceId) {
    try {
      const response = await fetch(`/api/services/${serviceId}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin service ${serviceId}:`, error)
    }
    return null
  }

  /**
   * Lấy thông tin tour
   */
  async getTourInfo(tourId) {
    try {
      const response = await fetch(`/api/tours/${tourId}`)
      if (response.ok) {
        const data = await response.json()
        return data.tour
      }
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin tour ${tourId}:`, error)
    }
    return null
  }

  /**
   * Lấy tên attribute
   */
  getAttributeName(item) {
    if (item.startsWith("departure_")) {
      return `Khởi hành từ ${item.replace("departure_", "")}`
    } else if (item.startsWith("season_")) {
      return `Mùa ${item.replace("season_", "")}`
    } else if (item === "group_small") {
      return "Nhóm nhỏ (1-2 người)"
    } else if (item === "group_medium") {
      return "Nhóm vừa (3-6 người)"
    } else if (item === "group_large") {
      return "Nhóm lớn (7+ người)"
    }
    return item
  }

  /**
   * Lấy mô tả attribute
   */
  getAttributeDescription(item) {
    if (item.startsWith("departure_")) {
      return "Điểm khởi hành phổ biến"
    } else if (item.startsWith("season_")) {
      return "Thời điểm du lịch lý tưởng"
    } else if (item.includes("group_")) {
      return "Kích thước nhóm phù hợp"
    }
    return "Thuộc tính bổ sung"
  }

  /**
   * Tạo combo packages tự động
   */
  async generateComboPackages(options = {}) {
    const maxCombos = options.maxCombos || 20
    const minDiscount = options.minDiscount || 0.05
    const maxDiscount = options.maxDiscount || 0.3

    try {
      const analysisResult = await this.analyzeTransactions()
      const rules = analysisResult.associationRules

      const combos = []

      rules.forEach((rule, index) => {
        if (rule.lift >= 1.2 && rule.confidence >= 0.6) {
          const allItems = [...rule.antecedent, ...rule.consequent]

          // Tính discount dựa trên confidence và lift
          const discountRate = Math.min(maxDiscount, Math.max(minDiscount, (rule.confidence - 0.5) * 0.6))

          combos.push({
            id: `combo_${index + 1}`,
            name: `Combo ${index + 1}`,
            items: allItems,
            confidence: rule.confidence,
            lift: rule.lift,
            support: rule.support,
            discountRate: Number.parseFloat(discountRate.toFixed(3)),
            description: `Gói combo được gợi ý dựa trên phân tích ${analysisResult.transactions} giao dịch`,
          })
        }
      })

      // Sắp xếp và giới hạn số lượng
      return combos.sort((a, b) => b.lift - a.lift).slice(0, maxCombos)
    } catch (error) {
      console.error("Lỗi khi tạo combo packages:", error)
      return []
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Lấy thống kê cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Export cho sử dụng global
window.AprioriEngine = AprioriEngine

// Tạo instance global
window.aprioriEngine = new AprioriEngine({
  minSupport: 0.05,
  minConfidence: 0.3,
  minLift: 1.0,
  maxItemsetSize: 4,
})

// Event listeners cho debugging
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  window.aprioriEngine.on("analysis-start", (data) => {
    console.log("🔍 Bắt đầu phân tích Apriori:", data)
  })

  window.aprioriEngine.on("analysis-progress", (data) => {
    console.log("⏳ Tiến trình phân tích:", data)
  })

  window.aprioriEngine.on("analysis-complete", (data) => {
    console.log("✅ Hoàn thành phân tích:", {
      transactions: data.transactions,
      frequentItemsets: window.aprioriEngine.countTotalItemsets(data.frequentItemsets),
      associationRules: data.associationRules.length,
    })
  })

  window.aprioriEngine.on("recommendations-ready", (data) => {
    console.log("💡 Gợi ý sẵn sàng:", data)
  })
}
