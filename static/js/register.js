/**
 * register.js - Xử lý chức năng đăng ký tài khoản
 */

document.addEventListener("DOMContentLoaded", () => {
  // Lấy form đăng ký
  const registerForm = document.getElementById("register-form")

  if (registerForm) {
    // Kiểm tra nếu người dùng đã đăng nhập thì chuyển hướng về trang chủ
    if (window.Auth && window.Auth.isLoggedIn()) {
      window.location.href = "/"
      return
    }

    // Xử lý sự kiện submit form
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const fullName = document.getElementById("full-name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const agreeTerms = document.getElementById("agree-terms").checked

      // Kiểm tra mật khẩu khớp nhau
      if (password !== confirmPassword) {
        showError("Mật khẩu và xác nhận mật khẩu không khớp.")
        return
      }

      // Kiểm tra đồng ý điều khoản
      if (!agreeTerms) {
        showError("Bạn cần đồng ý với điều khoản và điều kiện.")
        return
      }

      // Hiển thị trạng thái đang xử lý
      const submitButton = registerForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'

      // Xóa thông báo lỗi cũ
      clearError()

      try {
        console.log("Bắt đầu đăng ký với email:", email)

        // Gọi hàm đăng ký từ auth.js
        const result = await window.Auth.registerUser({
          ho_ten: fullName,
          email,
          password, // Gửi mật khẩu dạng văn bản thuần túy
          so_dien_thoai: phone,
        })

        console.log("Kết quả đăng ký:", result.success ? "Thành công" : "Thất bại")

        if (result.success) {
          // Đăng ký thành công
          showNotification("Đăng ký thành công! Vui lòng đăng nhập.", "success")

          // Chuyển hướng đến trang đăng nhập sau 2 giây
          setTimeout(() => {
            window.location.href = "/dang-nhap"
          }, 2000)
        } else {
          // Đăng ký thất bại
          showError(result.error || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.")

          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.textContent = originalButtonText
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error)

        // Hiển thị thông báo lỗi
        showError("Đã xảy ra lỗi. Vui lòng thử lại sau.")

        // Khôi phục nút submit
        submitButton.disabled = false
        submitButton.textContent = originalButtonText
      }
    })

    // Xử lý kiểm tra độ mạnh của mật khẩu
    const passwordInput = document.getElementById("password")
    const passwordStrength = document.getElementById("password-strength")

    if (passwordInput && passwordStrength) {
      passwordInput.addEventListener("input", () => {
        const password = passwordInput.value
        const strength = calculatePasswordStrength(password)

        // Cập nhật thanh độ mạnh
        passwordStrength.style.width = `${strength}%`

        // Cập nhật màu sắc dựa trên độ mạnh
        if (strength < 30) {
          passwordStrength.className = "password-strength-bar weak"
        } else if (strength < 70) {
          passwordStrength.className = "password-strength-bar medium"
        } else {
          passwordStrength.className = "password-strength-bar strong"
        }
      })
    }

    // Xử lý kiểm tra mật khẩu khớp nhau
    const confirmPasswordInput = document.getElementById("confirm-password")
    if (passwordInput && confirmPasswordInput) {
      confirmPasswordInput.addEventListener("input", () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
          confirmPasswordInput.setCustomValidity("Mật khẩu không khớp")
        } else {
          confirmPasswordInput.setCustomValidity("")
        }
      })
    }
  }
})

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung lỗi
 */
function showError(message) {
  const errorElement = document.getElementById("register-error")
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }
}

/**
 * Xóa thông báo lỗi
 */
function clearError() {
  const errorElement = document.getElementById("register-error")
  if (errorElement) {
    errorElement.textContent = ""
    errorElement.style.display = "none"
  }
}

/**
 * Tính toán độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {number} Điểm đánh giá độ mạnh (0-100)
 */
function calculatePasswordStrength(password) {
  let strength = 0

  // Độ dài
  if (password.length > 0) {
    strength += 10

    // Thêm điểm cho độ dài
    strength += Math.min(password.length * 2, 20)

    // Kiểm tra chữ thường
    if (/[a-z]/.test(password)) {
      strength += 10
    }

    // Kiểm tra chữ hoa
    if (/[A-Z]/.test(password)) {
      strength += 10
    }

    // Kiểm tra số
    if (/[0-9]/.test(password)) {
      strength += 10
    }

    // Kiểm tra ký tự đặc biệt
    if (/[^a-zA-Z0-9]/.test(password)) {
      strength += 10
    }

    // Kiểm tra sự kết hợp
    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      strength += 10
    }

    // Kiểm tra sự kết hợp đầy đủ
    if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
      strength += 20
    }
  }

  return Math.min(strength, 100)
}

/**
 * Hiển thị thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error, warning, info)
 */
function showNotification(message, type = "info") {
  // Kiểm tra xem đã có thông báo nào chưa
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

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

  // Ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}
