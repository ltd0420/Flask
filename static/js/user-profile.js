/**
 * user-profile.js - Xử lý các chức năng liên quan đến trang cá nhân
 */

// Cập nhật hàm document.addEventListener để kiểm tra trạng thái đăng nhập từ server
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra đăng nhập từ server
  fetch("/api/check-auth")
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        // Hiển thị thông tin người dùng
        displayUserInfo(data.user)

        // Lấy lịch sử đặt tour
        fetchBookingHistory()

        // Lấy danh sách tour yêu thích
        fetchFavoriteTours()
      } else {
        // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.href)
      }
    })
    .catch((error) => {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error)
      // Chuyển hướng về trang đăng nhập nếu có lỗi
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.href)
    })

  // Xử lý form cập nhật thông tin
  const updateProfileForm = document.getElementById("update-profile-form")
  if (updateProfileForm) {
    updateProfileForm.addEventListener("submit", handleUpdateProfile)
  }

  // Xử lý form đổi mật khẩu
  const changePasswordForm = document.getElementById("change-password-form")
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", handleChangePassword)
  }

  // Xử lý tabs
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Xóa class active từ tất cả các tab
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Thêm class active cho tab được chọn
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Đảm bảo dropdown menu hoạt động đúng trong trang profile
  setupUserDropdown()
})

/**
 * Kiểm tra trạng thái đăng nhập
 */
function checkAuthStatus() {
  fetch("/api/check-auth")
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        updateUserInfo(data.user)
      } else {
        // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
      }
    })
    .catch((error) => {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error)
    })
}

/**
 * Cập nhật thông tin người dùng trên giao diện
 */
function updateUserInfo(user) {
  // Cập nhật tên người dùng
  const userNameElements = document.querySelectorAll(".user-name")
  userNameElements.forEach((element) => {
    element.textContent = user.ho_ten || user.name || "Tài khoản"
  })

  // Cập nhật email
  const userEmailElements = document.querySelectorAll(".user-email")
  userEmailElements.forEach((element) => {
    element.textContent = user.email || ""
  })

  // Cập nhật các trường trong form thông tin cá nhân
  const fullNameInput = document.getElementById("full-name")
  const emailInput = document.getElementById("email")
  const phoneInput = document.getElementById("phone")
  const addressInput = document.getElementById("address")

  if (fullNameInput) fullNameInput.value = user.ho_ten || user.name || ""
  if (emailInput) emailInput.value = user.email || ""
  if (phoneInput) phoneInput.value = user.so_dien_thoai || user.phone || ""
  if (addressInput) addressInput.value = user.dia_chi || user.address || ""
}

/**
 * Thiết lập tabs trong trang profile
 */
function setupProfileTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")

  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Xóa class active khỏi tất cả các tab
        tabButtons.forEach((btn) => btn.classList.remove("active"))

        // Thêm class active cho tab được click
        button.classList.add("active")

        // Ẩn tất cả các tab content
        const tabContents = document.querySelectorAll(".tab-content")
        tabContents.forEach((content) => content.classList.remove("active"))

        // Hiển thị tab content tương ứng
        const tabId = button.getAttribute("data-tab")
        const tabContent = document.getElementById(tabId)
        if (tabContent) {
          tabContent.classList.add("active")
        }
      })
    })
  }
}

/**
 * Thiết lập form cập nhật thông tin
 */
function setupUpdateProfileForm() {
  const updateProfileForm = document.getElementById("update-profile-form")

  if (updateProfileForm) {
    updateProfileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const formData = new FormData(updateProfileForm)
      const userData = {}

      // Chuyển đổi FormData thành object
      for (const [key, value] of formData.entries()) {
        userData[key] = value
      }

      // Hiển thị loading
      const submitButton = updateProfileForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.disabled = true
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...'

      // Gửi yêu cầu cập nhật thông tin
      fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          if (data.error) {
            // Hiển thị thông báo lỗi
            showError("update-profile-error", data.error)
          } else {
            // Hiển thị thông báo thành công
            showNotification("Cập nhật thông tin thành công", "success")
          }
        })
        .catch((error) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          console.error("Lỗi khi cập nhật thông tin:", error)
          showError("update-profile-error", "Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.")
        })
    })
  }
}

/**
 * Thiết lập form đổi mật khẩu
 */
