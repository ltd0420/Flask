// Thay đổi các API endpoint để phù hợp với server Flask
const API_BASE_URL = "/api"

// Thay đổi hàm loginUser để sử dụng API của Flask
async function loginUser(credentials) {
  try {
    console.log("Đang gửi yêu cầu đăng nhập:", { email: credentials.email, password: "***" })

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        remember_me: credentials.remember_me,
      }),
    })

    console.log("Nhận phản hồi từ server:", response.status, response.statusText)

    const data = await response.json()
    console.log("Dữ liệu phản hồi:", { ...data, user: data.user ? "***" : null })

    if (data.user) {
      // Lưu thông tin người dùng với key "user" để đồng nhất
      localStorage.setItem("user", JSON.stringify(data.user))
      return { success: true, user: data.user }
    } else {
      throw new Error(data.error || "Dữ liệu đăng nhập không hợp lệ")
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error)
    return {
      success: false,
      error: error.message || "Đăng nhập thất bại. Vui lòng thử lại.",
    }
  }
}

// Thay đổi hàm logout để sử dụng API của Flask
async function logout() {
  try {
    // Gọi API đăng xuất của Flask
    await fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error)
  }

  // Xóa dữ liệu phiên đăng nhập
  localStorage.removeItem("user")
  localStorage.removeItem("session_auth")

  // Chuyển hướng về trang chủ
  window.location.href = "/"
}

// Thêm hàm kiểm tra trạng thái đăng nhập từ server
async function checkServerAuthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/check-auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (data.authenticated && data.user) {
      // Cập nhật thông tin người dùng trong localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      return true
    } else {
      // Xóa thông tin người dùng nếu server báo chưa đăng nhập
      localStorage.removeItem("user")
      localStorage.removeItem("session_auth")
      return false
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error)
    return false
  }
}

// Hàm kiểm tra trạng thái đăng nhập
function checkAuthStatus() {
  fetch("/api/check-auth")
    .then((response) => response.json())
    .then((data) => {
      if (data.authenticated) {
        // Lưu thông tin user với key "user"
        localStorage.setItem("user", JSON.stringify(data.user))
        updateUIForLoggedInUser(data.user)
      } else {
        localStorage.removeItem("user")
        updateUIForLoggedOutUser()
      }
    })
    .catch((error) => {
      console.error("Error checking auth status:", error)
    })
}

// Cập nhật giao diện khi đã đăng nhập
function updateUIForLoggedInUser(user) {
  const authContainer = document.querySelector(".auth-buttons")
  const userMenu = document.querySelector(".user-menu")

  if (authContainer) {
    authContainer.style.display = "none"
  }

  if (userMenu) {
    userMenu.style.display = "block"

    // Cập nhật tên người dùng
    const userNameElement = document.getElementById("user-name")
    if (userNameElement) {
      userNameElement.textContent = user.ho_ten || user.name || "Tài khoản"
    }

    // Cập nhật các phần tử khác hiển thị tên người dùng
    const userNameElements = document.querySelectorAll(".user-name")
    userNameElements.forEach((element) => {
      if (element.id !== "user-name") {
        element.textContent = user.ho_ten || user.name || "Tài khoản"
      }
    })

    // Cập nhật email người dùng nếu có
    const userEmailElements = document.querySelectorAll(".user-email")
    userEmailElements.forEach((element) => {
      element.textContent = user.email || ""
    })
  }
}

// Cập nhật giao diện khi chưa đăng nhập
function updateUIForLoggedOutUser() {
  const authContainer = document.querySelector(".auth-buttons")
  const userMenu = document.querySelector(".user-menu")

  if (authContainer) {
    authContainer.style.display = "flex"
  }

  if (userMenu) {
    userMenu.style.display = "none"
  }
}

// Thiết lập dropdown menu
function setupUserDropdown() {
  const userDropdown = document.getElementById("user-dropdown")
  const dropdownMenu = document.getElementById("user-dropdown-menu")

  if (userDropdown && dropdownMenu) {
    userDropdown.addEventListener("click", (e) => {
      e.preventDefault()
      dropdownMenu.classList.toggle("show")
    })

    // Đóng dropdown khi click ra ngoài
    document.addEventListener("click", (e) => {
      if (!userDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("show")
      }
    })
  }

  // Xử lý sự kiện đăng xuất từ sidebar
  const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn")
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }
}

// Hàm cập nhật thông tin profile
async function updateProfile(profileData) {
  try {
    console.log("Đang cập nhật profile:", profileData)

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    const result = await response.json()
    console.log("Kết quả cập nhật:", result)

    if (response.ok && result.success) {
      // Cập nhật thông tin user trong localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      const updatedUser = { ...currentUser, ...result.user }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Cập nhật UI
      updateUIForLoggedInUser(updatedUser)

      return { success: true, message: result.message }
    } else {
      return { success: false, error: result.error || "Có lỗi xảy ra" }
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error)
    return { success: false, error: "Lỗi kết nối server" }
  }
}

// Hàm đổi mật khẩu
async function changePassword(passwordData) {
  try {
    console.log("Đang đổi mật khẩu...")

    const response = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    })

    const result = await response.json()
    console.log("Kết quả đổi mật khẩu:", result)

    if (response.ok && result.success) {
      return { success: true, message: result.message }
    } else {
      return { success: false, error: result.error || "Có lỗi xảy ra" }
    }
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error)
    return { success: false, error: "Lỗi kết nối server" }
  }
}

// Cập nhật hàm initAuth để kiểm tra trạng thái đăng nhập từ server
function initAuth() {
  // Kiểm tra trạng thái đăng nhập từ server
  checkServerAuthStatus().then((isAuthenticated) => {
    // Cập nhật UI dựa trên trạng thái đăng nhập
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user && user.id) {
      updateUIForLoggedInUser(user)
    } else {
      updateUIForLoggedOutUser()
    }
  })

  // Xử lý sự kiện đăng xuất
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  // Xử lý dropdown menu người dùng
  setupUserDropdown()
}

// Kiểm tra trạng thái đăng nhập khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus()

  // Xử lý sự kiện đăng xuất
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logout-btn") {
      e.preventDefault()
      logout()
    }
  })

  // Xử lý sự kiện dropdown menu
  setupUserDropdown()
})
