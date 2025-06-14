
document.addEventListener('DOMContentLoaded', function() {
    // Thiết lập mặc định cho AJAX để hỗ trợ UTF-8
    setupAjaxDefaults();
    
    // Lấy danh mục tour cho bộ lọc
    fetchCategories();
    
    // Lấy danh sách điểm khởi hành cho bộ lọc
    fetchDeparturePoints();
    
    // Lấy danh sách tour
    fetchTours();
    
    // Xử lý nút áp dụng bộ lọc
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            fetchTours(1); // Lấy tour trang 1 với bộ lọc mới
        });
    }
    
    // Xử lý nút đặt lại bộ lọc
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            // Đặt lại các bộ lọc
            document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            const minPriceInput = document.getElementById('min-price');
            const maxPriceInput = document.getElementById('max-price');
            const priceSlider = document.getElementById('price-slider');
            const startDateInput = document.getElementById('start-date');
            const endDateInput = document.getElementById('end-date');
            
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            if (priceSlider) priceSlider.value = 20000000;
            if (startDateInput) startDateInput.value = '';
            if (endDateInput) endDateInput.value = '';
            
            // Lấy lại danh sách tour
            fetchTours();
        });
    }
    
    // Xử lý thay đổi sắp xếp
    const sortBySelect = document.getElementById('sort-by');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            fetchTours(1); // Lấy tour trang 1 với sắp xếp mới
        });
    }
    
    // Xử lý thanh trượt giá
    const priceSlider = document.getElementById('price-slider');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (priceSlider && minPriceInput && maxPriceInput) {
        priceSlider.addEventListener('input', function() {
            maxPriceInput.value = priceSlider.value;
        });
        
        minPriceInput.addEventListener('change', function() {
            if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
                minPriceInput.value = maxPriceInput.value;
            }
        });
        
        maxPriceInput.addEventListener('change', function() {
            if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
                maxPriceInput.value = minPriceInput.value;
            }
            
            priceSlider.value = maxPriceInput.value;
        });
    }
    
    // Đảm bảo hiển thị tiếng Việt đúng
    ensureVietnameseDisplay();
});

// Thiết lập mặc định cho AJAX để hỗ trợ UTF-8
function setupAjaxDefaults() {
    // Ghi đè phương thức fetch để đảm bảo tất cả các yêu cầu AJAX đều có header UTF-8
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Accept'] = 'application/json; charset=UTF-8';
        if (options.method === 'POST' || options.method === 'PUT') {
            options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        }
        return originalFetch(url, options);
    };
}

