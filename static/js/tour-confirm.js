// Biến toàn cục để lưu thông tin đặt tour
let bookingInfo = null

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

// Hàm hiển thị lỗi
function showError(message) {
  hideLoading()

  const errorElement = document.getElementById("error-message")
  const errorText = document.getElementById("error-text")

  if (errorElement && errorText) {
    errorText.textContent = message
    errorElement.style.display = "block"
  }

  // Ẩn nội dung xác nhận
  const confirmContainer = document.querySelector(".confirm-container")
  if (confirmContainer) {
    confirmContainer.style.display = "none"
  }
}

// Hàm hiển thị thông báo thành công
function showSuccess(message, orderId) {
  hideLoading()

  // Tạo phần tử thông báo thành công
  const confirmContainer = document.querySelector(".confirm-container")
  if (confirmContainer) {
    confirmContainer.innerHTML = `
      <div class="success-message" style="display: block;">
        <i class="fas fa-check-circle"></i>
        <h3>Đặt tour thành công!</h3>
        <p>${message}</p>
        ${orderId ? `<p>Mã đơn hàng: <strong>${orderId}</strong></p>` : ""}
        <div class="success-actions" style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
          <a href="/bookings" class="btn btn-primary">Xem đơn đặt tour</a>
          <a href="/tours" class="btn btn-outline">Tiếp tục khám phá</a>
        </div>
      </div>
    `
  }
}

// Hiển thị loading
function showLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "flex"
  }

  // Ẩn nội dung xác nhận
  const confirmContainer = document.querySelector(".confirm-container")
  if (confirmContainer) {
    confirmContainer.style.display = "none"
  }
}

// Ẩn loading
function hideLoading() {
  const loadingIndicator = document.getElementById("loading-indicator")
  if (loadingIndicator) {
    loadingIndicator.style.display = "none"
  }

  // Hiển thị nội dung xác nhận
  const confirmContainer = document.querySelector(".confirm-container")
  if (confirmContainer) {
    confirmContainer.style.display = "block"
  }
}

// Hàm lấy thông tin đặt tour từ localStorage
function getBookingInfo() {
  try {
    const bookingInfoJson = localStorage.getItem("booking_info")
    if (!bookingInfoJson) {
      throw new Error("Không tìm thấy thông tin đặt tour")
    }

    return JSON.parse(bookingInfoJson)
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đặt tour:", error)
    return null
  }
}

// Hàm cập nhật thông tin đặt tour vào giao diện
function updateBookingInfo() {
  if (!bookingInfo) return

  // Cập nhật thông tin tour
  document.getElementById("tour-name").textContent = bookingInfo.tourName
  document.getElementById("tour-image").src = bookingInfo.tourImage
  document.getElementById("tour-link").href = `/tour/${bookingInfo.tourId}`

  // Cập nhật thông tin đặt tour
  document.getElementById("departure-date").textContent = formatDate(bookingInfo.departureDate)
  document.getElementById("adults-count").textContent = bookingInfo.adults
  document.getElementById("children-count").textContent = bookingInfo.children

  // Cập nhật chi tiết giá
  document.getElementById("adult-price-detail").textContent =
    `${bookingInfo.adults} x ${formatCurrency(bookingInfo.adultPrice)}`
  document.getElementById("adult-price-total").textContent = formatCurrency(bookingInfo.adults * bookingInfo.adultPrice)

  // Cập nhật giá trẻ em nếu có
  const childrenPriceRow = document.getElementById("children-price-row")
  if (bookingInfo.children > 0 && bookingInfo.childPrice) {
    childrenPriceRow.style.display = "grid"
    document.getElementById("child-price-detail").textContent =
      `${bookingInfo.children} x ${formatCurrency(bookingInfo.childPrice)}`
    document.getElementById("child-price-total").textContent = formatCurrency(
      bookingInfo.children * bookingInfo.childPrice,
    )
  } else {
    childrenPriceRow.style.display = "none"
  }

  // Cập nhật dịch vụ phụ trợ
  const additionalServicesContainer = document.getElementById("additional-services-container")
  const additionalServicesList = document.getElementById("additional-services-list")

  if (bookingInfo.additionalServices && bookingInfo.additionalServices.length > 0) {
    additionalServicesContainer.style.display = "block"
    additionalServicesList.innerHTML = ""

    bookingInfo.additionalServices.forEach((service) => {
      const serviceRow = document.createElement("div")
      serviceRow.className = "service-row"
      serviceRow.innerHTML = `
        <div class="service-name">${service.ten_dich_vu}</div>
        <div class="service-quantity">1 x ${formatCurrency(service.gia)}</div>
        <div class="service-price">${formatCurrency(service.gia)}</div>
      `
      additionalServicesList.appendChild(serviceRow)
    })
  } else {
    additionalServicesContainer.style.display = "none"
  }

  // Cập nhật tổng tiền
  document.getElementById("total-price").textContent = formatCurrency(bookingInfo.totalPrice)

  // Lấy thông tin người dùng từ localStorage
  try {
    const userJson = localStorage.getItem("user")
    if (userJson) {
      const user = JSON.parse(userJson)
      document.getElementById("customer-name").textContent = user.ho_ten || "Chưa cập nhật"
      document.getElementById("customer-email").textContent = user.email || "Chưa cập nhật"
      document.getElementById("customer-phone").textContent = user.so_dien_thoai || "Chưa cập nhật"
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error)
  }
}

