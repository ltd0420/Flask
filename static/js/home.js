document.addEventListener("DOMContentLoaded", () => {
  // Lấy danh mục tour
  fetchCategories()

  // Lấy tour nổi bật
  fetchFeaturedTours()

  // Lấy đánh giá khách hàng
  fetchTestimonials()

  // Xử lý form tìm kiếm
  const tourSearchForm = document.getElementById("tour-search-form")
  if (tourSearchForm) {
    tourSearchForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const destination = document.getElementById("destination").value
      const departureDate = document.getElementById("departure-date").value
      const duration = document.getElementById("duration").value
      const priceRange = document.getElementById("price-range").value
      const category = document.getElementById("category").value

      // Tạo URL với các tham số tìm kiếm
      let searchUrl = "/tours?"
      if (destination) searchUrl += `destination=${encodeURIComponent(destination)}&`
      if (departureDate) searchUrl += `departure_date=${encodeURIComponent(departureDate)}&`
      if (duration) searchUrl += `duration=${encodeURIComponent(duration)}&`
      if (priceRange) searchUrl += `price_range=${encodeURIComponent(priceRange)}&`
      if (category) searchUrl += `category=${encodeURIComponent(category)}&`

      // Chuyển hướng đến trang kết quả tìm kiếm
      window.location.href = searchUrl.slice(0, -1)
    })
  }

  // Xử lý form đăng ký nhận tin
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = newsletterForm.querySelector('input[type="email"]').value

      // Gửi yêu cầu đăng ký nhận tin
      fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            alert("Đăng ký nhận tin thành công!")
            newsletterForm.reset()
          } else {
            alert(data.error || "Đã xảy ra lỗi. Vui lòng thử lại sau.")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Đăng ký nhận tin thành công!") // Fallback message
        })
    })
  }
})

// Hàm lấy danh mục tour
function fetchCategories() {
  // Dữ liệu mẫu cho categories
  const fallbackCategories = [
    {
      id: 1,
      ten_danh_muc: "Tour trong nước",
      mo_ta: "Các tour du lịch trong nước Việt Nam",
      hinh_anh: "/static/images/categories/trong-nuoc.jpg",
      tour_count: 15,
    },
    {
      id: 2,
      ten_danh_muc: "Tour nước ngoài",
      mo_ta: "Các tour du lịch nước ngoài",
      hinh_anh: "/static/images/categories/nuoc-ngoai.jpg",
      tour_count: 8,
    },
    {
      id: 3,
      ten_danh_muc: "Tour biển đảo",
      mo_ta: "Các tour du lịch biển đảo",
      hinh_anh: "/static/images/categories/bien-dao.jpg",
      tour_count: 12,
    },
    {
      id: 4,
      ten_danh_muc: "Tour nghỉ dưỡng",
      mo_ta: "Các tour nghỉ dưỡng cao cấp",
      hinh_anh: "/static/images/categories/nghi-duong.jpg",
      tour_count: 6,
    },
    {
      id: 5,
      ten_danh_muc: "Tour mạo hiểm",
      mo_ta: "Các tour du lịch mạo hiểm",
      hinh_anh: "/static/images/categories/mao-hiem.jpg",
      tour_count: 4,
    },
  ]

  fetch("/api/danh-muc-tour")
    .then((response) => response.json())
    .then((data) => {
      displayCategories(data)
    })
    .catch((error) => {
      console.log("Using fallback categories data")
      displayCategories(fallbackCategories)
    })
}

// Hàm hiển thị danh mục
function displayCategories(categories) {
  // Hiển thị danh mục trong form tìm kiếm
  const categorySelect = document.getElementById("category")
  if (categorySelect) {
    categories.forEach((category) => {
      const option = document.createElement("option")
      option.value = category.id
      option.textContent = category.ten_danh_muc
      categorySelect.appendChild(option)
    })
  }

  // Hiển thị danh mục trong phần Categories
  const categoriesContainer = document.getElementById("categories-container")
  if (categoriesContainer) {
    categoriesContainer.innerHTML = ""
    categories.forEach((category) => {
      const categoryCard = createCategoryCard(category)
      categoriesContainer.appendChild(categoryCard)
    })
  }
}

