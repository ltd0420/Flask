/**
 * login-new.js - Xử lý chức năng đăng nhập cho giao diện mới
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Đang khởi tạo trang đăng nhập mới...")

  // Lấy form đăng nhập
  const loginForm = document.getElementById("login-form")

  if (loginForm) {
    // Thêm phần tử hiển thị lỗi và thành công nếu chưa có
    if (!document.getElementById("login-error")) {
      const errorDiv = document.createElement("div")
      errorDiv.id = "login-error"
      errorDiv.className = "alert alert-danger"
      errorDiv.style.display = "none"
      errorDiv.style.color = "#ef4444"
      errorDiv.style.backgroundColor = "rgba(239, 68, 68, 0.1)"
      errorDiv.style.padding = "0.75rem 1rem"
      errorDiv.style.borderRadius = "0.25rem"
      errorDiv.style.marginBottom = "1rem"
      errorDiv.style.borderLeft = "3px solid #ef4444"
      loginForm.prepend(errorDiv)
    }

    if (!document.getElementById("login-success")) {
      const successDiv = document.createElement("div")
      successDiv.id = "login-success"
      successDiv.className = "alert alert-success"
      successDiv.style.display = "none"
      successDiv.style.color = "#10b981"
      successDiv.style.backgroundColor = "rgba(16, 185, 129, 0.1)"
      successDiv.style.padding = "0.75rem 1rem"
      successDiv.style.borderRadius = "0.25rem"
      successDiv.style.marginBottom = "1rem"
      successDiv.style.borderLeft = "3px solid #10b981"
      loginForm.prepend(successDiv)
    }

    // Kiểm tra xem người dùng vừa đăng ký thành công không
    const urlParams = new URLSearchParams(window.location.search)
    const registered = urlParams.get("registered")

    if (registered === "true") {
      const successElement = document.getElementById("login-success")
      if (successElement) {
        successElement.textContent = "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
        successElement.style.display = "block"

        // Tự động ẩn sau 5 giây
        setTimeout(() => {
          successElement.style.display = "none"
        }, 5000)
      }
    }

    // Xử lý sự kiện submit form
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      console.log("Form đăng nhập được submit")

      // Lấy dữ liệu từ form
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const rememberMe = document.getElementById("remember-me")?.checked || false

      // Kiểm tra dữ liệu
      if (!email || !password) {
        showError("Vui lòng nhập email và mật khẩu")
        return
      }

      // Hiển thị trạng thái đang xử lý
      const submitButton = loginForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent || submitButton.innerText
      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...'

      // Xóa thông báo lỗi cũ
      clearError()

      try {
        console.log("Bắt đầu gửi yêu cầu đăng nhập với email:", email)

        // Gửi dữ liệu đăng nhập
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            remember_me: rememberMe,
          }),
        })

        const data = await response.json()
        console.log("Kết quả đăng nhập:", data)

        if (data.error) {
          // Hiển thị thông báo lỗi
          showError(data.error)
        } else {
          // Hiển thị thông báo thành công
          showSuccess("Đăng nhập thành công! Đang chuyển hướng...")

          // Lấy URL chuyển hướng từ query parameter hoặc mặc định là trang chủ
          const redirectUrl = urlParams.get("redirect") || "/"

          // Chuyển hướng đến trang đích
          setTimeout(() => {
            window.location.href = redirectUrl
          }, 1000)
        }
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error)
        showError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.")
      } finally {
        // Khôi phục nút submit
        submitButton.disabled = false
        submitButton.innerHTML = originalButtonText
      }
    })
  }
})

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung lỗi
 */
function showError(message) {
  const errorElement = document.getElementById("login-error")
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
  const errorElement = document.getElementById("login-error")
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
  const successElement = document.getElementById("login-success")
  if (successElement) {
    successElement.textContent = message
    successElement.style.display = "block"
  } else {
    // Fallback nếu không tìm thấy phần tử hiển thị thành công
    alert(message)
  }
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
 * login-new.js - Xử lý chức năng đăng nhập cho giao diện mới
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
    if (typeof initPasswordToggle === "function") {
      initPasswordToggle("password")
    }
  }, 100)
})
