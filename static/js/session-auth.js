/**
 * session-auth.js - Xử lý xác thực người dùng với Flask session
 */

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra trạng thái đăng nhập khi trang được tải
  checkAuthStatus()

  // Xử lý form đăng nhập nếu có trên trang
  setupLoginForm()

  // Xử lý form đăng ký nếu có trên trang
  setupRegisterForm()

  // Xử lý nút đăng xuất
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }
})

/**
 * Kiểm tra trạng thái đăng nhập từ server
 */
function checkAuthStatus() {
  fetch("/api/check-auth")
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        updateUIForLoggedInUser(data.user)
      } else {
        updateUIForLoggedOutUser()
      }
    })
    .catch((error) => {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error)
    })
}

/**
 * Cập nhật giao diện khi đã đăng nhập
 */
function updateUIForLoggedInUser(user) {
  // Tìm các phần tử cần cập nhật
  const authButtonsContainer = document.querySelector(".auth-buttons")
  let userMenuContainer = document.querySelector(".user-menu")

  // Nếu không tìm thấy container, tạo mới
  if (!authButtonsContainer && !userMenuContainer) {
    const headerRight =
      document.querySelector("header .header-right") ||
      document.querySelector("header .navbar-nav") ||
      document.querySelector("header .navbar-right") ||
      document.querySelector("header .ml-auto")

    if (headerRight) {
      // Tạo container cho user menu
      const container = document.createElement("div")
      container.className = "user-menu"
      headerRight.appendChild(container)

      // Cập nhật reference
      userMenuContainer = container
    }
  }

  // Cập nhật UI nếu tìm thấy container
  if (authButtonsContainer) {
    // Ẩn nút đăng nhập/đăng ký
    authButtonsContainer.style.display = "none"
  }

  if (userMenuContainer) {
    // Hiển thị menu người dùng
    userMenuContainer.style.display = "block"
    userMenuContainer.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-user-circle"></i> ${user.name || user.ho_ten || "Tài khoản"}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="/profile"><i class="fas fa-user"></i> Tài khoản</a></li>
          <li><a class="dropdown-item" href="/bookings"><i class="fas fa-list"></i> Đơn đặt tour</a></li>
          <li><a class="dropdown-item" href="/wishlist"><i class="fas fa-heart"></i> Yêu thích</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
        </ul>
      </div>
    `
  }

  // Cập nhật các phần tử khác nếu cần
  const userNameElements = document.querySelectorAll(".user-name")
  userNameElements.forEach((element) => {
    element.textContent = user.name || user.ho_ten || "Tài khoản"
  })

  console.log("Đã đăng nhập:", user)
}

/**
 * Cập nhật giao diện khi chưa đăng nhập
 */
function updateUIForLoggedOutUser() {
  // Tìm các phần tử cần cập nhật
  let authButtonsContainer = document.querySelector(".auth-buttons")
  const userMenuContainer = document.querySelector(".user-menu")

  // Nếu không tìm thấy container, tạo mới
  if (!authButtonsContainer && !userMenuContainer) {
    const headerRight =
      document.querySelector("header .header-right") ||
      document.querySelector("header .navbar-nav") ||
      document.querySelector("header .navbar-right") ||
      document.querySelector("header .ml-auto")

    if (headerRight) {
      // Tạo container cho auth buttons
      const container = document.createElement("div")
      container.className = "auth-buttons"
      headerRight.appendChild(container)

      // Cập nhật reference
      authButtonsContainer = container
    }
  }

  // Cập nhật UI nếu tìm thấy container
  if (authButtonsContainer) {
    // Hiển thị nút đăng nhập/đăng ký
    authButtonsContainer.style.display = "flex"
    authButtonsContainer.innerHTML = `
      <a href="/login" class="btn btn-outline-primary">Đăng nhập</a>
      <a href="/register" class="btn btn-primary">Đăng ký</a>
    `
  }

  if (userMenuContainer) {
    // Ẩn menu người dùng
    userMenuContainer.style.display = "none"
  }

  console.log("Chưa đăng nhập")
}

/**
 * Thiết lập form đăng nhập
 */
function setupLoginForm() {
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
            // Chuyển hướng về trang chủ hoặc trang trước đó
            const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/"
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
}

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
      errorElement.className = "alert alert-danger mt-3"
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

/**
 * Thiết lập form đăng ký
 */
function setupRegisterForm() {
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Lấy dữ liệu từ form
      const formData = new FormData(registerForm)
      const userData = {}

      // Chuyển đổi FormData thành object
      for (const [key, value] of formData.entries()) {
        userData[key] = value
      }

      // Hiển thị loading
      const submitButton = registerForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.innerHTML
      submitButton.disabled = true
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...'

      // Gửi yêu cầu đăng ký
      fetch("/api/register", {
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
            showRegisterError(data.error)
          } else {
            // Đăng ký thành công
            // Chuyển hướng đến trang đăng nhập
            window.location.href = "/login?registered=true"
          }
        })
        .catch((error) => {
          // Khôi phục nút submit
          submitButton.disabled = false
          submitButton.innerHTML = originalButtonText

          console.error("Lỗi khi đăng ký:", error)
          showRegisterError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.")
        })
    })
  }
}

/**
 * Hiển thị thông báo lỗi đăng ký
 */
function showRegisterError(message) {
  // Tìm phần tử hiển thị lỗi
  let errorElement = document.getElementById("register-error")

  // Nếu không tìm thấy, tạo mới
  if (!errorElement) {
    const registerForm = document.getElementById("register-form")
    if (registerForm) {
      errorElement = document.createElement("div")
      errorElement.id = "register-error"
      errorElement.className = "alert alert-danger mt-3"
      registerForm.prepend(errorElement)
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

/**
 * Đăng xuất người dùng
 */
function logout() {
  fetch("/api/logout")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Cập nhật UI
        updateUIForLoggedOutUser()
        // Chuyển hướng về trang chủ
        window.location.href = "/"
      }
    })
    .catch((error) => {
      console.error("Lỗi khi đăng xuất:", error)
    })
}
