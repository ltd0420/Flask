/**
 * register-new.js - Xử lý chức năng đăng ký tài khoản cho giao diện mới
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Đang khởi tạo trang đăng ký mới...")

  // Lấy form đăng ký
  const registerForm = document.getElementById("register-form")

  if (registerForm) {
    // Thêm phần tử hiển thị lỗi và thành công nếu chưa có
    if (!document.getElementById("register-error")) {
      const errorDiv = document.createElement("div")
      errorDiv.id = "register-error"
      errorDiv.className = "alert alert-danger"
      errorDiv.style.display = "none"
      errorDiv.style.color = "#ef4444"
      errorDiv.style.backgroundColor = "rgba(239, 68, 68, 0.1)"
      errorDiv.style.padding = "0.75rem 1rem"
      errorDiv.style.borderRadius = "0.25rem"
      errorDiv.style.marginBottom = "1rem"
      errorDiv.style.borderLeft = "3px solid #ef4444"
      registerForm.prepend(errorDiv)
    }

    if (!document.getElementById("register-success")) {
      const successDiv = document.createElement("div")
      successDiv.id = "register-success"
      successDiv.className = "alert alert-success"
      successDiv.style.display = "none"
      successDiv.style.color = "#10b981"
      successDiv.style.backgroundColor = "rgba(16, 185, 129, 0.1)"
      successDiv.style.padding = "0.75rem 1rem"
      successDiv.style.borderRadius = "0.25rem"
      successDiv.style.marginBottom = "1rem"
      successDiv.style.borderLeft = "3px solid #10b981"
      registerForm.prepend(successDiv)
    }

    // Xử lý sự kiện submit form
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      console.log("Form đăng ký được submit")

      // Lấy dữ liệu từ form
      let fullName, email, phone, password, confirmPassword

      // Kiểm tra các trường theo ID có thể khác nhau
      if (document.getElementById("first-name") && document.getElementById("last-name")) {
        const firstName = document.getElementById("first-name").value
        const lastName = document.getElementById("last-name").value
        fullName = `${firstName} ${lastName}`
      } else if (document.getElementById("full-name")) {
        fullName = document.getElementById("full-name").value
      } else if (document.getElementById("ho_ten")) {
        fullName = document.getElementById("ho_ten").value
      }

      email = document.getElementById("email").value

      if (document.getElementById("phone")) {
        phone = document.getElementById("phone").value
      } else if (document.getElementById("so_dien_thoai")) {
        phone = document.getElementById("so_dien_thoai").value
      }

      if (document.getElementById("password")) {
        password = document.getElementById("password").value
      } else if (document.getElementById("mat_khau")) {
        password = document.getElementById("mat_khau").value
      }

      if (document.getElementById("confirm-password")) {
        confirmPassword = document.getElementById("confirm-password").value
      } else if (document.getElementById("xac_nhan_mat_khau")) {
        confirmPassword = document.getElementById("xac_nhan_mat_khau").value
      }

      // Kiểm tra điều khoản nếu có
      let agreeTerms = true
      if (document.getElementById("terms")) {
        agreeTerms = document.getElementById("terms").checked
      } else if (document.getElementById("agree-terms")) {
        agreeTerms = document.getElementById("agree-terms").checked
      }

      // Kiểm tra dữ liệu
      if (!fullName || !email || !password || !confirmPassword) {
        showError("Vui lòng điền đầy đủ thông tin bắt buộc")
        return
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showError("Email không hợp lệ")
        return
      }

      // Kiểm tra mật khẩu khớp nhau
      if (password !== confirmPassword) {
        showError("Mật khẩu và xác nhận mật khẩu không khớp")
        return
      }

      // Kiểm tra độ dài mật khẩu
      if (password.length < 6) {
        showError("Mật khẩu phải có ít nhất 6 ký tự")
        return
      }

      // Kiểm tra đồng ý điều khoản nếu có
      if (!agreeTerms) {
        showError("Bạn cần đồng ý với điều khoản và điều kiện")
        return
      }

      // Hiển thị trạng thái đang xử lý
      const submitButton = registerForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent || submitButton.innerText
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'

      // Xóa thông báo lỗi cũ
      clearError()

      try {
        console.log("Bắt đầu gửi yêu cầu đăng ký với email:", email)

        // Gửi dữ liệu đăng ký
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ho_ten: fullName,
            email: email,
            mat_khau: password,
            so_dien_thoai: phone,
          }),
        })

        const data = await response.json()
        console.log("Kết quả đăng ký:", data)

        if (data.error) {
          // Hiển thị thông báo lỗi
          showError(data.error)
        } else {
          // Hiển thị thông báo thành công
          showSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...")

          // Chuyển hướng đến trang đăng nhập sau 2 giây
          setTimeout(() => {
            window.location.href = "/login?registered=true"
          }, 10000)
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error)
        showError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.")
      } finally {
        // Khôi phục nút submit
        submitButton.disabled = false
        submitButton.innerHTML = originalButtonText
      }
    })

    // Xử lý kiểm tra độ mạnh của mật khẩu
    const passwordInput = document.getElementById("password") || document.getElementById("mat_khau")

    if (passwordInput) {
      // Tạo phần tử hiển thị độ mạnh mật khẩu nếu chưa có
      let passwordStrengthContainer = document.querySelector(".password-strength")
      let passwordStrength

      if (!passwordStrengthContainer) {
        passwordStrengthContainer = document.createElement("div")
        passwordStrengthContainer.className = "password-strength"
        passwordStrengthContainer.style.height = "5px"
        passwordStrengthContainer.style.backgroundColor = "#e5e7eb"
        passwordStrengthContainer.style.borderRadius = "5px"
        passwordStrengthContainer.style.marginTop = "0.5rem"
        passwordStrengthContainer.style.overflow = "hidden"

        passwordStrength = document.createElement("div")
        passwordStrength.id = "password-strength"
        passwordStrength.className = "password-strength-bar"
        passwordStrength.style.height = "100%"
        passwordStrength.style.width = "0"
        passwordStrength.style.transition = "width 0.3s ease"

        passwordStrengthContainer.appendChild(passwordStrength)
        passwordInput.parentNode.appendChild(passwordStrengthContainer)
      } else {
        passwordStrength = document.getElementById("password-strength")
        if (!passwordStrength) {
          passwordStrength = document.createElement("div")
          passwordStrength.id = "password-strength"
          passwordStrength.className = "password-strength-bar"
          passwordStrength.style.height = "100%"
          passwordStrength.style.width = "0"
          passwordStrength.style.transition = "width 0.3s ease"

          passwordStrengthContainer.appendChild(passwordStrength)
        }
      }

      passwordInput.addEventListener("input", () => {
        const password = passwordInput.value
        const strength = calculatePasswordStrength(password)

        // Cập nhật thanh độ mạnh
        passwordStrength.style.width = `${strength}%`

        // Cập nhật màu sắc dựa trên độ mạnh
        if (strength < 30) {
          passwordStrength.style.backgroundColor = "#ef4444"
          passwordStrength.className = "password-strength-bar weak"
        } else if (strength < 70) {
          passwordStrength.style.backgroundColor = "#f59e0b"
          passwordStrength.className = "password-strength-bar medium"
        } else {
          passwordStrength.style.backgroundColor = "#10b981"
          passwordStrength.className = "password-strength-bar strong"
        }
      })
    }

    // Xử lý kiểm tra mật khẩu khớp nhau
    const confirmPasswordInput =
      document.getElementById("confirm-password") || document.getElementById("xac_nhan_mat_khau")
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

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      errorElement.style.display = "none"
    }, 5000)
  } else {
    // Fallback nếu không tìm thấy phần tử hiển thị lỗi
    alert(message)
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
 * Hiển thị thông báo thành công
 * @param {string} message - Nội dung thông báo
 */
