// Profile page functionality

// Hiển thị thông báo
function showAlert(message, type = "success") {
  const alertContainer = document.getElementById("alert-container")
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-triangle"}"></i>
        ${message}
    `

  alertContainer.innerHTML = ""
  alertContainer.appendChild(alert)

  // Scroll to top để hiển thị thông báo
  window.scrollTo({ top: 0, behavior: "smooth" })

  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    alert.remove()
  }, 5000)
}

// Xử lý tabs
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      document.getElementById(`${targetTab}-tab`).classList.add("active")
    })
  })
}

// Cập nhật thông tin người dùng trong sidebar
function updateSidebarInfo(user) {
  const sidebarName = document.getElementById("sidebar-user-name")
  const sidebarEmail = document.getElementById("sidebar-user-email")

  if (sidebarName) {
    sidebarName.textContent = user.ho_ten || "Người dùng"
  }

  if (sidebarEmail) {
    sidebarEmail.textContent = user.email || ""
  }
}

// Xử lý form cập nhật thông tin
async function handleProfileUpdate(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const profileData = {
    ho_ten: formData.get("ho_ten"),
    so_dien_thoai: formData.get("so_dien_thoai"),
    dia_chi: formData.get("dia_chi"),
    ngay_sinh: formData.get("ngay_sinh"),
    gioi_tinh: formData.get("gioi_tinh"),
  }

  // Disable form during submission
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang cập nhật...'

  try {
    const result = await window.updateProfile(profileData) // Declare updateProfile

    if (result.success) {
      showAlert(result.message, "success")

      // Cập nhật thông tin hiển thị
      updateSidebarInfo(profileData)

      // Cập nhật tên trong header
      const userNameElement = document.getElementById("user-name")
      if (userNameElement) {
        userNameElement.textContent = profileData.ho_ten
      }
    } else {
      showAlert(result.error, "error")
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error)
    showAlert("Có lỗi xảy ra khi cập nhật thông tin", "error")
  } finally {
    // Re-enable form
    submitBtn.disabled = false
    submitBtn.innerHTML = originalText
  }
}

// Xử lý form đổi mật khẩu
async function handlePasswordChange(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const passwordData = {
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm_password: formData.get("confirm_password"),
  }

  // Kiểm tra mật khẩu mới và xác nhận
  if (passwordData.new_password !== passwordData.confirm_password) {
    showAlert("Mật khẩu mới và xác nhận mật khẩu không khớp", "error")
    return
  }

  // Disable form during submission
  const submitBtn = e.target.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đổi mật khẩu...'

  try {
    const result = await window.changePassword(passwordData) // Declare changePassword

    if (result.success) {
      showAlert(result.message, "success")
      e.target.reset() // Clear form
    } else {
      showAlert(result.error, "error")
    }
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error)
    showAlert("Có lỗi xảy ra khi đổi mật khẩu", "error")
  } finally {
    // Re-enable form
    submitBtn.disabled = false
    submitBtn.innerHTML = originalText
  }
}

// Khởi tạo trang profile
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo tabs
  initTabs()

  // Xử lý form cập nhật thông tin
  const profileForm = document.getElementById("profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileUpdate)
  }

  // Xử lý form đổi mật khẩu
  const passwordForm = document.getElementById("password-form")
  if (passwordForm) {
    passwordForm.addEventListener("submit", handlePasswordChange)
  }

  // Xử lý đăng xuất từ sidebar
  const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn")
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        window.logout() // Declare logout
      }
    })
  }

  // Load thông tin người dùng từ localStorage nếu có
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.ho_ten) {
      updateSidebarInfo(user)
    }
  } catch (error) {
    console.error("Lỗi khi load thông tin người dùng:", error)
  }
})