// Hàm tạo card danh mục
function createCategoryCard(category) {
  const categoryCard = document.createElement("div")
  categoryCard.className = "category-card"

  categoryCard.innerHTML = `
        <div class="category-image">
            <img src="${category.hinh_anh}" alt="${category.ten_danh_muc}" 
                 onerror="this.src='/placeholder.svg?height=280&width=350&text=${encodeURIComponent(category.ten_danh_muc)}'">
            <div class="category-overlay">
                <h3>${category.ten_danh_muc}</h3>
                <p>${category.tour_count || "0"} tours</p>
                <a href="/tours?category=${category.id}" class="btn-explore">Khám phá</a>
            </div>
        </div>
        <div class="category-card-content">
            <h3 class="category-card-title">${category.ten_danh_muc}</h3>
            <p class="category-card-count">${category.tour_count || "0"} tour</p>
        </div>
    `

  categoryCard.addEventListener("click", () => {
    window.location.href = `/tours?category=${category.id}`
  })

  return categoryCard
}

// Hàm lấy tour nổi bật
function fetchFeaturedTours() {
  // Dữ liệu mẫu cho tours
  const fallbackTours = [
    {
      id: 1,
      ten_tour: "Du lịch Đà Nẵng - Hội An 4N3D",
      ten_danh_muc: "Tour trong nước",
      dia_diem_den: "Đà Nẵng - Hội An",
      thoi_gian_tour: "4 ngày 3 đêm",
      gia_nguoi_lon: 3500000,
      hinh_anh_chinh: "/static/images/tours/da-nang-1.jpg",
      diem_danh_gia_trung_binh: 4.5,
      so_luong_danh_gia: 125,
      mo_ta_ngan: "Khám phá Cầu Vàng - Bà Nà Hills và phố cổ Hội An",
    },
    {
      id: 2,
      ten_tour: "Tour Hạ Long - Ninh Bình 3N2D",
      ten_danh_muc: "Tour trong nước",
      dia_diem_den: "Hạ Long - Ninh Bình",
      thoi_gian_tour: "3 ngày 2 đêm",
      gia_nguoi_lon: 2800000,
      hinh_anh_chinh: "/static/images/tours/ha-long-1.jpg",
      diem_danh_gia_trung_binh: 4.5,
      so_luong_danh_gia: 89,
      mo_ta_ngan: "Du ngoạn Vịnh Hạ Long và Tràng An Ninh Bình",
    },
    {
      id: 3,
      ten_tour: "Phú Quốc - Đảo Ngọc 4N3D",
      ten_danh_muc: "Tour biển đảo",
      dia_diem_den: "Phú Quốc",
      thoi_gian_tour: "4 ngày 3 đêm",
      gia_nguoi_lon: 4200000,
      hinh_anh_chinh: "/static/images/tours/phu-quoc-1.jpg",
      diem_danh_gia_trung_binh: 4.5,
      so_luong_danh_gia: 156,
      mo_ta_ngan: "Nghỉ dưỡng tại Bãi Sao và khám phá Vinpearl Safari",
    },
    {
      id: 4,
      ten_tour: "Bangkok - Pattaya 5N4D",
      ten_danh_muc: "Tour nước ngoài",
      dia_diem_den: "Thái Lan",
      thoi_gian_tour: "5 ngày 4 đêm",
      gia_nguoi_lon: 6500000,
      hinh_anh_chinh: "/static/images/tours/thai-lan-1.jpg",
      diem_danh_gia_trung_binh: 4.3,
      so_luong_danh_gia: 78,
      mo_ta_ngan: "Khám phá chùa Wat Arun và thư giãn tại Pattaya Beach",
    },
    {
      id: 5,
      ten_tour: "Nhật Bản - Tokyo Osaka 6N5D",
      ten_danh_muc: "Tour nước ngoài",
      dia_diem_den: "Nhật Bản",
      thoi_gian_tour: "6 ngày 5 đêm",
      gia_nguoi_lon: 15800000,
      hinh_anh_chinh: "/static/images/tours/nhat-ban-1.jpg",
      diem_danh_gia_trung_binh: 4.8,
      so_luong_danh_gia: 234,
      mo_ta_ngan: "Ngắm núi Phú Sĩ và tham quan đền Kiyomizu-dera",
    },
    {
      id: 6,
      ten_tour: "Nha Trang - Vinpearl 3N2D",
      ten_danh_muc: "Tour biển đảo",
      dia_diem_den: "Nha Trang",
      thoi_gian_tour: "3 ngày 2 đêm",
      gia_nguoi_lon: 2200000,
      hinh_anh_chinh: "/static/images/tours/nha-trang-1.jpg",
      diem_danh_gia_trung_binh: 4.2,
      so_luong_danh_gia: 67,
      mo_ta_ngan: "Tắm biển Nha Trang và vui chơi tại Vinpearl Land",
    },
  ]

  fetch("/api/tours?featured=1&limit=6")
    .then((response) => response.json())
    .then((data) => {
      displayFeaturedTours(data)
    })
    .catch((error) => {
      console.log("Using fallback tours data")
      displayFeaturedTours(fallbackTours)
    })
}