function showSuccess(message) {
  const successElement = document.getElementById("register-success")
  if (successElement) {
    successElement.textContent = message
    successElement.style.display = "block"
  } else {
    // Fallback nếu không tìm thấy phần tử hiển thị thành công
    alert(message)
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
  notification.style.position = "fixed"
  notification.style.top = "20px"
  notification.style.right = "20px"
  notification.style.padding = "1rem 1.5rem"
  notification.style.borderRadius = "0.25rem"
  notification.style.backgroundColor = "white"
  notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
  notification.style.zIndex = "1000"
  notification.style.transform = "translateY(-100px)"
  notification.style.opacity = "0"
  notification.style.transition = "transform 0.3s ease, opacity 0.3s ease"

  if (type === "success") {
    notification.style.borderLeft = "4px solid #10b981"
  } else if (type === "error") {
    notification.style.borderLeft = "4px solid #ef4444"
  } else if (type === "warning") {
    notification.style.borderLeft = "4px solid #f59e0b"
  } else {
    notification.style.borderLeft = "4px solid #3b82f6"
  }

  // Thêm vào body
  document.body.appendChild(notification)

  // Hiển thị thông báo
  setTimeout(() => {
    notification.style.transform = "translateY(0)"
    notification.style.opacity = "1"
  }, 10)

  // Ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.style.transform = "translateY(-100px)"
    notification.style.opacity = "0"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
}
/**
 * register-new.js - Xử lý chức năng đăng ký tài khoản cho giao diện mới
 */

// Import password toggle functionality
if (typeof togglePassword === "undefined") {
  const script = document.createElement("script")
  script.src = "/static/js/password-toggle.js"
  document.head.appendChild(script)
}

document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo password toggle cho các input mật khẩu
  setTimeout(() => {
    if (typeof initPasswordToggles === "function") {
      initPasswordToggles(["password", "confirm-password"])
    }
  }, 100)
})
