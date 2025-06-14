/**
 * error-handler.js - Xử lý lỗi chung cho toàn bộ ứng dụng
 */

// Xử lý lỗi không bắt được
window.addEventListener("error", (event) => {
  console.error("Lỗi không bắt được:", event.error)
  logError("Uncaught Error", event.error)
})

// Xử lý promise rejection không bắt được
window.addEventListener("unhandledrejection", (event) => {
  console.error("Promise rejection không bắt được:", event.reason)
  logError("Unhandled Promise Rejection", event.reason)
})

// Ghi log lỗi
function logError(type, error) {
  // Trong môi trường thực tế, bạn có thể gửi lỗi đến server để theo dõi
  console.group("Error Details")
  console.error("Type:", type)
  console.error("Message:", error.message || "No message")
  console.error("Stack:", error.stack || "No stack trace")
  console.error("URL:", window.location.href)
  console.error("User Agent:", navigator.userAgent)
  console.error("Time:", new Date().toISOString())
  console.groupEnd()
}

// Xử lý lỗi tải hình ảnh
document.addEventListener("DOMContentLoaded", () => {
  // Xử lý tất cả các hình ảnh trong trang
  document.querySelectorAll("img").forEach((img) => {
    img.onerror = function () {
      // Xác định loại hình ảnh để sử dụng placeholder phù hợp
      if (img.src.includes("/categories/")) {
        this.src = "/static/images/category-placeholder.jpg"
      } else if (img.src.includes("/tours/")) {
        this.src = "/static/images/tour-placeholder.jpg"
      } else if (img.classList.contains("author-avatar") || img.parentElement.classList.contains("author-avatar")) {
        this.src = "/static/images/avatar-placeholder.jpg"
      } else {
        this.src = "/static/images/tour-placeholder.jpg"
      }
      this.onerror = null // Tránh vòng lặp vô hạn nếu placeholder cũng không tồn tại

      console.warn("Đã thay thế hình ảnh lỗi:", img.src)
    }
  })
})

// Hiển thị thông báo lỗi
function showErrorNotification(message, duration = 5000) {
  // Kiểm tra xem đã có thông báo nào chưa
  let notification = document.querySelector(".error-notification")

  if (!notification) {
    // Tạo phần tử thông báo
    notification = document.createElement("div")
    notification.className = "error-notification"
    notification.style.position = "fixed"
    notification.style.top = "20px"
    notification.style.right = "20px"
    notification.style.backgroundColor = "#f44336"
    notification.style.color = "white"
    notification.style.padding = "15px 20px"
    notification.style.borderRadius = "4px"
    notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)"
    notification.style.zIndex = "9999"
    notification.style.maxWidth = "300px"
    notification.style.opacity = "0"
    notification.style.transition = "opacity 0.3s ease"

    // Thêm nút đóng
    const closeButton = document.createElement("span")
    closeButton.innerHTML = "&times;"
    closeButton.style.marginLeft = "10px"
    closeButton.style.float = "right"
    closeButton.style.cursor = "pointer"
    closeButton.style.fontWeight = "bold"
    closeButton.onclick = () => {
      notification.style.opacity = "0"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }

    notification.appendChild(closeButton)
    document.body.appendChild(notification)
  }

  // Cập nhật nội dung thông báo
  notification.innerHTML = message + notification.innerHTML.substring(notification.innerHTML.indexOf("<span"))

  // Hiển thị thông báo
  setTimeout(() => {
    notification.style.opacity = "1"
  }, 10)

  // Tự động ẩn sau thời gian chỉ định
  setTimeout(() => {
    notification.style.opacity = "0"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, duration)
}