function setupChangePasswordForm() {
  const changePasswordForm = document.getElementById("change-password-form")

  if (changePasswordForm) {
    // Xử lý kiểm tra độ mạnh mật khẩu
    const newPasswordInput = document.getElementById("new-password")
    const passwordStrengthBar = document.getElementById("password-strength")

    if (newPasswordInput && passwordStrengthBar) {
      newPasswordInput.addEventListener("input", () => {
        const password = newPasswordInput.value
        const strength = checkPasswordStrength(password)

        // Cập nhật thanh độ mạnh mật khẩu
        passwordStrengthBar.style.width = strength.percent + "%"
        passwordStrengthBar.className = "password-strength-bar " + strength.level
      })
    }

    // Xử lý submit form
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const currentPassword = document.getElementById("current-password").value
      const newPassword = document.getElementById("new-password").value
      const confirmPassword = document.getElementById("confirm-password").value

      // Kiểm tra mật khẩu mới và xác nhận mật khẩu
      if (newPassword !== confirmPassword) {
        showError("change-password-error", "Mật khẩu mới và xác nhận mật khẩu không khớp")
        return
      }

      // Hiển thị loading
      const submitButton = changePasswordForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.disabled = true
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...'

      // Gửi yêu cầu đổi mật khẩu
      fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          if (data.error) {
            // Hiển thị thông báo lỗi
            showError("change-password-error", data.error)
          } else {
            // Hiển thị thông báo thành công
            showNotification("Đổi mật khẩu thành công", "success")

            // Reset form
            changePasswordForm.reset()
            passwordStrengthBar.style.width = "0%"
            passwordStrengthBar.className = "password-strength-bar"
          }
        })
        .catch((error) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          console.error("Lỗi khi đổi mật khẩu:", error)
          showError("change-password-error", "Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.")
        })
    })
  }
}

/**
 * Kiểm tra độ mạnh mật khẩu
 */
function checkPasswordStrength(password) {
  if (!password) {
    return { level: "", percent: 0 }
  }

  let strength = 0

  // Độ dài
  if (password.length >= 8) {
    strength += 1
  }

  // Chữ hoa
  if (/[A-Z]/.test(password)) {
    strength += 1
  }

  // Chữ thường
  if (/[a-z]/.test(password)) {
    strength += 1
  }

  // Số
  if (/[0-9]/.test(password)) {
    strength += 1
  }

  // Ký tự đặc biệt
  if (/[^A-Za-z0-9]/.test(password)) {
    strength += 1
  }

  // Xác định level và percent
  let level = ""
  let percent = 0

  if (strength <= 2) {
    level = "weak"
    percent = 33
  } else if (strength <= 4) {
    level = "medium"
    percent = 66
  } else {
    level = "strong"
    percent = 100
  }

  return { level, percent }
}

/**
 * Thiết lập lọc đơn đặt tour
 */
function setupBookingFilters() {
  const statusFilter = document.getElementById("status-filter")
  const dateFilter = document.getElementById("date-filter")

  if (statusFilter && dateFilter) {
    statusFilter.addEventListener("change", loadBookingHistory)
    dateFilter.addEventListener("change", loadBookingHistory)
  }
}

/**
 * Tải dữ liệu đơn đặt tour
 */
