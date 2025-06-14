/**
 * login.js - Xử lý form đăng nhập
 */

document.addEventListener("DOMContentLoaded", () => {
  // Xử lý form đăng nhập
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Hiển thị loading
      const submitButton = loginForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.disabled = true
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...'

      // Gửi yêu cầu đăng nhập
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          if (data.error) {
            // Hiển thị thông báo lỗi
            showLoginError(data.error)
          } else {
            // Đăng nhập thành công
            console.log("Đăng nhập thành công:", data)

            // Chuyển hướng về trang chủ hoặc trang trước đó
            const urlParams = new URLSearchParams(window.location.search)
            const redirectUrl = urlParams.get("redirect") || "/"
            window.location.href = redirectUrl
          }
        })
        .catch((error) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          console.error("Lỗi khi đăng nhập:", error)
          showLoginError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.")
        })
    })
  }
})

/**
 * Hiển thị thông báo lỗi đăng nhập
 */
function showLoginError(message) {
  // Tìm phần tử hiển thị lỗi
  let errorElement = document.getElementById("login-error")

  // Nếu không tìm thấy, tạo mới
  if (!errorElement) {
    const loginForm = document.getElementById("login-form")
    if (loginForm) {
      errorElement = document.createElement("div")
      errorElement.id = "login-error"
      errorElement.className = "alert alert-danger"
      loginForm.prepend(errorElement)
    }
  }

  // Hiển thị thông báo lỗi
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  } else {
    // Fallback nếu không tìm thấy phần tử
    alert(message)
  }
}
