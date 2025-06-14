// Tour Detail Enhanced - Giữ nguyên tất cả tính năng gốc và thêm Combo Recommendations
// Biến toàn cục để lưu thông tin tour
let currentTour = null
let currentRecommendations = []
let selectedServices = []
const comboAnalysisResult = null

// Hàm format tiền tệ
function formatCurrency(amount) {
  if (!amount) return "0 VNĐ"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Hàm format ngày tháng
function formatDate(dateString) {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Hàm hiển thị thông báo
function showNotification(message, type = "success", duration = 3000) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : type === "warning" ? "fa-exclamation-triangle" : "fa-times-circle"}"></i>
      <p>${message}</p>
    </div>
  `

  // Style cho notification
  Object.assign(notification.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: type === "success" ? "#28a745" : type === "warning" ? "#ffc107" : "#dc3545",
    color: "white",
    padding: "15px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: "9999",
    display: "flex",
    alignItems: "center",
    animation: "slideIn 0.3s ease-out forwards",
    maxWidth: "400px",
  })

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in forwards"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, duration)
}

// Hàm hiển thị lỗi
function showError(message) {
  hideLoading()
  showNotification(message, "error", 5000)
}

// Hàm hiển thị thông báo thành công
function showSuccess(message, duration = 3000) {
  showNotification(message, "success", duration)
}

// =====================================================
// APRIORI COMBO RECOMMENDATIONS
// =====================================================

// Load combo recommendations khi trang được tải
async function loadComboRecommendations() {
  const tourId = getTourIdFromUrl()
  if (!tourId) return

  try {
    showComboLoading()

    // Sử dụng Apriori Engine để lấy gợi ý
    const recommendations = await window.aprioriEngine.getRecommendations([`tour_${tourId}`], {
      maxRecommendations: 8,
      includeRelatedTours: true,
    })

    if (recommendations.length > 0) {
      currentRecommendations = recommendations
      displayComboRecommendations(recommendations)
      updateBookingFormWithRecommendations()
    } else {
      hideComboSection()
    }
  } catch (error) {
    console.error("Error loading combo recommendations:", error)
    hideComboSection()
  }
}

// Hiển thị loading cho combo section
function showComboLoading() {
  let comboSection = document.getElementById("combo-recommendations-section")
  if (!comboSection) {
    comboSection = createComboRecommendationsSection()
    insertComboSection(comboSection)
  }

  const container = document.getElementById("combo-recommendations-container")
  if (container) {
    container.innerHTML = `
      <div class="loading-recommendations">
        <div class="spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p>Đang phân tích dữ liệu và tạo gợi ý thông minh cho bạn...</p>
        <div class="analysis-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="analysis-progress"></div>
          </div>
          <span class="progress-text" id="analysis-text">Đang tải dữ liệu...</span>
        </div>
      </div>
    `
  }

  // Lắng nghe progress events
  window.aprioriEngine.on("analysis-progress", updateAnalysisProgress)
}

// Cập nhật tiến trình phân tích
function updateAnalysisProgress(data) {
  const progressFill = document.getElementById("analysis-progress")
  const progressText = document.getElementById("analysis-text")

  if (!progressFill || !progressText) return

  const progressMessages = {
    "data-loaded": { text: "Đã tải dữ liệu giao dịch", progress: 25 },
    "frequent-itemsets": { text: "Đang tìm mẫu phổ biến", progress: 50 },
    "association-rules": { text: "Đang tạo luật kết hợp", progress: 75 },
    "recommendations-ready": { text: "Hoàn thành phân tích", progress: 100 },
  }

  const stepInfo = progressMessages[data.step]
  if (stepInfo) {
    progressFill.style.width = `${stepInfo.progress}%`
    progressText.textContent = `${stepInfo.text} (${data.count || 0})`
  }
}

// Ẩn combo section
function hideComboSection() {
  const comboSection = document.getElementById("combo-recommendations-section")
  if (comboSection) {
    comboSection.style.display = "none"
  }
}

// Hiển thị gợi ý combo
function displayComboRecommendations(recommendations) {
  const container = document.getElementById("combo-recommendations-container")
  if (!container) return

  const serviceRecommendations = recommendations.filter((rec) => rec.type === "service")
  const tourRecommendations = recommendations.filter((rec) => rec.type === "tour")

  let html = ""

  if (serviceRecommendations.length > 0) {
    html += `
      <div class="recommendation-category">
        <h4><i class="fas fa-plus-circle"></i> Dịch vụ được gợi ý cho tour này</h4>
        <p class="recommendation-subtitle">
          Dựa trên phân tích hành vi của ${comboAnalysisResult?.transactions || "hàng nghìn"} khách hàng trước đó
        </p>
        <div class="recommendations-grid">
          ${serviceRecommendations.map((rec) => createServiceRecommendationCard(rec)).join("")}
        </div>
      </div>
    `
  }

  if (tourRecommendations.length > 0) {
    html += `
      <div class="recommendation-category" style="margin-top: 2rem;">
        <h4><i class="fas fa-route"></i> Tour liên quan được gợi ý</h4>
        <p class="recommendation-subtitle">Khách hàng thường đặt những tour này cùng nhau</p>
        <div class="recommendations-grid">
          ${tourRecommendations.map((rec) => createTourRecommendationCard(rec)).join("")}
        </div>
      </div>
    `
  }

  // Thêm thông tin phân tích
  html += `
    <div class="analysis-info">
      <div class="analysis-stats">
        <div class="stat-item">
          <i class="fas fa-chart-line"></i>
          <span>Độ tin cậy cao nhất: ${Math.max(...recommendations.map((r) => r.confidence * 100)).toFixed(1)}%</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-users"></i>
          <span>Dựa trên ${comboAnalysisResult?.transactions || "nhiều"} giao dịch thực tế</span>
        </div>
        <div class="stat-item">
          <i class="fas fa-brain"></i>
          <span>Thuật toán Apriori</span>
        </div>
      </div>
    </div>
  `

  container.innerHTML = html

  // Thêm event listeners
  addRecommendationEventListeners()
}

// Tạo card cho service recommendation
function createServiceRecommendationCard(rec) {
  const formattedPrice = formatCurrency(rec.price)
  const confidencePercent = (rec.confidence * 100).toFixed(1)
  const liftValue = rec.lift.toFixed(2)

  return `
    <div class="recommendation-card service-card" data-service-id="${rec.id}" data-type="service">
      <div class="recommendation-header">
        <h5>${rec.name}</h5>
        <div class="confidence-badge" title="Độ tin cậy: ${confidencePercent}% | Lift: ${liftValue}">
          <i class="fas fa-chart-line"></i>
          ${confidencePercent}%
        </div>
      </div>
      <p class="recommendation-description">${rec.description || "Dịch vụ chất lượng cao"}</p>
      <div class="recommendation-metrics">
        <div class="metric">
          <span class="metric-label">Lift:</span>
          <span class="metric-value">${liftValue}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Support:</span>
          <span class="metric-value">${(rec.support * 100).toFixed(1)}%</span>
        </div>
      </div>
      <div class="recommendation-footer">
        <div class="price-info">
          <span class="price">${formattedPrice}</span>
          <span class="per-unit">/ người</span>
        </div>
        <button class="btn btn-outline btn-sm add-service-btn" data-service-id="${rec.id}">
          <i class="fas fa-plus"></i> Thêm vào combo
        </button>
      </div>
    </div>
  `
}

// Tạo card cho tour recommendation
function createTourRecommendationCard(rec) {
  const formattedPrice = formatCurrency(rec.price)
  const confidencePercent = (rec.confidence * 100).toFixed(1)

  return `
    <div class="recommendation-card tour-card" data-tour-id="${rec.id}" data-type="tour">
      <div class="recommendation-header">
        <h5>${rec.name}</h5>
        <div class="confidence-badge">
          <i class="fas fa-chart-line"></i>
          ${confidencePercent}%
        </div>
      </div>
      <p class="recommendation-description">
        <i class="fas fa-map-marker-alt"></i> ${rec.destination}
        ${rec.duration ? `<br><i class="fas fa-clock"></i> ${rec.duration}` : ""}
      </p>
      <div class="recommendation-footer">
        <div class="price-info">
          <span class="price">${formattedPrice}</span>
          <span class="per-unit">/ người</span>
        </div>
        <a href="/tour/${rec.id}" class="btn btn-outline btn-sm" target="_blank">
          <i class="fas fa-external-link-alt"></i> Xem chi tiết
        </a>
      </div>
    </div>
  `
}

// Tạo section cho combo recommendations
function createComboRecommendationsSection() {
  const section = document.createElement("section")
  section.id = "combo-recommendations-section"
  section.className = "combo-recommendations"
  section.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h3><i class="fas fa-magic"></i> Gợi ý Combo thông minh</h3>
        <p>Được tạo bởi AI dựa trên phân tích dữ liệu từ hàng nghìn khách hàng</p>
      </div>
      <div id="combo-recommendations-container">
        <!-- Content will be loaded here -->
      </div>
      <div id="selected-combo-summary" style="display: none;">
        <h4><i class="fas fa-gift"></i> Combo bạn đã chọn</h4>
        <div id="selected-items-list"></div>
        <div id="combo-total-price"></div>
      </div>
    </div>
  `
  return section
}

