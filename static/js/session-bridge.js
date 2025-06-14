/**
 * session-bridge.js - Kết nối giữa hệ thống xác thực localStorage và session Flask
 */

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra trạng thái đăng nhập từ server
  checkServerAuthStatus()

  // Xử lý dropdown menu
  setupDropdownMenu()

  // Thiết lập sự kiện cho tất cả các nút đăng xuất
  setupAllLogoutButtons()
})

/**
 * Kiểm tra trạng thái đăng nhập từ server
 */
function checkServerAuthStatus() {
  fetch("/api/check-auth")
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        // Người dùng đã đăng nhập
        updateUIForLoggedInUser(data.user)

        // Cập nhật thông tin người dùng trong localStorage nếu đang sử dụng Auth
        if (window.Auth) {
          window.Auth.updateUserData(data.user)
        }
      } else {
        // Người dùng chưa đăng nhập
        updateUIForLoggedOutUser()

        // Xóa thông tin người dùng trong localStorage nếu đang sử dụng Auth
        if (window.Auth) {
          window.Auth.clearUserSession()
        }

        // Kiểm tra xem trang hiện tại có cần xác thực không
        checkProtectedPage()
      }
    })
    .catch((error) => {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error)
      updateUIForLoggedOutUser()
    })
}

/**
 * Cập nhật giao diện khi đã đăng nhập
 * @param {Object} user - Thông tin người dùng
 */
function updateUIForLoggedInUser(user) {
  const authButtonsContainer = document.querySelector(".auth-buttons")
  const userMenuContainer = document.querySelector(".user-menu")

  if (authButtonsContainer) {
    authButtonsContainer.style.display = "none"
  }

  if (userMenuContainer) {
    userMenuContainer.style.display = "block"

    // Cập nhật tên người dùng
    const userNameElement = document.getElementById("user-name")
    if (userNameElement) {
      userNameElement.textContent = user.name || user.ho_ten || "Tài khoản"
    }
  }
}

/**
 * Cập nhật giao diện khi chưa đăng nhập
 */
function updateUIForLoggedOutUser() {
  const authButtonsContainer = document.querySelector(".auth-buttons")
  const userMenuContainer = document.querySelector(".user-menu")

  if (authButtonsContainer) {
    authButtonsContainer.style.display = "flex"
  }

  if (userMenuContainer) {
    userMenuContainer.style.display = "none"
  }
}

/**
 * Thiết lập dropdown menu
 */
function setupDropdownMenu() {
  const userDropdown = document.getElementById("user-dropdown")
  const userDropdownMenu = document.getElementById("user-dropdown-menu")

  if (userDropdown && userDropdownMenu) {
    // Xử lý sự kiện click cho dropdown
    userDropdown.addEventListener("click", (e) => {
      e.preventDefault()
      userDropdownMenu.classList.toggle("show")
    })

    // Đóng dropdown khi click ra ngoài
    document.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target) && !userDropdownMenu.contains(e.target)) {
        userDropdownMenu.classList.remove("show")
      }
    })
  }

  // Thiết lập sự kiện cho tất cả các nút đăng xuất
  setupAllLogoutButtons()
}

/**
 * Đăng xuất người dùng
 */
function logout() {
  fetch("/api/logout")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Xóa thông tin người dùng trong localStorage nếu đang sử dụng Auth
        if (window.Auth) {
          window.Auth.clearUserSession()
        }

        // Chuyển hướng về trang chủ
        window.location.href = "/"
      }
    })
    .catch((error) => {
      console.error("Lỗi khi đăng xuất:", error)
      // Vẫn chuyển hướng về trang chủ ngay cả khi có lỗi
      window.location.href = "/"
    })
}

/**
 * Kiểm tra xem trang hiện tại có cần xác thực không
 */
function checkProtectedPage() {
  // Danh sách các trang cần xác thực
  const protectedPages = ["/profile", "/bookings", "/wishlist", "/profile.html", "/bookings.html", "/wishlist.html"]

  // Lấy đường dẫn hiện tại
  const currentPath = window.location.pathname

  // Kiểm tra xem trang hiện tại có cần xác thực không
  const needsAuth = protectedPages.some((page) => currentPath.includes(page))

  // Nếu trang cần xác thực và người dùng chưa đăng nhập
  if (needsAuth) {
    // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
    const returnUrl = encodeURIComponent(window.location.href)
    // Chuyển hướng đến trang đăng nhập
    window.location.href = `/login?redirect=${returnUrl}`
  }
}

// Thêm hàm để thiết lập sự kiện cho tất cả các nút đăng xuất
function setupAllLogoutButtons() {
  // Lấy tất cả các nút đăng xuất trên trang
  const logoutButtons = document.querySelectorAll("#logout-btn, .logout-btn, [data-action='logout']")

  // Thêm sự kiện click cho từng nút
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Đăng xuất được nhấp")
      logout()
    })
  })

  // Kiểm tra nút đăng xuất trong sidebar
  const sidebarLogoutBtn = document.querySelector(
    ".sidebar-menu a[href='#']:last-child, .sidebar-menu a:contains('Đăng xuất')",
  )
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Nút đăng xuất sidebar được nhấp")
      logout()
    })
  }
}