// Hàm xử lý đặt tour
async function bookTour() {
  if (!bookingInfo) {
    showError("Không tìm thấy thông tin đặt tour")
    return
  }

  // Kiểm tra đồng ý điều khoản
  const termsCheckbox = document.getElementById("terms-checkbox")
  if (!termsCheckbox.checked) {
    alert("Vui lòng đồng ý với điều khoản và điều kiện để tiếp tục")
    return
  }

  // Lấy phương thức thanh toán
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value

  try {
    showLoading()

    // Chuẩn bị dữ liệu gửi đi
    const bookingData = {
      id_tour: bookingInfo.tourId,
      ngay_khoi_hanh: bookingInfo.departureDate,
      so_nguoi_lon: bookingInfo.adults,
      so_tre_em: bookingInfo.children,
      dich_vu_phu_tro: bookingInfo.additionalServices.map((service) => ({
        id_dich_vu: service.id_dich_vu,
        so_luong: 1,
      })),
      phuong_thuc_thanh_toan: paymentMethod,
    }

    console.log("Đang gửi dữ liệu đặt tour:", bookingData)

    // Gửi request đặt tour
    const response = await fetch("/api/dat-tour", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log("Kết quả đặt tour:", result)

    if (result.error) {
      showError(result.error)
    } else {
      // Xóa thông tin đặt tour khỏi localStorage
      localStorage.removeItem("booking_info")

      // Hiển thị thông báo thành công
      showSuccess(
        "Cảm ơn bạn đã đặt tour với TravelVN. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.",
        result.don_dat_tour_id || "N/A",
      )
    }
  } catch (error) {
    console.error("Lỗi khi đặt tour:", error)
    showError("Có lỗi xảy ra khi đặt tour. Vui lòng thử lại sau.")
  }
}

// Xử lý khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  console.log("Trang tour-confirm đã load")

  showLoading()

  // Lấy thông tin đặt tour
  bookingInfo = getBookingInfo()
  console.log("Thông tin đặt tour từ localStorage:", bookingInfo)

  if (!bookingInfo) {
    showError("Không tìm thấy thông tin đặt tour. Vui lòng quay lại trang chi tiết tour để đặt lại.")
    return
  }

  // Cập nhật thông tin đặt tour vào giao diện
  updateBookingInfo()

  // Ẩn loading
  hideLoading()

  // Xử lý nút quay lại
  const backButton = document.getElementById("back-button")
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back()
    })
  }

  // Xử lý nút xác nhận đặt tour
  const confirmButton = document.getElementById("confirm-button")
  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      console.log("Nút xác nhận được click")
      bookTour()
    })
  }
})