// Chèn combo section vào vị trí phù hợp
function insertComboSection(section) {
  const tourDetailContainer = document.querySelector(".tour-detail-container")
  if (tourDetailContainer) {
    tourDetailContainer.parentNode.insertBefore(section, tourDetailContainer.nextSibling)
  }
}

// Cập nhật booking form với recommendations
function updateBookingFormWithRecommendations() {
  const additionalServicesContainer = document.getElementById("additional-services")
  if (!additionalServicesContainer) return

  const serviceRecommendations = currentRecommendations.filter((rec) => rec.type === "service").slice(0, 3)

  if (serviceRecommendations.length === 0) return

  // Thêm section cho recommended services trong booking form
  const recommendedServicesHtml = `
    <div class="recommended-services-section">
      <h5><i class="fas fa-star"></i> Dịch vụ được AI gợi ý</h5>
      <p class="recommendation-note">Dựa trên phân tích hành vi khách hàng</p>
      <div id="booking-recommended-services">
        ${serviceRecommendations
          .map(
            (rec) => `
          <div class="recommended-service-item">
            <label class="service-checkbox">
              <input type="checkbox" name="recommended_service" value="${rec.id}" data-price="${rec.price}">
              <span class="checkmark"></span>
              <div class="service-info">
                <span class="service-name">${rec.name}</span>
                <span class="service-price">${formatCurrency(rec.price)}</span>
                <span class="confidence-text">${(rec.confidence * 100).toFixed(0)}% khách chọn (Lift: ${rec.lift.toFixed(2)})</span>
              </div>
            </label>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `

  additionalServicesContainer.insertAdjacentHTML("afterbegin", recommendedServicesHtml)

  // Thêm event listeners cho checkboxes
  const checkboxes = document.querySelectorAll('#booking-recommended-services input[type="checkbox"]')
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateTotalPrice()
      updateRealTimeRecommendations()
    })
  })
}

// Cập nhật gợi ý real-time khi khách hàng thay đổi lựa chọn
async function updateRealTimeRecommendations() {
  const tourId = getTourIdFromUrl()
  if (!tourId) return

  // Lấy dịch vụ đã chọn
  const selectedServiceIds = Array.from(document.querySelectorAll('input[name="recommended_service"]:checked')).map(
    (checkbox) => checkbox.value,
  )

  if (selectedServiceIds.length === 0) return

  try {
    // Tạo danh sách items hiện tại
    const currentItems = [`tour_${tourId}`, ...selectedServiceIds.map((id) => `service_${id}`)]

    // Lấy gợi ý mới
    const newRecommendations = await window.aprioriEngine.getRecommendations(currentItems, {
      maxRecommendations: 5,
    })

    // Cập nhật gợi ý trong combo section
    updateDynamicRecommendations(newRecommendations)
  } catch (error) {
    console.error("Lỗi khi cập nhật gợi ý real-time:", error)
  }
}

// Cập nhật gợi ý động
function updateDynamicRecommendations(recommendations) {
  const container = document.getElementById("combo-recommendations-container")
  if (!container) return

  // Tìm hoặc tạo dynamic recommendations section
  let dynamicSection = document.querySelector(".dynamic-recommendations")

  if (!dynamicSection) {
    dynamicSection = document.createElement("div")
    dynamicSection.className = "dynamic-recommendations"
    container.appendChild(dynamicSection)
  }

  const serviceRecommendations = recommendations.filter((rec) => rec.type === "service")

  if (serviceRecommendations.length > 0) {
    dynamicSection.innerHTML = `
      <div class="recommendation-category dynamic">
        <h4><i class="fas fa-sync-alt"></i> Gợi ý bổ sung dựa trên lựa chọn của bạn</h4>
        <p class="recommendation-subtitle">Cập nhật real-time khi bạn thay đổi lựa chọn</p>
        <div class="recommendations-grid">
          ${serviceRecommendations.map((rec) => createServiceRecommendationCard(rec)).join("")}
        </div>
      </div>
    `

    // Thêm event listeners cho các nút mới
    addRecommendationEventListeners()
  } else {
    dynamicSection.innerHTML = ""
  }
}

// Thêm event listeners cho recommendation cards
function addRecommendationEventListeners() {
  // Event listeners cho nút "Thêm vào combo"
  document.querySelectorAll(".add-service-btn").forEach((btn) => {
    // Remove existing listeners
    const newBtn = btn.cloneNode(true)
    btn.parentNode.replaceChild(newBtn, btn)

    newBtn.addEventListener("click", function () {
      const serviceId = this.dataset.serviceId
      addServiceToCombo(serviceId)
    })
  })
}

// Thêm service vào combo
function addServiceToCombo(serviceId) {
  const recommendation = currentRecommendations.find((rec) => rec.id == serviceId && rec.type === "service")
  if (!recommendation) return

  // Kiểm tra xem đã thêm chưa
  if (selectedServices.find((s) => s.id == serviceId)) {
    showNotification("Dịch vụ này đã được thêm vào combo", "warning")
    return
  }

  // Thêm vào danh sách
  selectedServices.push(recommendation)

  // Cập nhật UI
  updateSelectedComboSummary()
  updateBookingFormCheckboxes(serviceId)

  // Hiển thị thông báo
  showSuccess(`Đã thêm "${recommendation.name}" vào combo`)

  // Cập nhật nút
  const btn = document.querySelector(`[data-service-id="${serviceId}"]`)
  if (btn) {
    btn.innerHTML = '<i class="fas fa-check"></i> Đã thêm'
    btn.classList.remove("btn-outline")
    btn.classList.add("btn-success")
    btn.disabled = true
  }

  // Cập nhật gợi ý real-time
  updateRealTimeRecommendations()
}

// Cập nhật summary của combo đã chọn
function updateSelectedComboSummary() {
  const summaryContainer = document.getElementById("selected-combo-summary")
  const itemsList = document.getElementById("selected-items-list")
  const totalPrice = document.getElementById("combo-total-price")

  if (!summaryContainer || !itemsList || !totalPrice) return

  if (selectedServices.length === 0) {
    summaryContainer.style.display = "none"
    return
  }

  summaryContainer.style.display = "block"

  // Hiển thị danh sách items
  const itemsHtml = selectedServices
    .map(
      (service) => `
    <div class="selected-item">
      <div class="item-info">
        <span class="item-name">${service.name}</span>
        <div class="item-metrics">
          <span class="confidence">Tin cậy: ${(service.confidence * 100).toFixed(1)}%</span>
          <span class="lift">Lift: ${service.lift.toFixed(2)}</span>
        </div>
      </div>
      <span class="item-price">${formatCurrency(service.price)}</span>
      <button class="remove-item-btn" data-service-id="${service.id}" title="Xóa khỏi combo">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `,
    )
    .join("")

  itemsList.innerHTML = itemsHtml

  // Tính tổng giá và discount
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const discount = calculateComboDiscount(total, selectedServices.length)
  const finalPrice = total - discount

  totalPrice.innerHTML = `
    <div class="combo-pricing">
      <div class="original-price">Giá gốc: ${formatCurrency(total)}</div>
      ${discount > 0 ? `<div class="discount">Giảm giá combo: -${formatCurrency(discount)}</div>` : ""}
      <div class="final-price">Tổng cộng: ${formatCurrency(finalPrice)}</div>
      <div class="savings-info">
        <i class="fas fa-piggy-bank"></i>
        Tiết kiệm: ${formatCurrency(discount)} (${((discount / total) * 100).toFixed(1)}%)
      </div>
    </div>
  `

  // Thêm event listeners cho nút xóa
  itemsList.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const serviceId = this.dataset.serviceId
      removeServiceFromCombo(serviceId)
    })
  })
}

// Xóa service khỏi combo
function removeServiceFromCombo(serviceId) {
  selectedServices = selectedServices.filter((s) => s.id != serviceId)
  updateSelectedComboSummary()

  // Cập nhật nút trong recommendation card
  const btn = document.querySelector(`[data-service-id="${serviceId}"]`)
  if (btn) {
    btn.innerHTML = '<i class="fas fa-plus"></i> Thêm vào combo'
    btn.classList.remove("btn-success")
    btn.classList.add("btn-outline")
    btn.disabled = false
  }

  // Cập nhật checkbox trong booking form
  const checkbox = document.querySelector(`input[name="recommended_service"][value="${serviceId}"]`)
  if (checkbox) {
    checkbox.checked = false
    updateTotalPrice()
  }

  // Cập nhật gợi ý real-time
  updateRealTimeRecommendations()
}

// Cập nhật checkboxes trong booking form
function updateBookingFormCheckboxes(serviceId) {
  const checkbox = document.querySelector(`input[name="recommended_service"][value="${serviceId}"]`)
  if (checkbox) {
    checkbox.checked = true
    updateTotalPrice()
  }
}

// Tính giảm giá combo
function calculateComboDiscount(totalPrice, serviceCount) {
  // Giảm giá dựa trên số lượng dịch vụ và AI confidence
  let discountRate = 0

  if (serviceCount >= 3) {
    discountRate = 0.15 // 15% cho 3+ dịch vụ
  } else if (serviceCount >= 2) {
    discountRate = 0.1 // 10% cho 2 dịch vụ
  }

  // Bonus discount dựa trên AI confidence
  const avgConfidence = selectedServices.reduce((sum, s) => sum + s.confidence, 0) / selectedServices.length
  if (avgConfidence > 0.7) {
    discountRate += 0.05 // Thêm 5% nếu confidence cao
  }

  return Math.min(totalPrice * discountRate, totalPrice * 0.3) // Tối đa 30%
}

// =====================================================
// ORIGINAL FUNCTIONS (Updated)
// =====================================================

// Hàm tải chi tiết tour (updated)
async function loadTourDetail() {
  const tourId = getTourIdFromUrl()
  if (!tourId) {
    console.error("Không tìm thấy ID tour trong URL")
    showError("Không thể tải thông tin tour. Vui lòng thử lại sau.")
    return
  }

  try {
    showLoading()
    console.log(`Đang tải thông tin tour ID: ${tourId}`)

    const timestamp = new Date().getTime()
    const response = await fetch(`/api/tours/${tourId}?_=${timestamp}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Không thể tải thông tin tour (HTTP ${response.status})`)
    }

    const data = await response.json()
    console.log("Dữ liệu tour nhận được:", data)

    if (data.error) {
      throw new Error(data.error)
    }

    currentTour = data

    // Cập nhật thông tin tour vào HTML
    updateTourInfo(data)
    updateTourImages(data.hinh_anh)
    updateTourSchedule(data.lich_trinh)
    updateIncludedServices(data.dich_vu_bao_gom)
    updateTourNotes(data.luu_y)
    updateReviews(data.danh_gia, data.diem_danh_gia_trung_binh)
    updateBookingForm(data.tour)
    updateAdditionalServices(data.dich_vu_phu_tro_goi_y)

    hideLoading()

    // Load combo recommendations sau khi tour data đã sẵn sàng
    setTimeout(() => {
      loadComboRecommendations()
    }, 500)

    // Lưu vào localStorage
    try {
      localStorage.setItem(
        `tour_${tourId}`,
        JSON.stringify({
          data: data,
          timestamp: new Date().getTime(),
        }),
      )
    } catch (e) {
      console.warn("Không thể lưu dữ liệu tour vào localStorage:", e)
    }
  } catch (error) {
    console.error("Lỗi khi tải chi tiết tour:", error)
    showError(`Không thể tải thông tin tour: ${error.message}`)
  }
}

// Lấy ID tour từ URL
function getTourIdFromUrl() {
  const pathParts = window.location.pathname.split("/")
  const tourIndex = pathParts.indexOf("tour")
  if (tourIndex !== -1 && pathParts[tourIndex + 1]) {
    const tourId = Number.parseInt(pathParts[tourIndex + 1])
    return tourId
  }
  return null
}

// Cập nhật thông tin cơ bản của tour
function updateTourInfo(data) {
  const tour = data.tour

  document.title = `${tour.ten_tour} - TravelVN`
  document.getElementById("tour-name").textContent = tour.ten_tour
  document.getElementById("breadcrumb-tour-name").textContent = tour.ten_tour
  document.getElementById("tour-category").textContent = tour.ten_danh_muc
  document.getElementById("tour-title").textContent = tour.ten_tour
  document.getElementById("tour-departure").textContent = tour.dia_diem_khoi_hanh
  document.getElementById("tour-destination").textContent = tour.dia_diem_den
  document.getElementById("tour-duration").textContent = tour.thoi_gian_tour
  document.getElementById("tour-start-date").textContent = formatDate(tour.ngay_khoi_hanh)
  document.getElementById("tour-description").innerHTML = `<p>${tour.mo_ta}</p>`

  updateRatingStars("tour-stars", data.diem_danh_gia_trung_binh)
  document.getElementById("tour-rating-count").textContent = `${data.danh_gia.length} đánh giá`

  document.getElementById("tour-price").textContent = formatCurrency(tour.gia_nguoi_lon)
  if (tour.gia_tre_em) {
    document.getElementById("tour-price-child").textContent = `${formatCurrency(tour.gia_tre_em)} / trẻ em`
    document.getElementById("tour-price-child").style.display = "block"
  } else {
    document.getElementById("tour-price-child").style.display = "none"
  }

  if (tour.ngay_khoi_hanh) {
    const dateInput = document.getElementById("booking-date")
    if (dateInput) {
      const date = new Date(tour.ngay_khoi_hanh)
      const formattedDate = date.toISOString().split("T")[0]
      dateInput.value = formattedDate
      dateInput.min = formattedDate
    }
  }
}

// Cập nhật hình ảnh tour
function updateTourImages(images) {
  if (!images || images.length === 0) return

  const fallbackImage = document.getElementById("fallback-image")
  if (fallbackImage) fallbackImage.style.display = "none"

  const staticGallery = document.getElementById("static-gallery")
  if (staticGallery) staticGallery.style.display = "block"

  const mainImage = images.find((img) => img.la_anh_chinh) || images[0]

  const mainImageElement = document.querySelector(".main-image img")
  if (mainImageElement) {
    mainImageElement.src = mainImage.duong_dan
    mainImageElement.alt = mainImage.mo_ta || "Ảnh tour"
  }

  const thumbnailContainer = document.querySelector(".thumbnail-container")
  if (thumbnailContainer) {
    thumbnailContainer.innerHTML = ""

    images.forEach((image, index) => {
      const thumbnailDiv = document.createElement("div")
      thumbnailDiv.className = `thumbnail ${index === 0 ? "active" : ""}`
      thumbnailDiv.setAttribute("data-src", image.duong_dan)
      thumbnailDiv.setAttribute("data-alt", image.mo_ta || "Ảnh tour")

      const img = document.createElement("img")
      img.loading = "lazy"
      img.src = image.duong_dan
      img.alt = image.mo_ta || "Thumbnail"
      img.onerror = function () {
        this.src = "https://via.placeholder.com/150x100?text=Thumbnail"
      }

      thumbnailDiv.appendChild(img)
      thumbnailContainer.appendChild(thumbnailDiv)

      thumbnailDiv.addEventListener("click", function () {
        const imgSrc = this.getAttribute("data-src")
        const imgAlt = this.getAttribute("data-alt")

        const mainImg = document.querySelector(".main-image img")
        if (mainImg) {
          mainImg.src = imgSrc
          mainImg.alt = imgAlt
        }

        document.querySelectorAll(".thumbnail").forEach((t) => t.classList.remove("active"))
        this.classList.add("active")
      })
    })
  }
}

// Cập nhật lịch trình tour
function updateTourSchedule(schedule) {
  if (!schedule || schedule.length === 0) return

  const itineraryTab = document.getElementById("itinerary")
  if (!itineraryTab) return

  itineraryTab.innerHTML = ""

  schedule.forEach((item) => {
    const dayDiv = document.createElement("div")
    dayDiv.className = "itinerary-day"

    let hoatDongHTML = ""
    try {
      let hoatDong = item.hoat_dong
      if (typeof hoatDong === "string") {
        hoatDong = JSON.parse(hoatDong)
      }

      if (Array.isArray(hoatDong) && hoatDong.length > 0) {
        hoatDongHTML = `
          <div class="itinerary-activities">
            <h4>Hoạt động:</h4>
            <ul>
              ${hoatDong.map((activity) => `<li>${activity}</li>`).join("")}
            </ul>
          </div>
        `
      }
    } catch (e) {
      console.error("Lỗi khi parse hoạt động:", e)
    }

    let buaAnHTML = ""
    try {
      let buaAn = item.bua_an
      if (typeof buaAn === "string") {
        buaAn = JSON.parse(buaAn)
      }

      const meals = []
      if (buaAn.sang) meals.push("Sáng")
      if (buaAn.trua) meals.push("Trưa")
      if (buaAn.toi) meals.push("Tối")

      if (meals.length > 0) {
        buaAnHTML = `<p><strong>Bữa ăn:</strong> ${meals.join(", ")}</p>`
      }
    } catch (e) {
      console.error("Lỗi khi parse bữa ăn:", e)
    }

    dayDiv.innerHTML = `
      <h3>${item.tieu_de}</h3>
      <div class="itinerary-content">
        <p>${item.mo_ta}</p>
        ${hoatDongHTML}
        
        <div class="itinerary-details">
          ${item.dia_diem ? `<p><strong>Địa điểm:</strong> ${item.dia_diem}</p>` : ""}
          ${item.khach_san ? `<p><strong>Khách sạn:</strong> ${item.khach_san}</p>` : ""}
          ${item.phuong_tien ? `<p><strong>Phương tiện:</strong> ${item.phuong_tien}</p>` : ""}
          ${buaAnHTML}
        </div>
        
        ${
          item.ghi_chu
            ? `
          <div class="itinerary-note">
            <p><strong>Lưu ý:</strong> ${item.ghi_chu}</p>
          </div>
        `
            : ""
        }
      </div>
    `

    itineraryTab.appendChild(dayDiv)
  })
}

// Cập nhật dịch vụ bao gồm và không bao gồm
function updateIncludedServices(services) {
  if (!services || services.length === 0) {
    console.log("Không có dữ liệu dịch vụ")
    return
  }

  const includedTab = document.getElementById("included")
  const excludedTab = document.getElementById("excluded")

  if (!includedTab || !excludedTab) return

  console.log("Updating services:", services)

  const includedServices = services.filter((service) => service.la_bao_gom === 1)
  const excludedServices = services.filter((service) => service.la_bao_gom === 0)

  console.log("Included services:", includedServices.length)
  console.log("Excluded services:", excludedServices.length)

  if (includedServices.length > 0) {
    includedTab.innerHTML =
      '<ul class="service-list included">' +
      includedServices
        .map(
          (service) => `
        <li>
          <i class="${service.icon || "fas fa-check-circle"}"></i>
          <span><strong>${service.ten_dich_vu}</strong> - ${service.mo_ta}</span>
        </li>
      `,
        )
        .join("") +
      "</ul>"
  } else {
    includedTab.innerHTML = "<p>Không có thông tin dịch vụ bao gồm.</p>"
  }

  if (excludedServices.length > 0) {
    excludedTab.innerHTML =
      '<ul class="service-list excluded">' +
      excludedServices
        .map(
          (service) => `
        <li>
          <i class="${service.icon || "fas fa-times-circle"}"></i>
          <span><strong>${service.ten_dich_vu}</strong> - ${service.mo_ta}</span>
        </li>
      `,
        )
        .join("") +
      "</ul>"
  } else {
    excludedTab.innerHTML = "<p>Không có thông tin dịch vụ không bao gồm.</p>"
  }
}

// Cập nhật lưu ý tour
function updateTourNotes(notes) {
  if (!notes || notes.length === 0) return

  const notesTab = document.getElementById("notes")
  if (!notesTab) return

  notesTab.innerHTML = '<div class="note-content">'

  const groupedNotes = notes.reduce((groups, note) => {
    const type = note.loai_luu_y
    if (!groups[type]) groups[type] = []
    groups[type].push(note)
    return groups
  }, {})

  const noteTypeLabels = {
    quan_trong: "Lưu ý quan trọng",
    khuyen_khich: "Khuyến khích",
    cam_oan: "Cam kết",
  }

  Object.entries(groupedNotes).forEach(([type, typeNotes]) => {
    const typeLabel = noteTypeLabels[type] || type

    notesTab.innerHTML += `
      <h4>${typeLabel}</h4>
      <ul class="note-list ${type}">
        ${typeNotes
          .map(
            (note) => `
          <li>
            <i class="${note.icon || "fas fa-info-circle"}"></i>
            <div>
              <strong>${note.tieu_de}</strong>
              <p>${note.noi_dung}</p>
            </div>
          </li>
        `,
          )
          .join("")}
      </ul>
    `
  })

  notesTab.innerHTML += "</div>"
}

// Cập nhật đánh giá
function updateReviews(reviews, averageRating) {
  document.getElementById("average-rating").textContent = averageRating.toFixed(1)
  updateRatingStars("average-rating-stars", averageRating)
  document.getElementById("total-reviews").textContent = `${reviews.length} đánh giá`

  if (reviews.length > 0) {
    const ratingCounts = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      const rating = Math.floor(review.diem_danh_gia)
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1]++
      }
    })

    for (let i = 1; i <= 5; i++) {
      const count = ratingCounts[i - 1]
      const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0

      document.getElementById(`rating-${i}`).style.width = `${percent}%`
      document.getElementById(`rating-${i}-count`).textContent = count
    }
  }

  const reviewsList = document.getElementById("reviews-list")
  if (reviewsList) {
    reviewsList.innerHTML = ""

    if (reviews.length > 0) {
      reviews.slice(0, 5).forEach((review) => {
        const reviewCard = document.createElement("div")
        reviewCard.className = "review-card"

        reviewCard.innerHTML = `
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                <img src="https://via.placeholder.com/50x50?text=Avatar" alt="Avatar">
              </div>
              <div class="reviewer-details">
                <div class="reviewer-name">${review.ho_ten}</div>
                <div class="review-date">${formatDate(review.ngay_danh_gia)}</div>
              </div>
            </div>
            <div class="review-rating">
              <div class="stars">
                ${generateStarRating(review.diem_danh_gia)}
              </div>
            </div>
          </div>
          <div class="review-content">
            <p>${review.noi_dung}</p>
          </div>
        `

        reviewsList.appendChild(reviewCard)
      })

      const loadMoreBtn = document.getElementById("load-more-reviews")
      if (loadMoreBtn) {
        loadMoreBtn.style.display = reviews.length > 5 ? "block" : "none"
      }
    } else {
      reviewsList.innerHTML = '<div class="no-reviews"><p>Chưa có đánh giá nào cho tour này.</p></div>'

      const loadMoreBtn = document.getElementById("load-more-reviews")
      if (loadMoreBtn) {
        loadMoreBtn.style.display = "none"
      }
    }
  }
}

// Cập nhật form đặt tour
function updateBookingForm(tour) {
  document.getElementById("tour-price").textContent = formatCurrency(tour.gia_nguoi_lon)

  const childPriceElement = document.getElementById("tour-price-child")
  if (childPriceElement) {
    if (tour.gia_tre_em) {
      childPriceElement.textContent = `${formatCurrency(tour.gia_tre_em)} / trẻ em`
      childPriceElement.style.display = "block"
    } else {
      childPriceElement.style.display = "none"
    }
  }

  const dateInput = document.getElementById("booking-date")
  if (dateInput && tour.ngay_khoi_hanh) {
    const date = new Date(tour.ngay_khoi_hanh)
    const formattedDate = date.toISOString().split("T")[0]
    dateInput.value = formattedDate
    dateInput.min = formattedDate
  }

  updateTotalPrice()
}

// Cập nhật dịch vụ phụ trợ
function updateAdditionalServices(services) {
  const servicesContainer = document.getElementById("additional-services")
  if (!servicesContainer) return

  if (!services || services.length === 0) {
    servicesContainer.style.display = "none"
    return
  }

  servicesContainer.style.display = "block"
  servicesContainer.innerHTML = "<h3>Dịch vụ phụ trợ</h3>"

  services.forEach((service) => {
    const serviceItem = document.createElement("div")
    serviceItem.className = "service-item"

    serviceItem.innerHTML = `
      <label class="service-checkbox">
        <input type="checkbox" value="${service.id}" data-price="${service.gia}" class="service-checkbox">
        <span>${service.ten_dich_vu}</span>
      </label>
      <div class="service-price">${formatCurrency(service.gia)}</div>
      <div class="service-description">${service.mo_ta}</div>
    `

    servicesContainer.appendChild(serviceItem)
  })

  const checkboxes = servicesContainer.querySelectorAll("input[type='checkbox']")
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateTotalPrice()
    })
  })
}

// Cập nhật tổng tiền
function updateTotalPrice() {
  if (!currentTour) return

  const adults = Number.parseInt(document.getElementById("adults").value) || 0
  const children = Number.parseInt(document.getElementById("children").value) || 0

  let total = adults * currentTour.tour.gia_nguoi_lon
  if (children > 0 && currentTour.tour.gia_tre_em) {
    total += children * currentTour.tour.gia_tre_em
  }

  // Thêm giá dịch vụ phụ trợ nếu được chọn
  const serviceCheckboxes = document.querySelectorAll(".service-checkbox input:checked")
  serviceCheckboxes.forEach((checkbox) => {
    const price = Number.parseFloat(checkbox.getAttribute("data-price")) || 0
    total += price
  })

  // Thêm giá dịch vụ recommended
  const recommendedCheckboxes = document.querySelectorAll('input[name="recommended_service"]:checked')
  recommendedCheckboxes.forEach((checkbox) => {
    const price = Number.parseFloat(checkbox.getAttribute("data-price")) || 0
    total += price * adults
  })

  // Áp dụng combo discount
  const comboDiscount = calculateComboDiscount(total, selectedServices.length)
  total -= comboDiscount

  document.getElementById("total-price").textContent = formatCurrency(total)
}

// Tạo HTML cho đánh giá sao
function generateStarRating(rating) {
  let stars = ""
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}

// Cập nhật hiển thị sao đánh giá
function updateRatingStars(elementId, rating) {
  const starsElement = document.getElementById(elementId)
  if (starsElement) {
    starsElement.innerHTML = generateStarRating(rating)
  }
}

// Hiển thị loading
function showLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "flex"
  }

  const tourDetailContainer = document.querySelector(".tour-detail-container")
  if (tourDetailContainer) {
    tourDetailContainer.style.display = "none"
  }
}

// Ẩn loading
function hideLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "none"
  }

  const tourDetailContainer = document.querySelector(".tour-detail-container")
  if (tourDetailContainer) {
    tourDetailContainer.style.display = "grid"
  }
}

// Kiểm tra trạng thái yêu thích khi tải trang
async function checkFavoriteStatus() {
  const tourId = getTourIdFromUrl()
  if (!tourId) return

  try {
    let user = null
    try {
      const userJson = localStorage.getItem("user")
      if (userJson) {
        user = JSON.parse(userJson)
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đăng nhập:", error)
    }

    if (!user) return

    const response = await fetch(`/api/tour-yeu-thich?tour_id=${tourId}`)
    const data = await response.json()

    const saveTourBtn = document.getElementById("save-tour-btn")
    if (saveTourBtn) {
      if (data.is_favorite) {
        saveTourBtn.innerHTML = '<i class="fas fa-heart"></i> Đã lưu vào yêu thích'
        saveTourBtn.classList.add("saved")
      } else {
        saveTourBtn.innerHTML = '<i class="far fa-heart"></i> Lưu tour yêu thích'
        saveTourBtn.classList.remove("saved")
      }
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error)
  }
}

// Tính tổng tiền để sử dụng khi chuyển trang
function calculateTotalPrice() {
  if (!currentTour) return 0

  const adults = Number.parseInt(document.getElementById("adults").value) || 0
  const children = Number.parseInt(document.getElementById("children").value) || 0

  let total = adults * currentTour.tour.gia_nguoi_lon
  if (children > 0 && currentTour.tour.gia_tre_em) {
    total += children * currentTour.tour.gia_tre_em
  }

  const serviceCheckboxes = document.querySelectorAll(".service-checkbox input:checked")
  serviceCheckboxes.forEach((checkbox) => {
    const price = Number.parseFloat(checkbox.getAttribute("data-price")) || 0
    total += price
  })

  const recommendedCheckboxes = document.querySelectorAll('input[name="recommended_service"]:checked')
  recommendedCheckboxes.forEach((checkbox) => {
    const price = Number.parseFloat(checkbox.getAttribute("data-price")) || 0
    total += price * adults
  })

  // Áp dụng combo discount
  const comboDiscount = calculateComboDiscount(total, selectedServices.length)
  total -= comboDiscount

  return total
}

// Xử lý khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Tải thông tin tour
  loadTourDetail()

  // Xử lý tabs
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      const tabPanes = document.querySelectorAll(".tab-pane")
      tabPanes.forEach((pane) => pane.classList.remove("active"))

      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Xử lý nút tăng/giảm số lượng
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    const newButton = button.cloneNode(true)
    button.parentNode.replaceChild(newButton, button)

    newButton.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const target = this.getAttribute("data-target")
      const input = document.getElementById(target)
      const currentValue = Number.parseInt(input.value) || 0

      if (this.classList.contains("plus")) {
        input.value = currentValue + 1
      } else if (this.classList.contains("minus")) {
        if (currentValue > (target === "adults" ? 1 : 0)) {
          input.value = currentValue - 1
        }
      }

      updateTotalPrice()
    })
  })

  // Xử lý form đặt tour
  const bookingForm = document.getElementById("booking-form")
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      e.stopPropagation()

      let user = null
      try {
        const userJson = localStorage.getItem("user")
        if (userJson) {
          user = JSON.parse(userJson)
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error)
      }

      if (!user) {
        alert("Vui lòng đăng nhập để đặt tour!")
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.href)
        return false
      }

      const tourId = getTourIdFromUrl()
      const departureDate = document.getElementById("booking-date").value
      const adults = Number.parseInt(document.getElementById("adults").value) || 1
      const children = Number.parseInt(document.getElementById("children").value) || 0

      // Lấy dịch vụ phụ trợ đã chọn
      const additionalServices = []
      document.querySelectorAll(".service-checkbox input:checked").forEach((checkbox) => {
        const serviceItem = checkbox.closest(".service-item")
        additionalServices.push({
          id_dich_vu: checkbox.value,
          so_luong: 1,
          ten_dich_vu: serviceItem.querySelector("span").textContent,
          gia: Number.parseFloat(checkbox.getAttribute("data-price")) || 0,
        })
      })

      // Lấy dịch vụ recommended đã chọn
      document.querySelectorAll('input[name="recommended_service"]:checked').forEach((checkbox) => {
        const serviceItem = checkbox.closest(".recommended-service-item")
        const serviceName = serviceItem.querySelector(".service-name").textContent
        additionalServices.push({
          id_dich_vu: checkbox.value,
          so_luong: adults,
          ten_dich_vu: serviceName,
          gia: Number.parseFloat(checkbox.getAttribute("data-price")) || 0,
          is_recommended: true,
        })
      })

      const bookingInfo = {
        tourId: tourId,
        tourName: document.getElementById("tour-title").textContent,
        tourImage: document.querySelector(".main-image img").src,
        departureDate: departureDate,
        adults: adults,
        children: children,
        adultPrice: currentTour.tour.gia_nguoi_lon,
        childPrice: currentTour.tour.gia_tre_em,
        additionalServices: additionalServices,
        selectedComboServices: selectedServices,
        comboDiscount: calculateComboDiscount(calculateTotalPrice(), selectedServices.length),
        totalPrice: calculateTotalPrice(),
      }

      try {
        localStorage.setItem("booking_info", JSON.stringify(bookingInfo))
        console.log("Đã lưu thông tin đặt tour:", bookingInfo)

        window.location.href = `/don-dat-tour/${tourId}`
      } catch (error) {
        console.error("Lỗi khi lưu thông tin đặt tour:", error)
        showError("Có lỗi xảy ra khi chuẩn bị đặt tour. Vui lòng thử lại sau.")
      }

      return false
    })
  }

  // Thêm xử lý cho nút lưu tour yêu thích
  const saveTourBtn = document.getElementById("save-tour-btn")
  if (saveTourBtn) {
    saveTourBtn.addEventListener("click", async () => {
      let user = null
      try {
        const userJson = localStorage.getItem("user")
        if (userJson) {
          user = JSON.parse(userJson)
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra đăng nhập:", error)
      }

      if (!user) {
        alert("Vui lòng đăng nhập để lưu tour yêu thích!")
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.href)
        return
      }

      const tourId = getTourIdFromUrl()
      if (!tourId) return

      try {
        const checkResponse = await fetch(`/api/tour-yeu-thich?tour_id=${tourId}`)
        const checkData = await checkResponse.json()

        if (checkData.is_favorite) {
          const response = await fetch(`/api/tour-yeu-thich/${tourId}`, {
            method: "DELETE",
          })

          const result = await response.json()
          if (result.success) {
            saveTourBtn.innerHTML = '<i class="far fa-heart"></i> Lưu tour yêu thích'
            saveTourBtn.classList.remove("saved")
            showSuccess("Đã xóa tour khỏi danh sách yêu thích")
          } else {
            alert(result.error || "Có lỗi xảy ra")
          }
        } else {
          const response = await fetch("/api/tour-yeu-thich", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_tour: tourId }),
          })

          const result = await response.json()
          if (result.success) {
            saveTourBtn.innerHTML = '<i class="fas fa-heart"></i> Đã lưu vào yêu thích'
            saveTourBtn.classList.add("saved")
            showSuccess("Đã thêm tour vào danh sách yêu thích")
          } else {
            alert(result.error || "Có lỗi xảy ra")
          }
        }
      } catch (error) {
        console.error("Lỗi khi xử lý yêu thích:", error)
        alert("Có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    })
  }

  checkFavoriteStatus()
})

// =====================================================
// END OF ENHANCED TOUR DETAIL SCRIPT
// Tất cả tính năng gốc được giữ nguyên + Combo AI
// =====================================================
