/**
 * direct-logout.js - Xử lý chức năng đăng xuất trực tiếp
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Đang thiết lập chức năng đăng xuất trực tiếp...")

  // Tìm tất cả các nút đăng xuất
  const logoutButtons = document.querySelectorAll("#logout-btn, #sidebar-logout-btn, .logout-btn")

  // Thêm sự kiện click cho từng nút
  logoutButtons.forEach((button) => {
    console.log("Đã tìm thấy nút đăng xuất:", button)

    button.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Nút đăng xuất được nhấp")

      // Tạo form ẩn để gửi POST request
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "/logout"
      document.body.appendChild(form)

      // Gửi form
      form.submit()
    })
  })
})
