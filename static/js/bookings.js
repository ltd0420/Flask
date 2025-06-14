// Biến toàn cục
let allBookings = []
let filteredBookings = []

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

// Hàm hiển thị loading
function showLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "flex"
  }

  const bookingsContainer = document.querySelector(".bookings-container")
  if (bookingsContainer) {
    bookingsContainer.style.display = "none"
  }
}

// Hàm ẩn loading
function hideLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "none"
  }

  const bookingsContainer = document.querySelector(".bookings-container")
  if (bookingsContainer) {
    bookingsContainer.style.display = "block"
  }
}

// Hàm lấy danh sách đơn đặt tour
async function loadBookings() {
  try {
    showLoading()

    const response = await fetch("/api/bookings", {
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

    allBookings = data.bookings || []
    filteredBookings = [...allBookings]

    renderBookings()
    hideLoading()
  } catch (error) {
    console.error("Lỗi khi tải danh sách đơn đặt tour:", error)
    hideLoading()
    showError("Không thể tải danh sách đơn đặt tour. Vui lòng thử lại sau.")
  }
}

// Hàm hiển thị danh sách đơn đặt tour
function renderBookings() {
  const bookingsList = document.getElementById("bookings-list")
  const noBookings = document.getElementById("no-bookings")

  if (!bookingsList || !noBookings) return

  if (filteredBookings.length === 0) {
    bookingsList.style.display = "none"
    noBookings.style.display = "block"
    return
  }

  bookingsList.style.display = "block"
  noBookings.style.display = "none"

  bookingsList.innerHTML = ""

  filteredBookings.forEach((booking) => {
    const bookingCard = createBookingCard(booking)
    bookingsList.appendChild(bookingCard)
  })
}

// Hàm tạo card đơn đặt tour
function createBookingCard(booking) {
  const card = document.createElement("div")
  card.className = "booking-card"

  const statusClass = booking.trang_thai.replace(/\s+/g, "-").toLowerCase()

  card.innerHTML = `
    <div class="booking-header">
      <div class="booking-id">Đơn hàng #${booking.id}</div>
      <div class="booking-status ${statusClass}">${booking.trang_thai}</div>
    </div>
    
    <div class="booking-content">
      <div class="booking-tour-info">
        <div class="tour-image">
          <img src="${booking.hinh_anh || "/static/images/tours/default-tour.jpg"}" 
               alt="${booking.ten_tour}" 
               onerror="this.src='/static/images/tours/default-tour.jpg'">
        </div>
        <div class="tour-details">
          <div class="tour-name">${booking.ten_tour}</div>
          <div class="tour-info-grid">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${booking.dia_diem_khoi_hanh} → ${booking.dia_diem_den}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-calendar-alt"></i>
              <span>${formatDate(booking.ngay_khoi_hanh)}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span>Đặt ngày ${formatDate(booking.ngay_dat)}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-users"></i>
              <span>${booking.so_nguoi_lon} người lớn${booking.so_tre_em > 0 ? `, ${booking.so_tre_em} trẻ em` : ""}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="booking-details">
        <div class="detail-group">
          <div class="detail-label">Tổng tiền</div>
          <div class="detail-value">${formatCurrency(booking.tong_tien)}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Trạng thái</div>
          <div class="detail-value">${booking.trang_thai}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Ngày đặt</div>
          <div class="detail-value">${formatDate(booking.ngay_dat)}</div>
        </div>
      </div>
      
      <div class="booking-actions">
        <a href="/tour/${booking.id_tour}" class="btn btn-outline">Xem tour</a>
        ${
          booking.trang_thai === "chờ xác nhận"
            ? `<button class="btn btn-danger" onclick="cancelBooking(${booking.id})">Hủy đơn</button>`
            : ""
        }
        <button class="btn btn-primary" onclick="viewBookingDetail(${booking.id})">Chi tiết</button>
      </div>
    </div>
  `

  return card
}

// Hàm lọc đơn đặt tour
function filterBookings() {
  const statusFilter = document.getElementById("status-filter").value
  const timeFilter = document.getElementById("time-filter").value

  filteredBookings = allBookings.filter((booking) => {
    // Lọc theo trạng thái
    if (statusFilter && booking.trang_thai !== statusFilter) {
      return false
    }

    // Lọc theo thời gian
    if (timeFilter) {
      const bookingDate = new Date(booking.ngay_dat)
      const now = new Date()
      const daysDiff = (now - bookingDate) / (1000 * 60 * 60 * 24)

      if (daysDiff > Number.parseInt(timeFilter)) {
        return false
      }
    }

    return true
  })

  renderBookings()
}

// Hàm hủy đơn đặt tour
async function cancelBooking(bookingId) {
  if (!confirm("Bạn có chắc chắn muốn hủy đơn đặt tour này?")) {
    return
  }

  try {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (response.ok && result.success) {
      alert("Hủy đơn đặt tour thành công!")
      loadBookings() // Tải lại danh sách
    } else {
      alert(result.error || "Có lỗi xảy ra khi hủy đơn đặt tour")
    }
  } catch (error) {
    console.error("Lỗi khi hủy đơn đặt tour:", error)
    alert("Có lỗi xảy ra khi hủy đơn đặt tour")
  }
}

// Hàm xem chi tiết đơn đặt tour
function viewBookingDetail(bookingId) {
  // Tạo modal hiển thị chi tiết đơn đặt tour
  const booking = filteredBookings.find((b) => b.id === bookingId)
  if (!booking) {
    alert("Không tìm thấy thông tin đơn đặt tour")
    return
  }

  // Tạo modal
  const modal = document.createElement("div")
  modal.className = "booking-detail-modal"
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  modal.innerHTML = `
    <div class="modal-content" style="
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    ">
      <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3>Chi tiết đơn đặt tour #${booking.id}</h3>
        <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>
      
      <div class="booking-detail-content">
        <div class="detail-section" style="margin-bottom: 1.5rem;">
          <h4>Thông tin tour</h4>
          <p><strong>Tên tour:</strong> ${booking.ten_tour}</p>
          <p><strong>Điểm khởi hành:</strong> ${booking.dia_diem_khoi_hanh}</p>
          <p><strong>Điểm đến:</strong> ${booking.dia_diem_den}</p>
          <p><strong>Ngày khởi hành:</strong> ${formatDate(booking.ngay_khoi_hanh)}</p>
        </div>
        
        <div class="detail-section" style="margin-bottom: 1.5rem;">
          <h4>Thông tin đặt tour</h4>
          <p><strong>Ngày đặt:</strong> ${formatDate(booking.ngay_dat)}</p>
          <p><strong>Số người lớn:</strong> ${booking.so_nguoi_lon}</p>
          <p><strong>Số trẻ em:</strong> ${booking.so_tre_em}</p>
          <p><strong>Tổng tiền:</strong> ${formatCurrency(booking.tong_tien)}</p>
          <p><strong>Trạng thái:</strong> <span class="booking-status ${booking.trang_thai.replace(/\s+/g, "-").toLowerCase()}">${booking.trang_thai}</span></p>
        </div>
        
        <div class="modal-actions" style="display: flex; gap: 1rem; justify-content: flex-end;">
          <a href="/tour/${booking.id_tour}" class="btn btn-outline">Xem tour</a>
          <button class="btn btn-primary close-modal">Đóng</button>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Xử lý đóng modal
  modal.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.removeChild(modal)
    })
  })

  // Đóng modal khi click bên ngoài
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
    }
  })
}

// Hàm hiển thị lỗi
function showError(message) {
  const bookingsContainer = document.querySelector(".bookings-container")
  if (bookingsContainer) {
    bookingsContainer.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 1rem;"></i>
        <h3>Đã xảy ra lỗi</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Thử lại</button>
      </div>
    `
  }
}

// Xử lý khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Tải danh sách đơn đặt tour
  loadBookings()

  // Xử lý bộ lọc
  const statusFilter = document.getElementById("status-filter")
  const timeFilter = document.getElementById("time-filter")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterBookings)
  }

  if (timeFilter) {
    timeFilter.addEventListener("change", filterBookings)
  }
})