function loadBookingHistory() {
  const bookingHistoryContainer = document.getElementById("booking-history")

  if (bookingHistoryContainer) {
    // Hiển thị loading
    bookingHistoryContainer.innerHTML = '<p class="no-data">Đang tải dữ liệu...</p>'

    // Lấy giá trị filter
    const statusFilter = document.getElementById("status-filter")
    const dateFilter = document.getElementById("date-filter")

    let status = ""
    let days = ""

    if (statusFilter) {
      status = statusFilter.value
    }

    if (dateFilter) {
      days = dateFilter.value
    }

    // Gửi yêu cầu lấy dữ liệu
    fetch(`/api/bookings?status=${status}&days=${days}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.bookings && data.bookings.length > 0) {
          // Hiển thị dữ liệu
          let html = `
            <table class="booking-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Tour</th>
                  <th>Ngày đặt</th>
                  <th>Số người</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
          `

          data.bookings.forEach((booking) => {
            // Xác định class cho trạng thái
            let statusClass = ""
            switch (booking.trang_thai) {
              case "chờ xác nhận":
              case "chờ thanh toán":
                statusClass = "status-pending"
                break
              case "đã thanh toán":
                statusClass = "status-paid"
                break
              case "đã hủy":
                statusClass = "status-cancelled"
                break
              case "hoàn thành":
                statusClass = "status-completed"
                break
              default:
                statusClass = "status-pending"
            }

            // Format ngày
            const bookingDate = new Date(booking.ngay_dat)
            const formattedDate = bookingDate.toLocaleDateString("vi-VN")

            // Format tiền
            const formattedPrice = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(booking.tong_tien)

            html += `
              <tr>
                <td>#${booking.id}</td>
                <td>${booking.ten_tour}</td>
                <td>${formattedDate}</td>
                <td>${booking.so_nguoi_lon + (booking.so_tre_em || 0)} người</td>
                <td>${formattedPrice}</td>
                <td><span class="status ${statusClass}">${booking.trang_thai}</span></td>
                <td>
                  <a href="/booking-detail/${booking.id}" class="btn btn-primary btn-sm">Chi tiết</a>
                </td>
              </tr>
            `
          })

          html += `
              </tbody>
            </table>
          `

          bookingHistoryContainer.innerHTML = html
        } else {
          // Hiển thị thông báo không có dữ liệu
          bookingHistoryContainer.innerHTML = '<p class="no-data">Bạn chưa có đơn đặt tour nào</p>'
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu đơn đặt tour:", error)
        bookingHistoryContainer.innerHTML =
          '<p class="no-data">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>'
      })
  }
}

/**
 * Tải dữ liệu tour yêu thích
 */
function loadFavoriteTours() {
  const favoriteToursContainer = document.getElementById("favorite-tours")

  if (favoriteToursContainer) {
    // Hiển thị loading
    favoriteToursContainer.innerHTML = '<p class="no-data">Đang tải dữ liệu...</p>'

    // Gửi yêu cầu lấy dữ liệu
    fetch("/api/favorite-tours")
      .then((response) => response.json())
      .then((data) => {
        if (data.tours && data.tours.length > 0) {
          // Hiển thị dữ liệu
          let html = ""

          data.tours.forEach((tour) => {
            // Format tiền
            const formattedPrice = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(tour.gia_nguoi_lon)

            // Tạo HTML cho rating
            let starsHtml = ""
            const rating = tour.diem_danh_gia_trung_binh || 0
            for (let i = 1; i <= 5; i++) {
              if (i <= rating) {
                starsHtml += '<i class="fas fa-star"></i>'
              } else if (i - 0.5 <= rating) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>'
              } else {
                starsHtml += '<i class="far fa-star"></i>'
              }
            }

            html += `
              <div class="tour-card" onclick="window.location.href='/tour/${tour.id}'">
                <div class="tour-card-image">
                  <img src="${tour.hinh_anh_chinh || "/static/images/tour-placeholder.jpg"}" alt="${tour.ten_tour}">
                  <div class="tour-card-category">${tour.ten_danh_muc}</div>
                  <button class="remove-favorite-btn" data-tour-id="${tour.id}" onclick="removeFavorite(event, ${tour.id})">
                    <i class="fas fa-heart-broken"></i>
                  </button>
                </div>
                <div class="tour-card-content">
                  <h3 class="tour-card-title">${tour.ten_tour}</h3>
                  <div class="tour-card-info">
                    <div class="tour-card-location">
                      <i class="fas fa-map-marker-alt"></i>
                      <span>${tour.dia_diem_den}</span>
                    </div>
                    <div class="tour-card-duration">
                      <i class="fas fa-clock"></i>
                      <span>${tour.thoi_gian_tour}</span>
                    </div>
                  </div>
                  <div class="tour-card-rating">
                    <div class="stars">
                      ${starsHtml}
                    </div>
                    <span>(${tour.so_luong_danh_gia || 0} đánh giá)</span>
                  </div>
                  <div class="tour-card-price">
                    <div>
                      <span class="price">${formattedPrice}</span>
                      <span class="per-person">/ người</span>
                    </div>
                    <a href="/tour/${tour.id}" class="btn btn-primary btn-sm">Chi tiết</a>
                  </div>
                </div>
              </div>
            `
          })

          favoriteToursContainer.innerHTML = html
        } else {
          // Hiển thị thông báo không có dữ liệu
          favoriteToursContainer.innerHTML = '<p class="no-data">Bạn chưa có tour yêu thích nào</p>'
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải dữ liệu tour yêu thích:", error)
        favoriteToursContainer.innerHTML = '<p class="no-data">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>'
      })
  }
}

/**
 * Xóa tour khỏi danh sách yêu thích
 */
function removeFavorite(event, tourId) {
  // Ngăn sự kiện click lan tỏa đến thẻ cha
  event.stopPropagation()

  // Gửi yêu cầu xóa tour khỏi danh sách yêu thích
  fetch(`/api/remove-favorite/${tourId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Hiển thị thông báo thành công
        showNotification("Đã xóa tour khỏi danh sách yêu thích", "success")

        // Tải lại dữ liệu
        loadFavoriteTours()
      } else {
        // Hiển thị thông báo lỗi
        showNotification(data.error || "Đã xảy ra lỗi", "error")
      }
    })
    .catch((error) => {
      console.error("Lỗi khi xóa tour khỏi danh sách yêu thích:", error)
      showNotification("Đã xảy ra lỗi khi xóa tour khỏi danh sách yêu thích", "error")
    })
}

