// Wishlist page functionality

// Biến toàn cục
let wishlistTours = []

// Hàm format tiền tệ
function formatCurrency(amount) {
  if (!amount) return "0 VNĐ"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Hàm hiển thị loading
function showLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "flex"
  }

  const profileLayout = document.querySelector(".profile-layout")
  if (profileLayout) {
    profileLayout.style.display = "none"
  }
}

// Hàm ẩn loading
function hideLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "none"
  }

  const profileLayout = document.querySelector(".profile-layout")
  if (profileLayout) {
    profileLayout.style.display = "grid"
  }
}

// Cập nhật thông tin người dùng trong sidebar
function updateSidebarInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const sidebarName = document.getElementById("sidebar-user-name")
    const sidebarEmail = document.getElementById("sidebar-user-email")

    if (sidebarName && user.ho_ten) {
      sidebarName.textContent = user.ho_ten
    }

    if (sidebarEmail && user.email) {
      sidebarEmail.textContent = user.email
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin sidebar:", error)
  }
}

// Hàm lấy danh sách tour yêu thích
async function loadWishlistTours() {
  try {
    showLoading()

    const response = await fetch("/api/tour-yeu-thich", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    wishlistTours = data.tours || []
    renderWishlistTours()
    hideLoading()
  } catch (error) {
    console.error("Lỗi khi tải danh sách tour yêu thích:", error)
    hideLoading()
    showError("Không thể tải danh sách tour yêu thích. Vui lòng thử lại sau.")
  }
}

// Hàm hiển thị danh sách tour yêu thích
function renderWishlistTours() {
  const tourGrid = document.getElementById("wishlist-tours")
  const noWishlist = document.getElementById("no-wishlist")

  if (!tourGrid || !noWishlist) return

  if (wishlistTours.length === 0) {
    tourGrid.style.display = "none"
    noWishlist.style.display = "block"
    return
  }

  tourGrid.style.display = "grid"
  noWishlist.style.display = "none"

  tourGrid.innerHTML = ""

  wishlistTours.forEach((tour) => {
    const tourCard = createTourCard(tour)
    tourGrid.appendChild(tourCard)
  })
}

// Hàm tạo card tour
function createTourCard(tour) {
  const card = document.createElement("div")
  card.className = "tour-card"

  const imageUrl = tour.hinh_anh_chinh || "/static/images/tours/default-tour.jpg"
  const rating = tour.diem_danh_gia_trung_binh || 0
  const reviewCount = tour.so_luong_danh_gia || 0

  card.innerHTML = `
    <div class="tour-image">
      <img src="${imageUrl}" alt="${tour.ten_tour}" onerror="this.src='/static/images/tours/default-tour.jpg'">
      <div class="tour-category">${tour.ten_danh_muc || "Tour"}</div>
      <button class="favorite-btn active" onclick="removeFromWishlist(${tour.id})">
        <i class="fas fa-heart"></i>
      </button>
    </div>
    
    <div class="tour-content">
      <h3 class="tour-title">${tour.ten_tour}</h3>
      
      <div class="tour-info">
        <div class="tour-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${tour.dia_diem_khoi_hanh} → ${tour.dia_diem_den}</span>
        </div>
        
        <div class="tour-duration">
          <i class="fas fa-clock"></i>
          <span>${tour.thoi_gian_tour}</span>
        </div>
        
        <div class="tour-rating">
          <div class="stars">
            ${generateStarRating(rating)}
          </div>
          <span class="rating-count">(${reviewCount} đánh giá)</span>
        </div>
      </div>
      
      <div class="tour-price">
        <span class="current-price">${formatCurrency(tour.gia_nguoi_lon)}</span>
        <span class="price-unit">/ người</span>
      </div>
      
      <div class="tour-actions">
        <a href="/tour/${tour.id}" class="btn btn-primary">
          <i class="fas fa-eye"></i>
          Xem chi tiết
        </a>
      </div>
    </div>
  `

  return card
}

// Hàm tạo HTML cho đánh giá sao
function generateStarRating(rating) {
  let stars = ""
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  // Sao đầy
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  // Sao nửa
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  // Sao rỗng
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}

// Hàm xóa tour khỏi danh sách yêu thích
async function removeFromWishlist(tourId) {
  if (!confirm("Bạn có chắc chắn muốn xóa tour này khỏi danh sách yêu thích?")) {
    return
  }

  try {
    // Disable button during request
    const button = document.querySelector(`button[onclick="removeFromWishlist(${tourId})"]`)
    if (button) {
      button.disabled = true
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
    }

    const response = await fetch(`/api/tour-yeu-thich/${tourId}`, {
      method: "DELETE",
    })

    const result = await response.json()

    if (response.ok && result.success) {
      // Xóa tour khỏi danh sách hiện tại
      wishlistTours = wishlistTours.filter((tour) => tour.id !== tourId)
      renderWishlistTours()

      // Hiển thị thông báo
      showSuccess("Đã xóa tour khỏi danh sách yêu thích")
    } else {
      alert(result.error || "Có lỗi xảy ra khi xóa tour")

      // Re-enable button on error
      if (button) {
        button.disabled = false
        button.innerHTML = '<i class="fas fa-heart"></i>'
      }
    }
  } catch (error) {
    console.error("Lỗi khi xóa tour yêu thích:", error)
    alert("Có lỗi xảy ra khi xóa tour")

    // Re-enable button on error
    const button = document.querySelector(`button[onclick="removeFromWishlist(${tourId})"]`)
    if (button) {
      button.disabled = false
      button.innerHTML = '<i class="fas fa-heart"></i>'
    }
  }
}

// Hàm hiển thị thông báo thành công
function showSuccess(message, duration = 3000) {
  const notification = document.createElement("div")
  notification.className = "success-notification"
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <p>${message}</p>
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, duration)
}

// Hàm hiển thị lỗi
function showError(message) {
  const profileLayout = document.querySelector(".profile-layout")
  if (profileLayout) {
    profileLayout.innerHTML = `
      <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
        <h3>Đã xảy ra lỗi</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">
          <i class="fas fa-refresh"></i>
          Thử lại
        </button>
      </div>
    `
  }
}

// Xử lý khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Cập nhật thông tin sidebar
  updateSidebarInfo()

  // Tải danh sách tour yêu thích
  loadWishlistTours()

  // Xử lý đăng xuất từ sidebar
  const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn")
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        window.logout()
      }
    })
  }
})
