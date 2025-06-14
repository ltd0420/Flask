document.addEventListener('DOMContentLoaded', function() {
    // Lấy ID tour từ URL
    const tourId = window.location.pathname.split('/').pop();
    
    // Lấy thông tin chi tiết tour
    fetchTourDetail(tourId);
    
    // Xử lý tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Xóa class active từ tất cả các tab
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Thêm class active cho tab được chọn
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Xử lý form đặt tour
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Kiểm tra đăng nhập
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Vui lòng đăng nhập để đặt tour!');
                window.location.href = '/dang-nhap?redirect=' + encodeURIComponent(window.location.href);
                return;
            }
            
            // Lấy dữ liệu từ form
            const adults = parseInt(document.getElementById('adults').value);
            const children = parseInt(document.getElementById('children').value);
            const bookingDate = document.getElementById('booking-date').value;
            
            // Lấy dịch vụ phụ trợ đã chọn
            const additionalServices = [];
            document.querySelectorAll('.service-checkbox:checked').forEach(checkbox => {
                const serviceId = checkbox.value;
                const quantity = parseInt(document.querySelector(`.service-quantity-input[data-service="${serviceId}"]`).value);
                
                additionalServices.push({
                    id_dich_vu: serviceId,
                    so_luong: quantity
                });
            });
            
            // Tạo dữ liệu đặt tour
            const bookingData = {
                id_tour: tourId,
                so_nguoi_lon: adults,
                so_tre_em: children,
                ngay_khoi_hanh: bookingDate,
                dich_vu_phu_tro: additionalServices
            };
            
            // Gửi yêu cầu đặt tour
            fetch('/api/dat-tour', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Đặt tour thành công!');
                    window.location.href = `/don-dat-tour/${data.don_dat_tour_id}`;
                } else {
                    alert(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            });
        });
    }
    
    // Xử lý nút tăng/giảm số lượng
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    if (quantityBtns) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const target = btn.getAttribute('data-target');
                const input = document.getElementById(target);
                const currentValue = parseInt(input.value);
                
                if (btn.classList.contains('plus')) {
                    input.value = currentValue + 1;
                } else if (btn.classList.contains('minus')) {
                    if (currentValue > (target === 'adults' ? 1 : 0)) {
                        input.value = currentValue - 1;
                    }
                }
                
                // Cập nhật tổng tiền
                updateTotalPrice();
            });
        });
    }
    
    // Xử lý form đánh giá
    const writeReviewBtn = document.getElementById('write-review-btn');
    const reviewForm = document.getElementById('review-form');
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    const submitReviewForm = document.getElementById('submit-review-form');
    
    if (writeReviewBtn && reviewForm) {
        writeReviewBtn.addEventListener('click', function() {
            // Kiểm tra đăng nhập
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Vui lòng đăng nhập để đánh giá tour!');
                window.location.href = '/dang-nhap?redirect=' + encodeURIComponent(window.location.href);
                return;
            }
            
            reviewForm.style.display = 'block';
            writeReviewBtn.style.display = 'none';
        });
    }
    
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', function() {
            reviewForm.style.display = 'none';
            writeReviewBtn.style.display = 'block';
        });
    }
    
    if (submitReviewForm) {
        submitReviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rating = document.getElementById('rating-value').value;
            const content = document.getElementById('review-content').value;
            
            if (!rating || rating === '0') {
                alert('Vui lòng chọn số sao đánh giá!');
                return;
            }
            
            // Gửi đánh giá
            fetch('/api/danh-gia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_tour: tourId,
                    diem_danh_gia: parseInt(rating),
                    noi_dung: content
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Đánh giá thành công!');
                    // Tải lại trang để hiển thị đánh giá mới
                    window.location.reload();
                } else {
                    alert(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            });
        });
    }
    
    // Xử lý đánh giá sao
    const ratingStars = document.querySelectorAll('.rating-input i');
    const ratingValue = document.getElementById('rating-value');
    
    if (ratingStars && ratingValue) {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = parseInt(star.getAttribute('data-rating'));
                
                // Cập nhật hiển thị sao
                updateStarsDisplay(rating);
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = parseInt(ratingValue.value) || 0;
                
                // Cập nhật hiển thị sao
                updateStarsDisplay(currentRating);
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(star.getAttribute('data-rating'));
                
                // Cập nhật giá trị đánh giá
                ratingValue.value = rating;
                
                // Cập nhật hiển thị sao
                updateStarsDisplay(rating);
            });
        });
    }
});