// Hàm đảm bảo hiển thị tiếng Việt đúng
function ensureVietnameseDisplay() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, label, button, input, textarea, select, option').forEach(function(element) {
        // Đảm bảo phần tử hiển thị với font hỗ trợ tiếng Việt
        element.classList.add('vietnamese-text');
    });
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    // Kiểm tra xem đã có thông báo nào chưa
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Hàm lấy danh mục tour cho bộ lọc
function fetchCategories() {
    fetch('/api/danh-muc-tour', {
        headers: {
            'Accept': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(data => {
        const categoryFilters = document.getElementById('category-filters');
        if (categoryFilters) {
            data.forEach(category => {
                const checkboxItem = document.createElement('div');
                checkboxItem.className = 'checkbox-item';
                
                checkboxItem.innerHTML = `
                    <input type="checkbox" id="category-${category.id}" value="${category.id}">
                    <label for="category-${category.id}" class="vietnamese-text">${category.ten_danh_muc}</label>
                `;
                
                categoryFilters.appendChild(checkboxItem);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
        showNotification('Không thể tải danh mục tour. Vui lòng thử lại sau.', 'error');
    });
}

// Hàm lấy danh sách điểm khởi hành cho bộ lọc
function fetchDeparturePoints() {
    fetch('/api/diem-khoi-hanh', {
        headers: {
            'Accept': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(data => {
        const departureFilters = document.getElementById('departure-filters');
        if (departureFilters) {
            data.forEach(point => {
                const checkboxItem = document.createElement('div');
                checkboxItem.className = 'checkbox-item';
                
                checkboxItem.innerHTML = `
                    <input type="checkbox" id="departure-${point.id}" value="${point.dia_diem_khoi_hanh}">
                    <label for="departure-${point.id}" class="vietnamese-text">${point.dia_diem_khoi_hanh}</label>
                `;
                
                departureFilters.appendChild(checkboxItem);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching departure points:', error);
        showNotification('Không thể tải điểm khởi hành. Vui lòng thử lại sau.', 'error');
    });
}

// Hàm lấy danh sách tour
function fetchTours(page = 1) {
    // Hiển thị trạng thái đang tải
    const toursContainer = document.getElementById('tours-container');
    if (toursContainer) {
        toursContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p class="vietnamese-text">Đang tải tour...</p></div>';
    }
    
    // Lấy các tham số lọc
    const categoryCheckboxes = document.querySelectorAll('#category-filters input[type="checkbox"]:checked');
    const departureCheckboxes = document.querySelectorAll('#departure-filters input[type="checkbox"]:checked');
    const durationCheckboxes = document.querySelectorAll('#duration-filters input[type="checkbox"]:checked');
    
    const categories = Array.from(categoryCheckboxes).map(checkbox => checkbox.value);
    const departures = Array.from(departureCheckboxes).map(checkbox => checkbox.value);
    const durations = Array.from(durationCheckboxes).map(checkbox => checkbox.value);
    
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const sortBySelect = document.getElementById('sort-by');
    
    const minPrice = minPriceInput ? minPriceInput.value : '';
    const maxPrice = maxPriceInput ? maxPriceInput.value : '';
    const startDate = startDateInput ? startDateInput.value : '';
    const endDate = endDateInput ? endDateInput.value : '';
    const sortBy = sortBySelect ? sortBySelect.value : '';
    
    // Xây dựng URL với các tham số lọc
    let url = `/api/tours?page=${page}`;
    
    if (categories.length > 0) {
        url += `&danh_muc_id=${encodeURIComponent(categories.join(','))}`;
    }
    
    if (departures.length > 0) {
        url += `&dia_diem_khoi_hanh=${encodeURIComponent(departures.join(','))}`;
    }
    
    if (durations.length > 0) {
        url += `&thoi_gian=${encodeURIComponent(durations.join(','))}`;
    }
    
    if (minPrice) {
        url += `&gia_min=${encodeURIComponent(minPrice)}`;
    }
    
    if (maxPrice) {
        url += `&gia_max=${encodeURIComponent(maxPrice)}`;
    }
    
    if (startDate) {
        url += `&ngay_khoi_hanh_min=${encodeURIComponent(startDate)}`;
    }
    
    if (endDate) {
        url += `&ngay_khoi_hanh_max=${encodeURIComponent(endDate)}`;
    }
    
    if (sortBy) {
        url += `&sort=${encodeURIComponent(sortBy)}`;
    }
    
    // Lấy dữ liệu từ API
    fetch(url, {
        headers: {
            'Accept': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Cập nhật số lượng tour
        const toursCountElement = document.getElementById('tours-count');
        if (toursCountElement) {
            toursCountElement.textContent = data.total || 0;
        }
        
        // Hiển thị danh sách tour
        if (toursContainer) {
            toursContainer.innerHTML = '';
            
            if (!data.tours || data.tours.length === 0) {
                toursContainer.innerHTML = '<p class="no-tours vietnamese-text">Không tìm thấy tour nào phù hợp với bộ lọc của bạn.</p>';
                return;
            }
            
            data.tours.forEach(tour => {
                const tourCard = createTourCard(tour);
                toursContainer.appendChild(tourCard);
            });
        }
        
        // Tạo phân trang
        createPagination(data.total, data.per_page, page);
    })
    .catch(error => {
        console.error('Error fetching tours:', error);
        if (toursContainer) {
            toursContainer.innerHTML = '<p class="error-message vietnamese-text">Đã xảy ra lỗi khi tải danh sách tour. Vui lòng thử lại sau.</p>';
        }
        showNotification('Không thể tải danh sách tour. Vui lòng thử lại sau.', 'error');
    });
}

// Hàm tạo card tour
function createTourCard(tour) {
    const tourCard = document.createElement('div');
    tourCard.className = 'tour-card';
    
    // Format giá
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(tour.gia_nguoi_lon);
    
    // Cắt ngắn tên tour nếu quá dài
    const shortTitle = tour.ten_tour.length > 50 ? tour.ten_tour.substring(0, 50) + '...' : tour.ten_tour;
    
    // Tạo HTML cho card
    tourCard.innerHTML = `
        <div class="tour-card-image">
            <img src="${tour.hinh_anh_chinh || '/static/images/tour-placeholder.jpg'}" alt="${tour.ten_tour}" onerror="this.src='/static/images/tour-placeholder.jpg'">
            <div class="tour-card-category vietnamese-text">${tour.ten_danh_muc}</div>
        </div>
        <div class="tour-card-content">
            <h3 class="tour-card-title vietnamese-text" title="${tour.ten_tour}">${shortTitle}</h3>
            <div class="tour-card-info">
                <div class="tour-card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="vietnamese-text">${tour.dia_diem_den}</span>
                </div>
                <div class="tour-card-duration">
                    <i class="fas fa-clock"></i>
                    <span class="vietnamese-text">${tour.thoi_gian_tour}</span>
                </div>
            </div>
            <div class="tour-card-rating">
                <div class="stars">
                    ${generateStars(tour.diem_danh_gia_trung_binh || 0)}
                </div>
                <span class="vietnamese-text">${tour.so_luong_danh_gia || 0} đánh giá</span>
            </div>
            <div class="tour-card-price">
                <div>
                    <span class="price vietnamese-text">${formattedPrice}</span>
                    <span class="per-person vietnamese-text">/ người</span>
                </div>
                <a href="/tour/${tour.id}" class="btn btn-outline vietnamese-text">Chi tiết</a>
            </div>
        </div>
    `;
    
    // Thêm sự kiện click cho card
    tourCard.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) {
            window.location.href = `/tour/${tour.id}`;
        }
    });
    
    return tourCard;
}

// Hàm tạo HTML cho sao đánh giá
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Sao đầy
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Nửa sao
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Sao rỗng
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Hàm tạo phân trang
function createPagination(total, perPage, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(total / perPage);
    
    if (totalPages <= 1) {
        return;
    }
    
    // Nút trang trước
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.setAttribute('aria-label', 'Trang trước');
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            fetchTours(currentPage - 1);
            // Cuộn lên đầu danh sách tour
            scrollToToursTop();
        }
    });
    pagination.appendChild(prevBtn);
    
    // Các nút trang
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.setAttribute('aria-label', `Trang ${i}`);
        pageBtn.setAttribute('aria-current', i === currentPage ? 'page' : 'false');
        pageBtn.addEventListener('click', function() {
            fetchTours(i);
            // Cuộn lên đầu danh sách tour
            scrollToToursTop();
        });
        pagination.appendChild(pageBtn);
    }
    
    // Nút trang sau
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.setAttribute('aria-label', 'Trang sau');
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            fetchTours(currentPage + 1);
            // Cuộn lên đầu danh sách tour
            scrollToToursTop();
        }
    });
    pagination.appendChild(nextBtn);
}

// Hàm cuộn lên đầu danh sách tour
function scrollToToursTop() {
    const toursContainer = document.getElementById('tours-container');
    if (toursContainer) {
        toursContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Xử lý lỗi hình ảnh
document.addEventListener('error', function(e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        // Xác định loại hình ảnh để sử dụng placeholder phù hợp
        if (e.target.src.includes('/categories/')) {
            e.target.src = '/static/images/category-placeholder.jpg';
        } else if (e.target.src.includes('/tours/')) {
            e.target.src = '/static/images/tour-placeholder.jpg';
        } else {
            e.target.src = '/static/images/tour-placeholder.jpg';
        }
        e.target.onerror = null; // Tránh vòng lặp vô hạn nếu placeholder cũng không tồn tại
    }
}, true);
// Hàm lấy danh mục tour cho bộ lọc
function fetchCategories() {
  fetch("/api/danh-muc-tour", {
    headers: {
      Accept: "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      const categoryFilters = document.getElementById("category-filters")
      if (categoryFilters && data && data.length > 0) {
        categoryFilters.innerHTML = ""
        data.forEach((category) => {
          const checkboxItem = document.createElement("div")
          checkboxItem.className = "checkbox-item"

          checkboxItem.innerHTML = `
                <input type="checkbox" id="category-${category.id}" value="${category.id}">
                <label for="category-${category.id}" class="vietnamese-text">${category.ten_danh_muc}</label>
            `

          categoryFilters.appendChild(checkboxItem)
        })
      } else {
        addFallbackCategories()
      }
    })
    .catch((error) => {
      console.error("Error fetching categories:", error)
      addFallbackCategories()
      window.showNotification("Không thể tải danh mục tour. Sử dụng dữ liệu mặc định.", "warning")
    })
}

// Hàm lấy danh sách điểm khởi hành cho bộ lọc
function fetchDeparturePoints() {
  fetch("/api/diem-khoi-hanh", {
    headers: {
      Accept: "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((data) => {
      const departureFilters = document.getElementById("departure-filters")
      if (departureFilters && data && data.length > 0) {
        departureFilters.innerHTML = ""
        data.forEach((point) => {
          const checkboxItem = document.createElement("div")
          checkboxItem.className = "checkbox-item"

          checkboxItem.innerHTML = `
                <input type="checkbox" id="departure-${point.id}" value="${point.dia_diem_khoi_hanh}">
                <label for="departure-${point.id}" class="vietnamese-text">${point.dia_diem_khoi_hanh}</label>
            `

          departureFilters.appendChild(checkboxItem)
        })
      } else {
        addFallbackDeparturePoints()
      }
    })
    .catch((error) => {
      console.error("Error fetching departure points:", error)
      addFallbackDeparturePoints()
      window.showNotification("Không thể tải điểm khởi hành. Sử dụng dữ liệu mặc định.", "warning")
    })
}

// Hàm thêm danh mục mặc định nếu API không hoạt động
function addFallbackCategories() {
  const categoryFilters = document.getElementById("category-filters")
  if (categoryFilters) {
    const fallbackCategories = [
      { id: 1, ten_danh_muc: "Tour trong nước" },
      { id: 2, ten_danh_muc: "Tour nước ngoài" },
      { id: 3, ten_danh_muc: "Tour nghỉ dưỡng" },
      { id: 4, ten_danh_muc: "Tour mạo hiểm" },
      { id: 5, ten_danh_muc: "Tour văn hóa" },
    ]

    categoryFilters.innerHTML = ""
    fallbackCategories.forEach((category) => {
      const checkboxItem = document.createElement("div")
      checkboxItem.className = "checkbox-item"

      checkboxItem.innerHTML = `
                <input type="checkbox" id="category-${category.id}" value="${category.id}">
                <label for="category-${category.id}" class="vietnamese-text">${category.ten_danh_muc}</label>
            `

      categoryFilters.appendChild(checkboxItem)
    })
  }
}

// Hàm thêm điểm khởi hành mặc định nếu API không hoạt động
function addFallbackDeparturePoints() {
  const departureFilters = document.getElementById("departure-filters")
  if (departureFilters) {
    const fallbackDepartures = [
      { id: 1, dia_diem_khoi_hanh: "Hồ Chí Minh" },
      { id: 2, dia_diem_khoi_hanh: "Hà Nội" },
      { id: 3, dia_diem_khoi_hanh: "Đà Nẵng" },
      { id: 4, dia_diem_khoi_hanh: "Cần Thơ" },
      { id: 5, dia_diem_khoi_hanh: "Nha Trang" },
      { id: 6, dia_diem_khoi_hanh: "Hải Phòng" },
      { id: 7, dia_diem_khoi_hanh: "Huế" },
    ]

    departureFilters.innerHTML = ""
    fallbackDepartures.forEach((point) => {
      const checkboxItem = document.createElement("div")
      checkboxItem.className = "checkbox-item"

      checkboxItem.innerHTML = `
                <input type="checkbox" id="departure-${point.id}" value="${point.dia_diem_khoi_hanh}">
                <label for="departure-${point.id}" class="vietnamese-text">${point.dia_diem_khoi_hanh}</label>
            `

      departureFilters.appendChild(checkboxItem)
    })
  }
}

// Declare showNotification function
function showNotification(message, type) {
  // Implementation of showNotification
  console.log(`Notification (${type}): ${message}`)
}