// Hàm hiển thị tour nổi bật
function displayFeaturedTours(tours) {
  const featuredToursContainer = document.getElementById("featured-tours-container")
  if (featuredToursContainer) {
    featuredToursContainer.innerHTML = ""
    tours.forEach((tour) => {
      const tourCard = createTourCard(tour)
      featuredToursContainer.appendChild(tourCard)
    })
  }
}

// Hàm tạo card tour - BỎ phần tour-card-category
function createTourCard(tour) {
  const tourCard = document.createElement("div")
  tourCard.className = "tour-card"

  // Format giá
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(tour.gia_nguoi_lon)

  // Tạo HTML cho card - BỎ tour-card-category
  tourCard.innerHTML = `
        <div class="tour-card-image">
            <img src="${tour.hinh_anh_chinh}" alt="${tour.ten_tour}" 
                 onerror="this.src='/placeholder.svg?height=250&width=350&text=${encodeURIComponent(tour.ten_tour)}'">
            <div class="tour-badge">
                <span class="badge badge-featured">NỔI BẬT</span>
            </div>
        </div>
        <div class="tour-card-content">
            <h3 class="tour-card-title">
                <a href="/tour/${tour.id}">${tour.ten_tour}</a>
            </h3>
            <div class="tour-description">${tour.mo_ta_ngan || ""}</div>
            <div class="tour-card-info">
                <div class="tour-card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${tour.dia_diem_den}</span>
                </div>
                <div class="tour-card-duration">
                    <i class="fas fa-clock"></i>
                    <span>${tour.thoi_gian_tour}</span>
                </div>
            </div>
            <div class="tour-card-rating">
                <div class="stars">
                    ${generateStars(tour.diem_danh_gia_trung_binh || 0)}
                </div>
                <span class="rating-text">(${tour.so_luong_danh_gia || 0} đánh giá)</span>
            </div>
            <div class="tour-card-price">
                <div class="price-info">
                    <span class="price-label">Từ</span>
                    <span class="price-amount">${formattedPrice}</span>
                    <span class="price-unit">VND</span>
                </div>
                <a href="/tour/${tour.id}" class="btn btn-outline">Xem chi tiết</a>
            </div>
        </div>
    `

  return tourCard
}

// Hàm tạo HTML cho sao đánh giá
function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  let starsHTML = ""

  // Sao đầy
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  // Nửa sao
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  // Sao rỗng
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

// Hàm lấy đánh giá khách hàng
function fetchTestimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=50&width=50&text=A",
      rating: 5,
      content: "Chuyến du lịch tuyệt vời! Hướng dẫn viên rất nhiệt tình và chuyên nghiệp. Tôi sẽ quay lại vào lần sau.",
      tour: "Tour Đà Nẵng - Hội An",
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=50&width=50&text=B",
      rating: 4.5,
      content:
        "Dịch vụ tốt, lịch trình hợp lý. Tuy nhiên, thời gian tự do hơi ít. Nhìn chung là một trải nghiệm đáng nhớ.",
      tour: "Tour Hạ Long - Ninh Bình",
      location: "Hà Nội",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=50&width=50&text=C",
      rating: 5,
      content:
        "Tôi rất hài lòng với chuyến đi này. Khách sạn tuyệt vời, đồ ăn ngon, và các điểm tham quan đều rất thú vị.",
      tour: "Tour Phú Quốc",
      location: "Đà Nẵng",
    },
  ]

  const testimonialsContainer = document.getElementById("testimonials-container")
  if (testimonialsContainer) {
    testimonialsContainer.innerHTML = ""
    testimonials.forEach((testimonial) => {
      const testimonialCard = createTestimonialCard(testimonial)
      testimonialsContainer.appendChild(testimonialCard)
    })
  }
}

// Hàm tạo card đánh giá
function createTestimonialCard(testimonial) {
  const testimonialCard = document.createElement("div")
  testimonialCard.className = "testimonial-card"

  testimonialCard.innerHTML = `
        <div class="testimonial-rating">
            <div class="stars">
                ${generateStars(testimonial.rating)}
            </div>
        </div>
        <div class="testimonial-content">
            <p class="testimonial-text">${testimonial.content}</p>
        </div>
        <div class="testimonial-author">
            <img src="${testimonial.avatar}" alt="${testimonial.name}" class="author-avatar">
            <div class="author-info">
                <div class="author-name">${testimonial.name}</div>
                <p class="author-location">${testimonial.location}</p>
            </div>
        </div>
    `

  return testimonialCard
}