// Hàm lấy thông tin chi tiết tour
function fetchTourDetail(tourId) {
    fetch(`/api/tours/${tourId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                window.location.href = '/tours';
                return;
            }
            
            // Cập nhật thông tin tour
            updateTourInfo(data);
            
            // Cập nhật gallery
            updateTourGallery(data.hinh_anh);
            
            // Cập nhật đánh giá
            updateTourReviews(data.danh_gia, data.diem_danh_gia_trung_binh);
            
            // Cập nhật dịch vụ phụ trợ
            updateAdditionalServices(data.tour.id);
            
            // Cập nhật gợi ý dịch vụ
            updateRecommendedServices(data.dich_vu_phu_tro_goi_y);
            
            // Cập nhật tour tương tự
            fetchRelatedTours(data.tour.id_danh_muc, data.tour.id);
            
            // Khởi tạo Swiper cho gallery
            initGallerySwiper();
        })
        .catch(error => console.error('Error fetching tour detail:', error));
}

// Hàm cập nhật thông tin tour
function updateTourInfo(data) {
    const tour = data.tour;
    
    // Cập nhật tiêu đề trang
    document.title = `${tour.ten_tour} - TravelVN`;
    
    // Cập nhật breadcrumb
    document.getElementById('breadcrumb-tour-name').textContent = tour.ten_tour;
    
    // Cập nhật thông tin cơ bản
    document.getElementById('tour-title').textContent = tour.ten_tour;
    document.getElementById('tour-name').textContent = tour.ten_tour;
    document.getElementById('tour-category').textContent = tour.ten_danh_muc;
    document.getElementById('tour-departure').textContent = tour.dia_diem_khoi_hanh;
    document.getElementById('tour-destination').textContent = tour.dia_diem_den;
    document.getElementById('tour-duration').textContent = tour.thoi_gian_tour;
    
    // Format ngày
    const startDate = new Date(tour.ngay_khoi_hanh);
    document.getElementById('tour-start-date').textContent = startDate.toLocaleDateString('vi-VN');
    
    // Cập nhật mô tả
    document.getElementById('tour-description').innerHTML = tour.mo_ta;
    
    // Cập nhật giá
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(tour.gia_nguoi_lon);
    
    document.getElementById('tour-price').textContent = formattedPrice;
    
    // Cập nhật giá trẻ em nếu có
    if (tour.gia_tre_em) {
        const formattedChildPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(tour.gia_tre_em);
        
        document.getElementById('tour-price-child').textContent = `${formattedChildPrice} / trẻ em`;
    } else {
        document.getElementById('tour-price-child').textContent = 'Liên hệ để biết giá trẻ em';
    }
    
    // Cập nhật đánh giá
    const ratingCount = data.danh_gia.length;
    document.getElementById('tour-rating-count').textContent = `${ratingCount} đánh giá`;
    
    const starsContainer = document.getElementById('tour-stars');
    starsContainer.innerHTML = generateStars(data.diem_danh_gia_trung_binh || 0);
    
    // Cập nhật ngày đặt tour
    const bookingDateInput = document.getElementById('booking-date');
    if (bookingDateInput) {
        bookingDateInput.min = new Date().toISOString().split('T')[0];
        bookingDateInput.value = tour.ngay_khoi_hanh;
    }
    
    // Cập nhật nội dung tab
    document.getElementById('itinerary').innerHTML = `
        <p>Lịch trình chi tiết của tour ${tour.ten_tour} sẽ được cập nhật sớm.</p>
        <p>Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.</p>
    `;
    
    document.getElementById('included').innerHTML = `
        <ul>
            <li>Vé máy bay khứ hồi</li>
            <li>Khách sạn tiêu chuẩn (2 người/phòng)</li>
            <li>Các bữa ăn theo chương trình</li>
            <li>Xe đưa đón theo chương trình</li>
            <li>Hướng dẫn viên tiếng Việt</li>
            <li>Vé tham quan các điểm trong chương trình</li>
            <li>Bảo hiểm du lịch</li>
        </ul>
    `;
    
    document.getElementById('excluded').innerHTML = `
        <ul>
            <li>Chi phí cá nhân</li>
            <li>Đồ uống trong các bữa ăn</li>
            <li>Tiền tip cho hướng dẫn viên và tài xế</li>
            <li>Các dịch vụ không được đề cập trong phần "Bao gồm"</li>
        </ul>
    `;
    
    document.getElementById('notes').innerHTML = `
        <ul>
            <li>Giá tour có thể thay đổi tùy thuộc vào thời điểm đặt và tình trạng chỗ</li>
            <li>Lịch trình có thể thay đổi tùy thuộc vào điều kiện thời tiết và các yếu tố khách quan khác</li>
            <li>Quý khách cần đặt cọc 50% giá trị tour khi đăng ký</li>
            <li>Thanh toán đầy đủ trước ngày khởi hành ít nhất 7 ngày</li>
            <li>Hủy tour trước 15 ngày: phí hủy 10%</li>
            <li>Hủy tour từ 8-14 ngày: phí hủy 40%</li>
            <li>Hủy tour từ 5-7 ngày: phí hủy 60%</li>
            <li>Hủy tour từ 3-4 ngày: phí hủy 80%</li>
            <li>Hủy tour trong vòng 48h: phí hủy 100%</li>
        </ul>
    `;
}

// Hàm cập nhật gallery
function updateTourGallery(images) {
    const sliderContainer = document.getElementById('tour-gallery-slider');
    const thumbsContainer = document.getElementById('tour-gallery-thumbs');
    
    if (!images || images.length === 0) {
        // Nếu không có hình ảnh, hiển thị hình mặc định
        sliderContainer.innerHTML = `
            <div class="swiper-slide">
                <img src="/static/images/tour-placeholder.jpg" alt="Tour image">
            </div>
        `;
        
        thumbsContainer.innerHTML = `
            <div class="swiper-slide">
                <img src="/static/images/tour-placeholder.jpg" alt="Tour image">
            </div>
        `;
        
        return;
    }
    
    // Xóa nội dung hiện tại
    sliderContainer.innerHTML = '';
    thumbsContainer.innerHTML = '';
    
    // Thêm hình ảnh vào slider
    images.forEach(image => {
        const sliderSlide = document.createElement('div');
        sliderSlide.className = 'swiper-slide';
        sliderSlide.innerHTML = `<img src="${image.duong_dan}" alt="${image.mo_ta || 'Tour image'}">`;
        sliderContainer.appendChild(sliderSlide);
        
        const thumbSlide = document.createElement('div');
        thumbSlide.className = 'swiper-slide';
        thumbSlide.innerHTML = `<img src="${image.duong_dan}" alt="${image.mo_ta || 'Tour image'}">`;
        thumbsContainer.appendChild(thumbSlide);
    });
}

// Hàm khởi tạo Swiper cho gallery
function initGallerySwiper() {
    const Swiper = window.Swiper; // Declare Swiper variable
    const thumbsSwiper = new Swiper('.tour-gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true
    });
    
    const gallerySwiper = new Swiper('.tour-gallery-slider', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        thumbs: {
            swiper: thumbsSwiper
        }
    });
}

// Hàm cập nhật đánh giá
function updateTourReviews(reviews, averageRating) {
    // Cập nhật đánh giá trung bình
    document.getElementById('average-rating').textContent = averageRating.toFixed(1);
    document.getElementById('average-rating-stars').innerHTML = generateStars(averageRating);
    document.getElementById('total-reviews').textContent = `${reviews.length} đánh giá`;
    
    // Tính số lượng đánh giá theo số sao
    const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 sao
    
    reviews.forEach(review => {
        const rating = review.diem_danh_gia;
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating - 1]++;
        }
    });
    
    // Cập nhật thanh đánh giá
    for (let i = 1; i <= 5; i++) {
        const count = ratingCounts[i - 1];
        const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        
        document.getElementById(`rating-${i}`).style.width = `${percent}%`;
        document.getElementById(`rating-${i}-count`).textContent = count;
    }
    
    // Hiển thị danh sách đánh giá
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">Chưa có đánh giá nào cho tour này.</p>';
        return;
    }
    
    // Sắp xếp đánh giá theo thời gian mới nhất
    reviews.sort((a, b) => new Date(b.ngay_danh_gia) - new Date(a.ngay_danh_gia));
    
    // Hiển thị tối đa 5 đánh giá đầu tiên
    const displayReviews = reviews.slice(0, 5);
    
    displayReviews.forEach(review => {
        const reviewCard = createReviewCard(review);
        reviewsList.appendChild(reviewCard);
    });
    
    // Hiển thị nút "Xem thêm" nếu có nhiều hơn 5 đánh giá
    const loadMoreBtn = document.getElementById('load-more-reviews');
    if (reviews.length > 5) {
        loadMoreBtn.style.display = 'block';
        
        loadMoreBtn.querySelector('button').addEventListener('click', function() {
            // Hiển thị thêm 5 đánh giá
            const currentCount = reviewsList.querySelectorAll('.review-card').length;
            const nextReviews = reviews.slice(currentCount, currentCount + 5);
            
            nextReviews.forEach(review => {
                const reviewCard = createReviewCard(review);
                reviewsList.appendChild(reviewCard);
            });
            
            // Ẩn nút "Xem thêm" nếu đã hiển thị tất cả đánh giá
            if (currentCount + nextReviews.length >= reviews.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Hàm tạo card đánh giá
function createReviewCard(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    // Format ngày
    const reviewDate = new Date(review.ngay_danh_gia);
    const formattedDate = reviewDate.toLocaleDateString('vi-VN');
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                    <img src="/static/images/avatar-placeholder.jpg" alt="${review.ho_ten}">
                </div>
                <div>
                    <h4 class="reviewer-name">${review.ho_ten}</h4>
                    <p class="review-date">${formattedDate}</p>
                </div>
            </div>
            <div class="review-rating">
                <div class="stars">
                    ${generateStars(review.diem_danh_gia)}
                </div>
            </div>
        </div>
        <div class="review-content">
            <p>${review.noi_dung || 'Không có nội dung đánh giá.'}</p>
        </div>
    `;
    
    return reviewCard;
}

// Hàm cập nhật dịch vụ phụ trợ
function updateAdditionalServices(tourId) {
    fetch(`/api/dich-vu-phu-tro?tour_id=${tourId}`)
        .then(response => response.json())
        .then(data => {
            const servicesContainer = document.getElementById('additional-services');
            
            if (!data || data.length === 0) {
                servicesContainer.innerHTML = '<p>Không có dịch vụ phụ trợ cho tour này.</p>';
                return;
            }
            
            servicesContainer.innerHTML = '<h4>Dịch vụ phụ trợ</h4>';
            
            data.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';
                
                // Format giá
                const formattedPrice = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(service.gia);
                
                serviceItem.innerHTML = `
                    <div class="service-info">
                        <span class="service-name">${service.ten_dich_vu}</span>
                        <span class="service-price">${formattedPrice}</span>
                    </div>
                    <div class="service-quantity">
                        <input type="checkbox" class="service-checkbox" value="${service.id}" id="service-${service.id}">
                        <div class="quantity-input">
                            <button type="button" class="quantity-btn minus" data-service="${service.id}">-</button>
                            <input type="number" class="service-quantity-input" data-service="${service.id}" min="1" value="1">
                            <button type="button" class="quantity-btn plus" data-service="${service.id}">+</button>
                        </div>
                    </div>
                `;
                
                servicesContainer.appendChild(serviceItem);
                
                // Xử lý sự kiện thay đổi số lượng
                const minusBtn = serviceItem.querySelector(`.quantity-btn.minus[data-service="${service.id}"]`);
                const plusBtn = serviceItem.querySelector(`.quantity-btn.plus[data-service="${service.id}"]`);
                const quantityInput = serviceItem.querySelector(`.service-quantity-input[data-service="${service.id}"]`);
                const checkbox = serviceItem.querySelector(`#service-${service.id}`);
                
                minusBtn.addEventListener('click', function() {
                    const currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        quantityInput.value = currentValue - 1;
                        updateTotalPrice();
                    }
                });
                
                plusBtn.addEventListener('click', function() {
                    const currentValue = parseInt(quantityInput.value);
                    quantityInput.value = currentValue + 1;
                    updateTotalPrice();
                });
                
                quantityInput.addEventListener('change', function() {
                    updateTotalPrice();
                });
                
                checkbox.addEventListener('change', function() {
                    updateTotalPrice();
                });
            });
            
            // Cập nhật tổng tiền ban đầu
            updateTotalPrice();
        })
        .catch(error => console.error('Error fetching additional services:', error));
}