/**
 * Hiển thị thông báo lỗi
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)

  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      errorElement.style.display = "none"
    }, 5000)
  }
}

/**
 * Hiển thị thông báo
 */
function showNotification(message, type = "info") {
  // Tạo phần tử thông báo
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Thêm vào body
  document.body.appendChild(notification)

  // Hiển thị thông báo
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    notification.classList.remove("show")

    // Xóa khỏi DOM sau khi animation kết thúc
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

/**
 * Thiết lập nút đăng xuất
 */
function setupLogoutButtons() {
  const logoutButtons = document.querySelectorAll("#logout-btn, #sidebar-logout-btn")

  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()

      // Gửi yêu cầu đăng xuất
      fetch("/api/logout")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Chuyển hướng về trang chủ
            window.location.href = "/"
          }
        })
        .catch((error) => {
          console.error("Lỗi khi đăng xuất:", error)
          // Vẫn chuyển hướng về trang chủ
          window.location.href = "/"
        })
    })
  })
}

// Cập nhật hàm fetchBookingHistory để sử dụng API của Flask
function fetchBookingHistory() {
  fetch("/api/bookings")
    .then((response) => response.json())
    .then((data) => {
      if (data.bookings) {
        displayBookingHistory(data.bookings)
      } else {
        const bookingHistoryContainer = document.getElementById("booking-history")
        if (bookingHistoryContainer) {
          bookingHistoryContainer.innerHTML = '<p class="no-data">Bạn chưa đặt tour nào.</p>'
        }
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy lịch sử đặt tour:", error)
      showNotification("Không thể tải lịch sử đặt tour. Vui lòng thử lại sau.", "error")
    })
}

// Cập nhật hàm fetchFavoriteTours để sử dụng API của Flask
function fetchFavoriteTours() {
  fetch("/api/favorite-tours")
    .then((response) => response.json())
    .then((data) => {
      if (data.tours) {
        displayFavoriteTours(data.tours)
      } else {
        const favoriteToursContainer = document.getElementById("favorite-tours")
        if (favoriteToursContainer) {
          favoriteToursContainer.innerHTML = '<p class="no-data">Bạn chưa có tour yêu thích nào.</p>'
        }
      }
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách tour yêu thích:", error)
      showNotification("Không thể tải danh sách tour yêu thích. Vui lòng thử lại sau.", "error")
    })
}

// Cập nhật hàm removeFavoriteTour để sử dụng API của Flask
function removeFavoriteTour(tourId, tourCard) {
  fetch(`/api/remove-favorite/${tourId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Xóa card tour khỏi giao diện
        tourCard.remove()

        // Hiển thị thông báo
        showNotification("Đã xóa tour khỏi danh sách yêu thích.", "success")

        // Kiểm tra nếu không còn tour nào
        const favoriteToursContainer = document.getElementById("favorite-tours")
        if (favoriteToursContainer && favoriteToursContainer.children.length === 0) {
          favoriteToursContainer.innerHTML = '<p class="no-data">Bạn chưa có tour yêu thích nào.</p>'
        }
      } else {
        showNotification(data.message || "Không thể xóa tour khỏi danh sách yêu thích.", "error")
      }
    })
    .catch((error) => {
      console.error("Lỗi khi xóa tour yêu thích:", error)
      showNotification("Đã xảy ra lỗi. Vui lòng thử lại sau.", "error")
    })
}

// Cập nhật hàm handleUpdateProfile để sử dụng API của Flask
async function handleUpdateProfile(e) {
  e.preventDefault()

  // Lấy dữ liệu từ form
  const fullName = document.getElementById("full-name").value
  const phone = document.getElementById("phone").value
  const address = document.getElementById("address").value

  // Kiểm tra dữ liệu
  if (!fullName.trim()) {
    showNotification("Họ tên không được để trống", "error")
    return
  }

  // Hiển thị trạng thái đang xử lý
  const submitButton = e.target.querySelector('button[type="submit"]')
  const originalButtonText = submitButton.textContent
  submitButton.disabled = true
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'

  // Xóa thông báo lỗi cũ
  const errorElement = document.getElementById("update-profile-error")
  if (errorElement) {
    errorElement.textContent = ""
    errorElement.style.display = "none"
  }

  try {
    const response = await fetch("/api/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        phone: phone,
        address: address,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Cập nhật thành công
      showNotification("Cập nhật thông tin thành công!", "success")

      // Cập nhật thông tin người dùng trong localStorage nếu đang sử dụng Auth
      if (window.Auth) {
        const user = window.Auth.getCurrentUser()
        if (user) {
          user.ho_ten = fullName
          user.so_dien_thoai = phone
          user.dia_chi = address
          window.Auth.updateUserData(user)
        }
      }

      // Cập nhật giao diện
      const userNameElements = document.querySelectorAll(".user-name")
      userNameElements.forEach((element) => {
        element.textContent = fullName
      })

      // Cập nhật UI dựa trên trạng thái đăng nhập
      if (window.Auth) {
        window.Auth.updateUIBasedOnAuthState()
      }
    } else {
      // Cập nhật thất bại
      if (errorElement) {
        errorElement.textContent = data.message || "Cập nhật thông tin thất bại. Vui lòng thử lại sau."
        errorElement.style.display = "block"
      }
      showNotification(data.message || "Cập nhật thông tin thất bại", "error")
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error)

    // Hiển thị thông báo lỗi
    if (errorElement) {
      errorElement.textContent = "Đã xảy ra lỗi. Vui lòng thử lại sau."
      errorElement.style.display = "block"
    }
    showNotification("Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.", "error")
  } finally {
    // Khôi phục nút submit
    submitButton.disabled = false
    submitButton.textContent = originalButtonText
  }
}

// Cập nhật hàm handleChangePassword để sử dụng API của Flask
async function handleChangePassword(e) {
  e.preventDefault()

  // Lấy dữ liệu từ form
  const currentPassword = document.getElementById("current-password").value
  const newPassword = document.getElementById("new-password").value
  const confirmPassword = document.getElementById("confirm-password").value

  // Kiểm tra dữ liệu
  if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
    showPasswordError("Vui lòng điền đầy đủ thông tin")
    return
  }

  // Kiểm tra mật khẩu mới khớp nhau
  if (newPassword !== confirmPassword) {
    showPasswordError("Mật khẩu mới và xác nhận mật khẩu không khớp.")
    return
  }

  // Hiển thị trạng thái đang xử lý
  const submitButton = e.target.querySelector('button[type="submit"]')
  const originalButtonText = submitButton.textContent
  submitButton.disabled = true
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'

  // Xóa thông báo lỗi cũ
  clearPasswordError()

  try {
    const response = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      // Đổi mật khẩu thành công
      showNotification("Đổi mật khẩu thành công!", "success")

      // Xóa form
      e.target.reset()
    } else {
      // Đổi mật khẩu thất bại
      showPasswordError(data.message || "Đổi mật khẩu thất bại. Vui lòng thử lại sau.")
      showNotification(data.message || "Đổi mật khẩu thất bại", "error")
    }
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error)

    // Hiển thị thông báo lỗi
    showPasswordError("Đã xảy ra lỗi. Vui lòng thử lại sau.")
    showNotification("Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại sau.", "error")
  } finally {
    // Khôi phục nút submit
    submitButton.disabled = false
    submitButton.textContent = originalButtonText
  }
}

/**
 * Hiển thị thông báo lỗi mật khẩu
 */
function showPasswordError(message) {
  const errorElement = document.getElementById("change-password-error")

  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      errorElement.style.display = "none"
    }, 5000)
  }
}

/**
 * Xóa thông báo lỗi mật khẩu
 */
function clearPasswordError() {
  const errorElement = document.getElementById("change-password-error")

  if (errorElement) {
    errorElement.textContent = ""
    errorElement.style.display = "none"
  }
}

/**
 * Hiển thị thông tin người dùng
 */
function displayUserInfo(user) {
  // Cập nhật tên người dùng
  const userNameElements = document.querySelectorAll(".user-name")
  userNameElements.forEach((element) => {
    element.textContent = user.ho_ten || user.name || "Tài khoản"
  })

  // Cập nhật email
  const userEmailElements = document.querySelectorAll(".user-email")
  userEmailElements.forEach((element) => {
    element.textContent = user.email || ""
  })
}

/**
 * Hiển thị lịch sử đặt tour
 */
function displayBookingHistory(bookings) {
  const bookingHistoryContainer = document.getElementById("booking-history")

  if (bookingHistoryContainer) {
    let html = `
      <table class="booking-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Tour</th>
            <th>Ngày đặt</th>
            <th>Số người</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
    `

    bookings.forEach((booking) => {
      // Xác định class cho trạng thái
      let statusClass = ""
      switch (booking.trang_thai) {
        case "chờ xác nhận":
        case "chờ thanh toán":
          statusClass = "status-pending"
          break
        case "đã thanh toán":
          statusClass = "status-paid"
          break
        case "đã hủy":
          statusClass = "status-cancelled"
          break
        case "hoàn thành":
          statusClass = "status-completed"
          break
        default:
          statusClass = "status-pending"
      }

      // Format ngày
      const bookingDate = new Date(booking.ngay_dat)
      const formattedDate = bookingDate.toLocaleDateString("vi-VN")

      // Format tiền
      const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(booking.tong_tien)

      html += `
        <tr>
          <td>#${booking.id}</td>
          <td>${booking.ten_tour}</td>
          <td>${formattedDate}</td>
          <td>${booking.so_nguoi_lon + (booking.so_tre_em || 0)} người</td>
          <td>${formattedPrice}</td>
          <td><span class="status ${statusClass}">${booking.trang_thai}</span></td>
          <td>
            <a href="/booking-detail/${booking.id}" class="btn btn-primary btn-sm">Chi tiết</a>
          </td>
        </tr>
      `
    })

    html += `
        </tbody>
      </table>
    `

    bookingHistoryContainer.innerHTML = html
  }
}

/**
 * Hiển thị danh sách tour yêu thích
 */
function displayFavoriteTours(tours) {
  const favoriteToursContainer = document.getElementById("favorite-tours")

  if (favoriteToursContainer) {
    let html = ""

    tours.forEach((tour) => {
      // Format tiền
      const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(tour.gia_nguoi_lon)

      // Tạo HTML cho rating
      let starsHtml = ""
      const rating = tour.diem_danh_gia_trung_binh || 0
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          starsHtml += '<i class="fas fa-star"></i>'
        } else if (i - 0.5 <= rating) {
          starsHtml += '<i class="fas fa-star-half-alt"></i>'
        } else {
          starsHtml += '<i class="far fa-star"></i>'
        }
      }

      html += `
        <div class="tour-card" onclick="window.location.href='/tour/${tour.id}'">
          <div class="tour-card-image">
            <img src="${tour.hinh_anh_chinh || "/static/images/tour-placeholder.jpg"}" alt="${tour.ten_tour}">
            <div class="tour-card-category">${tour.ten_danh_muc}</div>
            <button class="remove-favorite-btn" data-tour-id="${tour.id}" onclick="removeFavorite(event, ${tour.id})">
              <i class="fas fa-heart-broken"></i>
            </button>
          </div>
          <div class="tour-card-content">
            <h3 class="tour-card-title">${tour.ten_tour}</h3>
            <div class="tour-card-info">
              <div class="tour-card-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${tour.dia_diem_den}</span>
              </div>
              <div class="tour-card-duration">
                <i class="fas fa-clock"></i>
                <span>${tour.thoi_gian_tour}</span>
              </div>
            </div>
            <div class="tour-card-rating">
              <div class="stars">
                ${starsHtml}
              </div>
              <span>(${tour.so_luong_danh_gia || 0} đánh giá)</span>
            </div>
            <div class="tour-card-price">
              <div>
                <span class="price">${formattedPrice}</span>
                <span class="per-person">/ người</span>
              </div>
              <a href="/tour/${tour.id}" class="btn btn-primary btn-sm">Chi tiết</a>
            </div>
          </div>
        </div>
      `
    })

    favoriteToursContainer.innerHTML = html
  }
}

/**
 * Thiết lập dropdown menu
 */
function setupUserDropdown() {
  // Logic để thiết lập dropdown menu
}
