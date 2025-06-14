/**
 * password-toggle.js - Chức năng hiển thị/ẩn mật khẩu
 */

/**
 * Toggle hiển thị/ẩn mật khẩu
 * @param {string} inputId - ID của input mật khẩu
 */
function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId)
  const toggleButton = passwordInput.parentNode.querySelector(".password-toggle")
  const icon = toggleButton.querySelector("i")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
    toggleButton.setAttribute("aria-label", "Ẩn mật khẩu")
  } else {
    passwordInput.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
    toggleButton.setAttribute("aria-label", "Hiển thị mật khẩu")
  }
}

/**
 * Khởi tạo tất cả password toggle buttons
 */
document.addEventListener("DOMContentLoaded", () => {
  // Thêm event listener cho tất cả password toggle buttons
  const toggleButtons = document.querySelectorAll(".password-toggle")

  toggleButtons.forEach((button) => {
    // Thêm aria-label cho accessibility
    button.setAttribute("aria-label", "Hiển thị mật khẩu")
    button.setAttribute("tabindex", "0")

    // Thêm keyboard support
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        button.click()
      }
    })

    // Thêm hover effect
    button.addEventListener("mouseenter", () => {
      button.style.color = "#333"
    })

    button.addEventListener("mouseleave", () => {
      button.style.color = "#666"
    })
  })
})

/**
 * Tự động khởi tạo password toggle cho các input được thêm động
 */
function initPasswordToggle(inputId) {
  const passwordInput = document.getElementById(inputId)
  if (!passwordInput) return

  // Kiểm tra xem đã có toggle button chưa
  const existingToggle = passwordInput.parentNode.querySelector(".password-toggle")
  if (existingToggle) return

  // Tạo wrapper nếu chưa có
  if (passwordInput.parentNode.style.position !== "relative") {
    const wrapper = document.createElement("div")
    wrapper.style.position = "relative"
    passwordInput.parentNode.insertBefore(wrapper, passwordInput)
    wrapper.appendChild(passwordInput)
  }

  // Thêm padding-right cho input
  passwordInput.style.paddingRight = "45px"

  // Tạo toggle button
  const toggleButton = document.createElement("button")
  toggleButton.type = "button"
  toggleButton.className = "password-toggle"
  toggleButton.onclick = () => togglePassword(inputId)
  toggleButton.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        font-size: 16px;
        padding: 5px;
        border-radius: 3px;
        transition: color 0.2s ease;
    `

  // Tạo icon
  const icon = document.createElement("i")
  icon.className = "fas fa-eye"
  toggleButton.appendChild(icon)

  // Thêm vào wrapper
  passwordInput.parentNode.appendChild(toggleButton)

  // Thêm accessibility attributes
  toggleButton.setAttribute("aria-label", "Hiển thị mật khẩu")
  toggleButton.setAttribute("tabindex", "0")

  // Thêm keyboard support
  toggleButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleButton.click()
    }
  })
}

/**
 * Batch initialize password toggles
 * @param {string[]} inputIds - Array of input IDs
 */
function initPasswordToggles(inputIds) {
  inputIds.forEach((inputId) => {
    initPasswordToggle(inputId)
  })
}

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    togglePassword,
    initPasswordToggle,
    initPasswordToggles,
  }
}