// Hàm cập nhật gợi ý dịch vụ
function updateRecommendedServices(recommendations) {
    const recommendedServicesContainer = document.getElementById('recommended-services');
    
    if (!recommendations || recommendations.length === 0) {
        recommendedServicesContainer.style.display = 'none';
        return;
    }
    
    recommendedServicesContainer.innerHTML = '<h4>Gợi ý dịch vụ</h4>';
    
    recommendations.forEach(recommendation => {
        const recommendationItem = document.createElement('div');
        recommendationItem.className = 'recommendation-item';
        
        // Tạo nội dung gợi ý
        let content = '';
        
        if (recommendation.antecedent_names.length > 0) {
            content += `<p>Khách hàng thường đặt "${recommendation.consequent_names.join(', ')}" khi đặt "${recommendation.antecedent_names.join(', ')}".</p>`;
        } else {
            content += `<p>Khách hàng thường đặt "${recommendation.consequent_names.join(', ')}" cho tour này.</p>`;
        }
        
        content += `<p><small>Độ tin cậy: ${(recommendation.confidence * 100).toFixed(1)}%</small></p>`;
        
        recommendationItem.innerHTML = content;
        recommendedServicesContainer.appendChild(recommendationItem);
    });
}

// Hàm cập nhật tổng tiền
function updateTotalPrice() {
    // Lấy giá tour
    const tourPriceText = document.getElementById('tour-price').textContent;
    const tourPrice = parseFloat(tourPriceText.replace(/[^\d]/g, ''));
    
    // Lấy giá trẻ em
    let childPrice = 0;
    const childPriceElement = document.getElementById('tour-price-child');
    if (childPriceElement && childPriceElement.textContent.includes('VNĐ')) {
        const childPriceText = childPriceElement.textContent;
        childPrice = parseFloat(childPriceText.replace(/[^\d]/g, ''));
    }
    
    // Lấy số lượng người lớn và trẻ em
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    
    // Tính tiền tour
    let totalPrice = tourPrice * adults;
    if (childPrice > 0) {
        totalPrice += childPrice * children;
    }
    
    // Tính tiền dịch vụ phụ trợ
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox:checked');
    serviceCheckboxes.forEach(checkbox => {
        const serviceId = checkbox.value;
        const quantityInput = document.querySelector(`.service-quantity-input[data-service="${serviceId}"]`);
        const quantity = parseInt(quantityInput.value);
        
        // Lấy giá dịch vụ
        const servicePriceText = checkbox.closest('.service-item').querySelector('.service-price').textContent;
        const servicePrice = parseFloat(servicePriceText.replace(/[^\d]/g, ''));
        
        totalPrice += servicePrice * quantity;
    });
    
    // Hiển thị tổng tiền
    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(totalPrice);
    
    document.getElementById('total-price').textContent = formattedTotalPrice;
}

