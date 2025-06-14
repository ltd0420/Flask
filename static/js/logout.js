/**
 * logout.js - Xử lý chức năng đăng xuất
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Đang thiết lập chức năng đăng xuất...")

  // Tìm tất cả các nút đăng xuất
  const logoutButtons = document.querySelectorAll("#logout-btn, #sidebar-logout-btn")

  // Thêm sự kiện click cho từng nút
  logoutButtons.forEach((button) => {
    console.log("Đã tìm thấy nút đăng xuất:", button.id)

    button.addEventListener("click", function (e) {
      e.preventDefault()
      console.log("Nút đăng xuất được nhấp:", this.id)

      // Chuyển hướng trực tiếp đến trang đăng xuất
      window.location.href = "/logout"
    })
  })
})