// Hàm lấy tour tương tự
function fetchRelatedTours(categoryId, currentTourId) {
    fetch(`/api/tours?danh_muc_id=${categoryId}&limit=4`)
        .then(response => response.json())
        .then(data => {
            // Lọc bỏ tour hiện tại
            const relatedTours = data.filter(tour => tour.id != currentTourId);
            
            const relatedToursContainer = document.getElementById('related-tours');
            relatedToursContainer.innerHTML = '';
            
            if (relatedTours.length === 0) {
                relatedToursContainer.innerHTML = '<p>Không có tour tương tự.</p>';
                return;
            }
            
            // Hiển thị tối đa 3 tour tương tự
            relatedTours.slice(0, 3).forEach(tour => {
                const tourCard = createTourCard(tour);
                relatedToursContainer.appendChild(tourCard);
            });
        })
        .catch(error => console.error('Error fetching related tours:', error));
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
    
    // Tạo HTML cho card
    tourCard.innerHTML = `
        <div class="tour-card-image">
            <img src="${tour.hinh_anh_chinh || '/static/images/tour-placeholder.jpg'}" alt="${tour.ten_tour}">
            <div class="tour-card-category">${tour.ten_danh_muc}</div>
        </div>
        <div class="tour-card-content">
            <h3 class="tour-card-title">${tour.ten_tour}</h3>
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
                <span>${tour.so_luong_danh_gia || 0} đánh giá</span>
            </div>
            <div class="tour-card-price">
                <div>
                    <span class="price">${formattedPrice}</span>
                    <span class="per-person">/ người</span>
                </div>
                <a href="/tour/${tour.id}" class="btn btn-outline">Chi tiết</a>
            </div>
        </div>
    `;
    
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

// Hàm cập nhật hiển thị sao đánh giá
function updateStarsDisplay(rating) {
    const stars = document.querySelectorAll('.rating-input i');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý menu mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Thay đổi icon
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Xử lý tìm kiếm
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `/tours?keyword=${encodeURIComponent(keyword)}`;
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    window.location.href = `/tours?keyword=${encodeURIComponent(keyword)}`;
                }
            }
        });
    }
    
    // Kiểm tra đăng nhập và cập nhật UI
    checkLoginStatus();
    
    // Xử lý nút đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Xử lý dropdown menu
    const userDropdown = document.getElementById('user-dropdown');
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    
    if (userDropdown && userDropdownMenu) {
        userDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdownMenu.classList.toggle('active');
        });
        
        // Đóng dropdown khi click ra ngoài
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !userDropdownMenu.contains(e.target)) {
                userDropdownMenu.classList.remove('active');
            }
        });
    }
});

// Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    
    if (user) {
        // Đã đăng nhập
        if (authButtons) {
            authButtons.style.display = 'none';
        }
        
        if (userMenu) {
            userMenu.style.display = 'flex';
            
            // Cập nhật tên người dùng
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = user.ho_ten;
            }
        }
    } else {
        // Chưa đăng nhập
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }
}

// Hàm đăng xuất
function logout() {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('user');
    
    // Cập nhật UI
    checkLoginStatus();
    
    // Chuyển hướng về trang chủ
    window.location.href = '/';
}

// Hàm format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Hàm format ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
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
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý tất cả các hình ảnh trong trang
    document.querySelectorAll('img').forEach(function(img) {
        img.onerror = function() {
            // Xác định loại hình ảnh để sử dụng placeholder phù hợp
            if (img.src.includes('/categories/')) {
                this.src = '/static/images/category-placeholder.jpg';
            } else if (img.src.includes('/tours/')) {
                this.src = '/static/images/tour-placeholder.jpg';
            } else if (img.classList.contains('author-avatar') || img.parentElement.classList.contains('author-avatar')) {
                this.src = '/static/images/avatar-placeholder.jpg';
            } else {
                this.src = '/static/images/tour-placeholder.jpg';
            }
            this.onerror = null; // Tránh vòng lặp vô hạn nếu placeholder cũng không tồn tại
        };
    });
    
    // Đảm bảo hiển thị đúng tiếng Việt trong các phần tử HTML
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, label, button').forEach(function(element) {
        // Không cần làm gì đặc biệt nếu đã thiết lập đúng mã hóa
        // Đây chỉ là một hook để xử lý nếu cần thiết trong tương lai
    });
});