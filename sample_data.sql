-- Thêm dữ liệu mẫu cho bảng DanhMucTour
INSERT INTO DanhMucTour (ten_danh_muc, mo_ta, hinh_anh) VALUES
(N'Tour trong nước', N'Các tour du lịch trong nước Việt Nam', N'/static/images/categories/trong-nuoc.jpg'),
(N'Tour nước ngoài', N'Các tour du lịch nước ngoài', N'/static/images/categories/nuoc-ngoai.jpg'),
(N'Tour biển đảo', N'Các tour du lịch biển đảo', N'/static/images/categories/bien-dao.jpg'),
(N'Tour nghỉ dưỡng', N'Các tour nghỉ dưỡng cao cấp', N'/static/images/categories/nghi-duong.jpg'),
(N'Tour mạo hiểm', N'Các tour du lịch mạo hiểm', N'/static/images/categories/mao-hiem.jpg');

-- Thêm dữ liệu mẫu cho bảng Tour
INSERT INTO Tour (id_danh_muc, ten_tour, mo_ta, gia_nguoi_lon, gia_tre_em, dia_diem_khoi_hanh, dia_diem_den, thoi_gian_tour, so_nguoi_toi_da, ngay_khoi_hanh, ngay_ket_thuc) VALUES
(1, N'Tour Đà Nẵng - Hội An - Bà Nà Hills', N'Khám phá vẻ đẹp của Đà Nẵng, Hội An và Bà Nà Hills trong 4 ngày 3 đêm. Tham quan Cầu Vàng, Phố cổ Hội An, Bãi biển Mỹ Khê và nhiều điểm đến hấp dẫn khác.', 3500000, 2800000, N'Hà Nội', N'Đà Nẵng', N'4 ngày 3 đêm', 30, '2023-07-15', '2023-07-18'),
(1, N'Tour Hà Nội - Hạ Long - Ninh Bình', N'Hành trình khám phá miền Bắc Việt Nam với các điểm đến nổi tiếng như Vịnh Hạ Long, Tràng An, Tam Cốc, và thăm quan thủ đô Hà Nội.', 4200000, 3500000, N'TP. Hồ Chí Minh', N'Hà Nội', N'5 ngày 4 đêm', 25, '2023-08-10', '2023-08-14'),
(1, N'Tour Phú Quốc', N'Nghỉ dưỡng tại đảo ngọc Phú Quốc với bãi biển cát trắng, nước biển trong xanh. Tham quan Vinpearl Safari, Vinpearl Land, và khám phá làng chài.', 5000000, 4000000, N'TP. Hồ Chí Minh', N'Phú Quốc', N'3 ngày 2 đêm', 20, '2023-09-05', '2023-09-07'),
(2, N'Tour Thái Lan - Bangkok - Pattaya', N'Khám phá đất nước chùa Vàng với các điểm đến hấp dẫn như Bangkok, Pattaya. Tham quan chùa Wat Arun, Cung điện Hoàng gia, và thưởng thức ẩm thực đường phố Thái Lan.', 8500000, 7000000, N'TP. Hồ Chí Minh', N'Bangkok', N'5 ngày 4 đêm', 30, '2023-07-20', '2023-07-24'),
(2, N'Tour Nhật Bản - Tokyo - Osaka - Kyoto', N'Hành trình khám phá đất nước mặt trời mọc với các điểm đến nổi tiếng như Tokyo, Osaka, Kyoto. Tham quan núi Phú Sĩ, đền Kiyomizu-dera, và trải nghiệm văn hóa Nhật Bản.', 25000000, 20000000, N'Hà Nội', N'Tokyo', N'7 ngày 6 đêm', 20, '2023-08-15', '2023-08-21'),
(3, N'Tour Nha Trang - Vinpearl Land', N'Nghỉ dưỡng tại thành phố biển Nha Trang và tham quan Vinpearl Land. Trải nghiệm các hoạt động như lặn biển, tắm bùn khoáng, và thưởng thức hải sản tươi ngon.', 4500000, 3600000, N'TP. Hồ Chí Minh', N'Nha Trang', N'4 ngày 3 đêm', 25, '2023-09-10', '2023-09-13'),
(3, N'Tour Côn Đảo', N'Khám phá vẻ đẹp hoang sơ của Côn Đảo với bãi biển đẹp, rừng nguyên sinh, và di tích lịch sử. Tham quan nhà tù Côn Đảo, mộ Võ Thị Sáu, và trải nghiệm lặn biển ngắm san hô.', 6500000, 5200000, N'TP. Hồ Chí Minh', N'Côn Đảo', N'3 ngày 2 đêm', 15, '2023-10-05', '2023-10-07'),
(4, N'Tour Đà Lạt - Thành phố ngàn hoa', N'Nghỉ dưỡng tại thành phố ngàn hoa Đà Lạt với khí hậu mát mẻ. Tham quan vườn hoa, thác Datanla, hồ Tuyền Lâm, và thưởng thức đặc sản địa phương.', 3200000, 2500000, N'TP. Hồ Chí Minh', N'Đà Lạt', N'3 ngày 2 đêm', 30, '2023-07-25', '2023-07-27'),
(5, N'Tour Trekking Fansipan', N'Chinh phục đỉnh Fansipan - nóc nhà Đông Dương với hành trình trekking đầy thử thách. Khám phá vẻ đẹp của núi rừng Tây Bắc và trải nghiệm văn hóa dân tộc vùng cao.', 5500000, 0, N'Hà Nội', N'Sapa', N'4 ngày 3 đêm', 15, '2023-09-20', '2023-09-23');

-- Thêm dữ liệu mẫu cho bảng DichVuPhuTro
INSERT INTO DichVuPhuTro (ten_dich_vu, mo_ta, gia, loai_dich_vu) VALUES
(N'Vé máy bay khứ hồi', N'Vé máy bay khứ hồi hạng phổ thông', 3000000, N'vé máy bay'),
(N'Phòng khách sạn 4 sao', N'Phòng khách sạn 4 sao (2 người/phòng)', 1500000, N'khách sạn'),
(N'Phòng khách sạn 5 sao', N'Phòng khách sạn 5 sao (2 người/phòng)', 2500000, N'khách sạn'),
(N'Đưa đón sân bay', N'Dịch vụ đưa đón sân bay bằng xe riêng', 500000, N'đưa đón'),
(N'Bữa tối hải sản', N'Bữa tối hải sản đặc biệt', 800000, N'ẩm thực'),
(N'Tour chụp ảnh', N'Dịch vụ chụp ảnh chuyên nghiệp trong tour', 1200000, N'giải trí'),
(N'Vé tham quan thêm', N'Vé tham quan các điểm đến không có trong lịch trình', 600000, N'tham quan'),
(N'Spa và massage', N'Dịch vụ spa và massage thư giãn', 900000, N'nghỉ dưỡng'),
(N'Thuê xe máy', N'Thuê xe máy tự do khám phá (1 ngày)', 200000, N'phương tiện'),
(N'Hướng dẫn viên riêng', N'Dịch vụ hướng dẫn viên riêng (1 ngày)', 1000000, N'hướng dẫn');

-- Thêm dữ liệu mẫu cho bảng KhachHang
-- Thêm dữ liệu mẫu cho bảng KhachHang (không mã hóa mật khẩu)
INSERT INTO KhachHang (ho_ten, email, mat_khau, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh) VALUES
(N'Nguyễn Văn A', N'nguyenvana@example.com', N'Laithanhdat123@', N'0901234567', N'Quận 1, TP. Hồ Chí Minh', '1990-01-15', N'Nam'),
(N'Trần Thị B', N'tranthib@example.com', N'password123', N'0912345678', N'Quận Cầu Giấy, Hà Nội', '1992-05-20', N'Nữ'),
(N'Lê Văn C', N'levanc@example.com', N'password123', N'0923456789', N'Quận Hải Châu, Đà Nẵng', '1985-11-10', N'Nam'),
(N'Phạm Thị D', N'phamthid@example.com', N'password123', N'0934567890', N'Quận 7, TP. Hồ Chí Minh', '1995-08-25', N'Nữ'),
(N'Hoàng Văn E', N'hoangvane@example.com', N'password123', N'0945678901', N'Quận Ba Đình, Hà Nội', '1988-03-30', N'Nam');
-- Thêm dữ liệu mẫu cho bảng DonDatTour
INSERT INTO DonDatTour (id_khach_hang, id_tour, ngay_dat, so_nguoi_lon, so_tre_em, tong_tien, trang_thai, ghi_chu) VALUES
(1, 1, '2023-06-10', 2, 1, 9800000, N'đã thanh toán', N'Cần hỗ trợ đưa đón tại sân bay'),
(2, 4, '2023-06-15', 2, 0, 17000000, N'đã xác nhận', N'Yêu cầu phòng view biển'),
(3, 6, '2023-06-20', 1, 0, 4500000, N'đã thanh toán', N'Không có yêu cầu đặc biệt'),
(4, 8, '2023-06-25', 2, 2, 11400000, N'chờ xác nhận', N'Cần giường phụ cho trẻ em'),
(5, 2, '2023-06-30', 3, 1, 16100000, N'đã xác nhận', N'Yêu cầu hướng dẫn viên nói tiếng Anh');

-- Thêm dữ liệu mẫu cho bảng ChiTietDonDatTour
INSERT INTO ChiTietDonDatTour (id_don_dat_tour, id_dich_vu_phu_tro, so_luong, gia, thanh_tien) VALUES
(1, 4, 1, 500000, 500000),
(1, 5, 2, 800000, 1600000),
(2, 3, 1, 2500000, 2500000),
(2, 8, 2, 900000, 1800000),
(3, 9, 1, 200000, 200000),
(4, 4, 1, 500000, 500000),
(4, 6, 1, 1200000, 1200000),
(5, 10, 1, 1000000, 1000000);

-- Thêm dữ liệu mẫu cho bảng HinhAnhTour
INSERT INTO HinhAnhTour (id_tour, duong_dan, mo_ta, la_anh_chinh) VALUES
(1, N'/static/images/tours/da-nang-1.jpg', N'Cầu Vàng - Bà Nà Hills', 1),
(1, N'/static/images/tours/da-nang-2.jpg', N'Phố cổ Hội An', 0),
(1, N'/static/images/tours/da-nang-3.jpg', N'Bãi biển Mỹ Khê', 0),
(2, N'/static/images/tours/ha-long-1.jpg', N'Vịnh Hạ Long', 1),
(2, N'/static/images/tours/ha-long-2.jpg', N'Tràng An - Ninh Bình', 0),
(3, N'/static/images/tours/phu-quoc-1.jpg', N'Bãi Sao - Phú Quốc', 1),
(3, N'/static/images/tours/phu-quoc-2.jpg', N'Vinpearl Safari', 0),
(4, N'/static/images/tours/thai-lan-1.jpg', N'Chùa Wat Arun - Bangkok', 1),
(4, N'/static/images/tours/thai-lan-2.jpg', N'Pattaya Beach', 0),
(5, N'/static/images/tours/nhat-ban-1.jpg', N'Núi Phú Sĩ', 1),
(5, N'/static/images/tours/nhat-ban-2.jpg', N'Đền Kiyomizu-dera - Kyoto', 0),
(6, N'/static/images/tours/nha-trang-1.jpg', N'Bãi biển Nha Trang', 1),
(6, N'/static/images/tours/nha-trang-2.jpg', N'Vinpearl Land', 0),
(7, N'/static/images/tours/con-dao-1.jpg', N'Bãi biển Côn Đảo', 1),
(7, N'/static/images/tours/con-dao-2.jpg', N'Nhà tù Côn Đảo', 0),
(8, N'/static/images/tours/da-lat-1.jpg', N'Thành phố Đà Lạt', 1),
(8, N'/static/images/tours/da-lat-2.jpg', N'Hồ Tuyền Lâm', 0),
(9, N'/static/images/tours/fansipan-1.jpg', N'Đỉnh Fansipan', 1),
(9, N'/static/images/tours/fansipan-2.jpg', N'Trekking Fansipan', 0);

-- Thêm dữ liệu mẫu cho bảng DanhGiaTour
INSERT INTO DanhGiaTour (id_khach_hang, id_tour, diem_danh_gia, noi_dung, ngay_danh_gia) VALUES
(1, 1, 5, N'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý, khách sạn sạch sẽ và thoải mái. Tôi sẽ quay lại vào lần sau.', '2023-06-20'),
(2, 4, 4, N'Tour Thái Lan rất thú vị, được trải nghiệm văn hóa và ẩm thực địa phương. Tuy nhiên, thời gian tự do hơi ít.', '2023-06-25'),
(3, 6, 5, N'Nha Trang thật đẹp! Vinpearl Land có nhiều trò chơi thú vị, bãi biển sạch và đẹp. Hải sản tươi ngon và giá cả hợp lý.', '2023-06-30'),
(4, 8, 4, N'Đà Lạt rất lãng mạn và mát mẻ. Các điểm tham quan đều rất đẹp. Chỉ tiếc là thời tiết hơi mưa trong chuyến đi của chúng tôi.', '2023-07-05'),
(5, 2, 5, N'Vịnh Hạ Long quá đẹp! Tràng An cũng rất ấn tượng. Hướng dẫn viên rất chuyên nghiệp và am hiểu lịch sử. Sẽ giới thiệu cho bạn bè.', '2023-07-10');

-- Cập nhật cột la_bao_gom cho dữ liệu hiện có
UPDATE DichVuBaoGom SET la_bao_gom = 1 WHERE loai_dich_vu = 'bao_gom';
UPDATE DichVuBaoGom SET la_bao_gom = 0 WHERE loai_dich_vu = 'khong_bao_gom';

-- =====================================================
-- TOUR 1: ĐÀ NẴNG - HỘI AN - BÀ NÀ HILLS
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Đà Nẵng - Hội An - Bà Nà Hills)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(1, 1, N'Ngày 1: Hà Nội - Đà Nẵng', 
 N'Khởi hành từ Hà Nội, bay đến Đà Nẵng. Tham quan Bãi biển Mỹ Khê, thưởng thức hải sản tươi ngon.',
 N'Đà Nẵng', 
 N'["Bay từ Hà Nội", "Tham quan Bãi biển Mỹ Khê", "Thưởng thức hải sản", "Nghỉ ngơi tại khách sạn"]',
 N'{"sang": false, "trua": true, "toi": true}',
 N'Khách sạn 4 sao trung tâm Đà Nẵng',
 N'Máy bay, xe du lịch',
 N'Tập trung tại sân bay Nội Bài lúc 6:00',
 1),

(1, 2, N'Ngày 2: Đà Nẵng - Bà Nà Hills', 
 N'Tham quan Bà Nà Hills, trải nghiệm Cầu Vàng nổi tiếng, vui chơi tại Fantasy Park.',
 N'Bà Nà Hills', 
 N'["Đi cáp treo lên Bà Nà Hills", "Tham quan Cầu Vàng", "Vui chơi tại Fantasy Park", "Thưởng thức buffet trưa"]',
 N'{"sang": true, "trua": true, "toi": true}',
 N'Khách sạn 4 sao trung tâm Đà Nẵng',
 N'Xe du lịch, cáp treo',
 N'Mang theo áo ấm vì thời tiết mát mẻ trên núi',
 2),

(1, 3, N'Ngày 3: Đà Nẵng - Hội An', 
 N'Tham quan phố cổ Hội An, thả đèn lồng trên sông Hoài, mua sắm đặc sản.',
 N'Hội An', 
 N'["Tham quan phố cổ Hội An", "Chùa Cầu Nhật Bản", "Thả đèn lồng", "Mua sắm đặc sản"]',
 N'{"sang": true, "trua": true, "toi": true}',
 N'Khách sạn 4 sao trung tâm Đà Nẵng',
 N'Xe du lịch',
 N'Mang theo máy ảnh để chụp ảnh đẹp',
 3),

(1, 4, N'Ngày 4: Đà Nẵng - Hà Nội', 
 N'Tự do mua sắm tại chợ Hàn, bay về Hà Nội.',
 N'Đà Nẵng - Hà Nội', 
 N'["Mua sắm tại chợ Hàn", "Ra sân bay", "Bay về Hà Nội"]',
 N'{"sang": true, "trua": false, "toi": false}',
 N'',
 N'Máy bay, xe du lịch',
 N'Check-out khách sạn trước 12:00',
 4);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Đà Nẵng)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Đà Nẵng
(1, N'bao_gom', N'Vé máy bay khứ hồi', N'Vé máy bay hạng phổ thông Hà Nội - Đà Nẵng - Hà Nội', N'fas fa-plane', 1, 1),
(1, N'bao_gom', N'Khách sạn 4 sao', N'3 đêm tại khách sạn 4 sao (2 người/phòng)', N'fas fa-bed', 2, 1),
(1, N'bao_gom', N'Ăn uống theo chương trình', N'Bữa sáng buffet, các bữa chính theo lịch trình', N'fas fa-utensils', 3, 1),
(1, N'bao_gom', N'Xe du lịch đời mới', N'Xe du lịch điều hòa đời mới, thoải mái', N'fas fa-bus', 4, 1),
(1, N'bao_gom', N'Hướng dẫn viên chuyên nghiệp', N'HDV am hiểu địa phương, nhiệt tình', N'fas fa-user-tie', 5, 1),
(1, N'bao_gom', N'Vé tham quan', N'Vé vào cửa các điểm tham quan theo chương trình', N'fas fa-ticket-alt', 6, 1),
(1, N'bao_gom', N'Bảo hiểm du lịch', N'Bảo hiểm du lịch 50 triệu/người', N'fas fa-shield-alt', 7, 1),

-- Dịch vụ không bao gồm
(1, N'khong_bao_gom', N'Chi phí cá nhân', N'Giặt ủi, điện thoại, đồ uống có cồn', N'fas fa-wallet', 1, 0),
(1, N'khong_bao_gom', N'Tip cho HDV và tài xế', N'Tip tự nguyện cho hướng dẫn viên và tài xế', N'fas fa-hand-holding-usd', 2, 0),
(1, N'khong_bao_gom', N'Phụ thu phòng đơn', N'Phụ thu 800.000đ cho khách ở phòng đơn', N'fas fa-bed', 3, 0),
(1, N'khong_bao_gom', N'Các bữa ăn ngoài chương trình', N'Bữa ăn tự túc ngoài lịch trình', N'fas fa-utensils', 4, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Đà Nẵng)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng
(1, N'quan_trong', N'Giấy tờ tùy thân', N'Quý khách vui lòng mang theo CMND/CCCD hoặc Hộ chiếu còn hạn sử dụng', N'fas fa-id-card', N'danger', 1),
(1, N'quan_trong', N'Thời gian tập trung', N'Tập trung đúng giờ theo lịch trình, tránh ảnh hưởng đến chương trình chung', N'fas fa-clock', N'danger', 2),
(1, N'quan_trong', N'Sức khỏe', N'Tour không phù hợp với trẻ em dưới 2 tuổi và người có bệnh tim mạch', N'fas fa-heartbeat', N'danger', 3),

-- Lưu ý khuyến khích
(1, N'khuyen_khich', N'Trang phục', N'Nên mang theo áo ấm, giày thể thao thoải mái và mũ che nắng', N'fas fa-tshirt', N'info', 1),
(1, N'khuyen_khich', N'Đồ dùng cá nhân', N'Kem chống nắng, thuốc cá nhân, máy ảnh', N'fas fa-suitcase', N'info', 2),
(1, N'khuyen_khich', N'Tiền mặt', N'Chuẩn bị tiền mặt cho việc mua sắm và chi tiêu cá nhân', N'fas fa-money-bill-wave', N'info', 3),

-- Cam kết
(1, N'cam_oan', N'Chất lượng dịch vụ', N'Cam kết cung cấp dịch vụ đúng như chương trình đã công bố', N'fas fa-check-circle', N'success', 1),
(1, N'cam_oan', N'Hoàn tiền', N'Hoàn 100% tiền nếu hủy tour trước 7 ngày khởi hành', N'fas fa-undo', N'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Đà Nẵng)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(1, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 800000, 'nguoi_lon', 1),
(1, 'Phụ thu cuối tuần', 'Áp dụng cho các tour khởi hành vào cuối tuần', 300000, 'tat_ca', 2),
(1, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 500000, 'tat_ca', 3);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Đà Nẵng)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(1, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, bảo hiểm y tế, thẻ ATM', 'fas fa-id-card', 1),
(1, 'chuan_bi', 'Trang phục', 'Quần áo thoải mái, giày thể thao, mũ, kính râm', 'fas fa-tshirt', 2),
(1, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, máy ảnh', 'fas fa-suitcase', 3),
(1, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 7 ngày: hoàn 80% tổng tiền\nHủy trước 3-6 ngày: hoàn 50% tổng tiền\nHủy trước 1-2 ngày: hoàn 30% tổng tiền\nHủy trong ngày: không hoàn tiền', 'fas fa-ban', 1),
(1, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: miễn phí\nTrẻ em từ 2-11 tuổi: 80% giá người lớn\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 2),
(1, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nEmail: support@travelvn.com', 'fas fa-phone', 1),
(1, 'khac', 'Thời tiết', 'Đà Nẵng có khí hậu nhiệt đới gió mùa, nên mang theo áo mưa', 'fas fa-cloud-rain', 2);

-- Cập nhật thông tin bổ sung cho tour Đà Nẵng
UPDATE Tour SET 
    diem_noi_bat = N'["Cầu Vàng Bà Nà Hills", "Phố cổ Hội An", "Bãi biển Mỹ Khê", "Ẩm thực Đà Nẵng"]',
    yeu_cau_suc_khoe = N'Sức khỏe tốt, có thể đi bộ nhiều',
    do_tuoi_phu_hop = N'Từ 6 tuổi trở lên',
    kich_thuoc_nhom = N'15-30 người',
    ngon_ngu_huong_dan = N'Tiếng Việt'
WHERE id = 1;

-- =====================================================
-- TOUR 2: HÀ NỘI - HẠ LONG - NINH BÌNH
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Hạ Long)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(2, 1, 'Ngày 1: TP.HCM - Hà Nội', 
 'Bay từ TP.HCM đến Hà Nội, tham quan Văn Miếu, Hồ Hoàn Kiếm',
 'Hà Nội', 
 '["Bay từ TP.HCM", "Tham quan Văn Miếu", "Dạo quanh Hồ Hoàn Kiếm", "Thưởng thức phở Hà Nội"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Khách sạn 4 sao trung tâm Hà Nội',
 'Máy bay, xe du lịch',
 'Tập trung tại sân bay Tân Sơn Nhất lúc 5:30',
 1),

(2, 2, 'Ngày 2: Hà Nội - Hạ Long', 
 'Khởi hành đi Hạ Long, du ngoạn vịnh Hạ Long bằng du thuyền',
 'Vịnh Hạ Long', 
 '["Khởi hành đi Hạ Long", "Lên du thuyền", "Tham quan hang Sửng Sốt", "Ngắm hoàng hôn trên vịnh"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Nghỉ đêm trên du thuyền',
 'Xe du lịch, du thuyền',
 'Mang theo áo ấm cho buổi tối trên du thuyền',
 2),

(2, 3, 'Ngày 3: Hạ Long - Ninh Bình', 
 'Tham quan Tràng An, Tam Cốc, chùa Bái Đính',
 'Ninh Bình', 
 '["Rời du thuyền", "Đi Ninh Bình", "Tham quan Tràng An", "Chùa Bái Đính"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 3 sao Ninh Bình',
 'Du thuyền, xe du lịch, thuyền kayak',
 'Chuẩn bị áo mưa cho chuyến thuyền',
 3),

(2, 4, 'Ngày 4: Ninh Bình - Hà Nội', 
 'Tham quan Tam Cốc, hang Múa, quay về Hà Nội',
 'Ninh Bình - Hà Nội', 
 '["Tham quan Tam Cốc", "Leo núi hang Múa", "Quay về Hà Nội", "Mua sắm tại phố cổ"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 4 sao Hà Nội',
 'Xe du lịch, thuyền',
 'Chuẩn bị giày đi bộ tốt để leo núi',
 4),

(2, 5, 'Ngày 5: Hà Nội - TP.HCM', 
 'Tham quan Lăng Bác, mua đặc sản, bay về TP.HCM',
 'Hà Nội - TP.HCM', 
 '["Tham quan Lăng Bác", "Mua đặc sản Hà Nội", "Ra sân bay", "Bay về TP.HCM"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Xe du lịch, máy bay',
 'Check-out khách sạn trước 12:00',
 5);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Hạ Long)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Hạ Long
(2, 'bao_gom', 'Vé máy bay khứ hồi', 'Vé máy bay TP.HCM - Hà Nội - TP.HCM', 'fas fa-plane', 1, 1),
(2, 'bao_gom', 'Khách sạn 4 sao', '3 đêm khách sạn (2 người/phòng)', 'fas fa-bed', 2, 1),
(2, 'bao_gom', 'Du thuyền Hạ Long', '1 đêm trên du thuyền 3 sao', 'fas fa-ship', 3, 1),
(2, 'bao_gom', 'Ăn uống theo chương trình', 'Các bữa ăn theo lịch trình', 'fas fa-utensils', 4, 1),
(2, 'bao_gom', 'Xe du lịch', 'Xe du lịch điều hòa đời mới', 'fas fa-bus', 5, 1),
(2, 'bao_gom', 'Hướng dẫn viên', 'HDV chuyên nghiệp suốt tuyến', 'fas fa-user-tie', 6, 1),
(2, 'bao_gom', 'Vé tham quan', 'Vé các điểm tham quan theo chương trình', 'fas fa-ticket-alt', 7, 1),

-- Dịch vụ không bao gồm
(2, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, mua sắm', 'fas fa-wallet', 1, 0),
(2, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip tự nguyện 100.000đ/khách/ngày', 'fas fa-hand-holding-usd', 2, 0),
(2, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 1.000.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(2, 'khong_bao_gom', 'Đồ uống có cồn', 'Bia, rượu và các đồ uống có cồn', 'fas fa-wine-glass', 4, 0),
(2, 'khong_bao_gom', 'Hoạt động ngoài chương trình', 'Chèo kayak, lặn biển, câu mực đêm', 'fas fa-swimmer', 5, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Hạ Long)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Hạ Long
(2, 'quan_trong', 'Giấy tờ tùy thân', 'Mang theo CMND/CCCD còn hạn', 'fas fa-id-card', 'danger', 1),
(2, 'quan_trong', 'Thời tiết', 'Tour có thể thay đổi do thời tiết xấu', 'fas fa-cloud-rain', 'danger', 2),
(2, 'quan_trong', 'An toàn trên du thuyền', 'Tuân thủ quy định an toàn khi trên du thuyền', 'fas fa-life-ring', 'danger', 3),

-- Lưu ý khuyến khích
(2, 'khuyen_khich', 'Trang phục', 'Mang áo ấm, giày chống trượt', 'fas fa-tshirt', 'info', 1),
(2, 'khuyen_khich', 'Thuốc say sóng', 'Chuẩn bị thuốc say sóng nếu cần', 'fas fa-pills', 'info', 2),
(2, 'khuyen_khich', 'Máy ảnh chống nước', 'Bảo vệ máy ảnh khỏi nước biển', 'fas fa-camera', 'info', 3),

-- Cam kết
(2, 'cam_oan', 'Chất lượng du thuyền', 'Cam kết du thuyền đạt chuẩn an toàn', 'fas fa-check-circle', 'success', 1),
(2, 'cam_oan', 'Hoàn tiền do thời tiết', 'Hoàn tiền nếu hủy do thời tiết xấu', 'fas fa-undo', 'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Hạ Long)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(2, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 1000000, 'nguoi_lon', 1),
(2, 'Phụ thu cabin riêng trên du thuyền', 'Áp dụng cho khách muốn ở cabin riêng', 1200000, 'nguoi_lon', 2),
(2, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 600000, 'tat_ca', 3),
(2, 'Phụ thu chèo kayak', 'Hoạt động chèo kayak tại vịnh Hạ Long', 150000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Hạ Long)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(2, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, bảo hiểm y tế', 'fas fa-id-card', 1),
(2, 'chuan_bi', 'Trang phục', 'Áo ấm, giày chống trượt cho du thuyền', 'fas fa-tshirt', 2),
(2, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, thuốc say sóng', 'fas fa-first-aid', 3),
(2, 'quy_dinh', 'Quy định an toàn', 'Tuân thủ hướng dẫn của thuyền trưởng khi trên du thuyền', 'fas fa-life-ring', 1),
(2, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 10 ngày: hoàn 90% tổng tiền\nHủy trước 5-9 ngày: hoàn 60% tổng tiền\nHủy trước 1-4 ngày: hoàn 30% tổng tiền\nHủy trong ngày: không hoàn tiền', 'fas fa-ban', 2),
(2, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 5 tuổi: không khuyến khích tham gia\nTrẻ em từ 5-11 tuổi: 75% giá người lớn\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 3),
(2, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234', 'fas fa-phone', 1),
(2, 'khac', 'Thời tiết Hạ Long', 'Mùa đẹp nhất: tháng 9-11 và tháng 3-5\nMùa mưa: tháng 6-8\nMùa lạnh: tháng 12-2', 'fas fa-cloud-sun-rain', 2);

-- Cập nhật thông tin bổ sung cho tour Hạ Long
UPDATE Tour SET 
    diem_noi_bat = '["Vịnh Hạ Long", "Tràng An Ninh Bình", "Hang Sửng Sốt", "Du thuyền qua đêm"]',
    yeu_cau_suc_khoe = 'Sức khỏe tốt, không say sóng',
    do_tuoi_phu_hop = 'Từ 8 tuổi trở lên',
    kich_thuoc_nhom = '20-25 người',
    ngon_ngu_huong_dan = 'Tiếng Việt, Tiếng Anh'
WHERE id = 2;

-- =====================================================
-- TOUR 3: PHÚ QUỐC
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Phú Quốc)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(3, 1, 'Ngày 1: TP.HCM - Phú Quốc', 
 'Bay đến Phú Quốc, nhận phòng resort, tự do tắm biển',
 'Phú Quốc', 
 '["Bay đến Phú Quốc", "Nhận phòng resort", "Tắm biển Bãi Sao", "Thưởng thức hải sản"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Resort 5 sao view biển',
 'Máy bay, xe đưa đón',
 'Check-in resort từ 14:00',
 1),

(3, 2, 'Ngày 2: Khám phá Phú Quốc', 
 'Tham quan Vinpearl Safari, cáp treo Hòn Thơm',
 'Phú Quốc', 
 '["Vinpearl Safari", "Cáp treo Hòn Thơm", "Tắm biển Bãi Khem", "Chợ đêm Phú Quốc"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Resort 5 sao view biển',
 'Xe du lịch, cáp treo',
 'Mang theo đồ bơi và kem chống nắng',
 2),

(3, 3, 'Ngày 3: Phú Quốc - TP.HCM', 
 'Tự do nghỉ dưỡng, mua sắm, bay về TP.HCM',
 'Phú Quốc - TP.HCM', 
 '["Nghỉ dưỡng tại resort", "Mua sắm đặc sản", "Ra sân bay", "Bay về TP.HCM"]',
 '{"sang": true, "trua": false, "toi": false}',
 '',
 'Máy bay, xe đưa đón',
 'Check-out trước 12:00',
 3);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Phú Quốc)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Phú Quốc
(3, 'bao_gom', 'Vé máy bay khứ hồi', 'Vé máy bay TP.HCM - Phú Quốc - TP.HCM', 'fas fa-plane', 1, 1),
(3, 'bao_gom', 'Resort 5 sao', '2 đêm tại resort 5 sao view biển', 'fas fa-hotel', 2, 1),
(3, 'bao_gom', 'Ăn uống theo chương trình', 'Bữa sáng buffet, các bữa chính theo lịch trình', 'fas fa-utensils', 3, 1),
(3, 'bao_gom', 'Xe đưa đón', 'Xe đưa đón sân bay và tham quan đảo', 'fas fa-shuttle-van', 4, 1),
(3, 'bao_gom', 'Vé tham quan', 'Vé Vinpearl Safari, cáp treo Hòn Thơm', 'fas fa-ticket-alt', 5, 1),
(3, 'bao_gom', 'Hướng dẫn viên', 'HDV chuyên nghiệp suốt tuyến', 'fas fa-user-tie', 6, 1),
(3, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch 50 triệu/người', 'fas fa-shield-alt', 7, 1),
(3, 'bao_gom', 'Nước uống', 'Nước suối 2 chai/người/ngày', 'fas fa-tint', 8, 1),

-- Dịch vụ không bao gồm
(3, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(3, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip tự nguyện', 'fas fa-hand-holding-usd', 2, 0),
(3, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 1.200.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(3, 'khong_bao_gom', 'Thuế VAT', 'Thuế VAT 10%', 'fas fa-receipt', 4, 0),
(3, 'khong_bao_gom', 'Hoạt động ngoài chương trình', 'Lặn biển, câu cá, massage', 'fas fa-swimmer', 5, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Phú Quốc)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Phú Quốc
(3, 'quan_trong', 'Giấy tờ tùy thân', 'Mang theo CMND/CCCD để làm thủ tục bay và check-in resort', 'fas fa-id-card', 'danger', 1),
(3, 'quan_trong', 'Thời tiết', 'Mùa mưa (tháng 6-10) có thể ảnh hưởng đến lịch trình', 'fas fa-cloud-rain', 'danger', 2),
(3, 'quan_trong', 'Bảo vệ môi trường', 'Không xả rác, không hái san hô, bảo vệ môi trường biển', 'fas fa-leaf', 'danger', 3),

-- Lưu ý khuyến khích
(3, 'khuyen_khich', 'Trang phục', 'Mang đồ bơi, quần áo thoáng mát, mũ, kính râm', 'fas fa-tshirt', 'info', 1),
(3, 'khuyen_khich', 'Kem chống nắng', 'Sử dụng kem chống nắng chỉ số SPF 50+ khi ra biển', 'fas fa-sun', 'info', 2),
(3, 'khuyen_khich', 'Đặc sản nên mua', 'Nước mắm, hồ tiêu, rượu sim, ngọc trai', 'fas fa-shopping-bag', 'info', 3),

-- Cam kết
(3, 'cam_oan', 'Chất lượng resort', 'Cam kết resort đúng tiêu chuẩn 5 sao quốc tế', 'fas fa-star', 'success', 1),
(3, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Phú Quốc)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(3, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 1200000, 'nguoi_lon', 1),
(3, 'Phụ thu view biển', 'Phụ thu cho phòng view biển', 500000, 'tat_ca', 2),
(3, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 800000, 'tat_ca', 3),
(3, 'Phụ thu cuối tuần', 'Áp dụng cho tour khởi hành thứ 6, thứ 7', 400000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Phú Quốc)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(3, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, vé máy bay, voucher khách sạn', 'fas fa-id-card', 1),
(3, 'chuan_bi', 'Trang phục', 'Đồ bơi, quần áo thoáng mát, dép xỏ ngón', 'fas fa-tshirt', 2),
(3, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, kính râm, mũ, thuốc chống say sóng', 'fas fa-shopping-basket', 3),
(3, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 7 ngày: hoàn 80% tổng tiền\nHủy trước 3-6 ngày: hoàn 50% tổng tiền\nHủy trước 1-2 ngày: hoàn 30% tổng tiền\nHủy trong ngày: không hoàn tiền', 'fas fa-ban', 1),
(3, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: miễn phí (không có chế độ ăn riêng)\nTrẻ em từ 2-5 tuổi: 50% giá người lớn\nTrẻ em từ 6-11 tuổi: 80% giá người lớn\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 2),
(3, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nEmail: support@travelvn.com', 'fas fa-phone', 1),
(3, 'khac', 'Thời tiết Phú Quốc', 'Mùa khô (tháng 11-5): thời tiết đẹp, lý tưởng để tham quan\nMùa mưa (tháng 6-10): mưa nhiều, biển động', 'fas fa-cloud-sun', 2);

-- Cập nhật thông tin bổ sung cho tour Phú Quốc
UPDATE Tour SET 
    diem_noi_bat = '["Bãi Sao", "Vinpearl Safari", "Cáp treo Hòn Thơm", "Hải sản tươi ngon"]',
    yeu_cau_suc_khoe = 'Sức khỏe bình thường',
    do_tuoi_phu_hop = 'Mọi lứa tuổi',
    kich_thuoc_nhom = '10-20 người',
    ngon_ngu_huong_dan = 'Tiếng Việt, Tiếng Anh'
WHERE id = 3;

-- =====================================================
-- TOUR 4: THÁI LAN - BANGKOK - PATTAYA
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Thái Lan)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(4, 1, 'Ngày 1: TP.HCM - Bangkok', 
 'Bay đến Bangkok, tham quan chùa Phật Vàng, chùa Wat Pho',
 'Bangkok', 
 '["Bay đến Bangkok", "Tham quan chùa Phật Vàng", "Chùa Wat Pho", "Ăn tối tại nhà hàng địa phương"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Khách sạn 4 sao trung tâm Bangkok',
 'Máy bay, xe du lịch',
 'Tập trung tại sân bay Tân Sơn Nhất lúc 7:00',
 1),

(4, 2, 'Ngày 2: Bangkok - Cung Điện Hoàng Gia', 
 'Tham quan Cung Điện Hoàng Gia, chùa Wat Arun, chợ nổi Damnoen Saduak',
 'Bangkok', 
 '["Tham quan Cung Điện Hoàng Gia", "Chùa Wat Arun", "Chợ nổi Damnoen Saduak", "Mua sắm tại Siam Paragon"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 4 sao trung tâm Bangkok',
 'Xe du lịch, thuyền',
 'Trang phục lịch sự khi vào Cung Điện Hoàng Gia',
 2),

(4, 3, 'Ngày 3: Bangkok - Pattaya', 
 'Di chuyển đến Pattaya, tham quan đảo San Hô, show Alcazar',
 'Pattaya', 
 '["Di chuyển đến Pattaya", "Tham quan đảo San Hô", "Tắm biển", "Xem show Alcazar"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 4 sao Pattaya',
 'Xe du lịch, tàu cao tốc',
 'Mang theo đồ bơi, kem chống nắng',
 3),

(4, 4, 'Ngày 4: Pattaya - Nong Nooch', 
 'Tham quan làng văn hóa Nong Nooch, núi Phật Vàng, massage Thái',
 'Pattaya', 
 '["Tham quan làng văn hóa Nong Nooch", "Núi Phật Vàng", "Massage Thái truyền thống", "Mua sắm tại Central Festival"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 4 sao Pattaya',
 'Xe du lịch',
 'Chuẩn bị tiền tip cho nhân viên massage',
 4),

(4, 5, 'Ngày 5: Pattaya - Bangkok - TP.HCM', 
 'Mua sắm tại Bangkok, bay về TP.HCM',
 'Bangkok - TP.HCM', 
 '["Trở về Bangkok", "Mua sắm tại Big C/King Power", "Ra sân bay", "Bay về TP.HCM"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Xe du lịch, máy bay',
 'Check-out khách sạn trước 12:00',
 5);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Thái Lan)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Thái Lan
(4, 'bao_gom', 'Vé máy bay khứ hồi', 'Vé máy bay TP.HCM - Bangkok - TP.HCM', 'fas fa-plane', 1, 1),
(4, 'bao_gom', 'Khách sạn 4 sao', '4 đêm tại khách sạn 4 sao (2 người/phòng)', 'fas fa-hotel', 2, 1),
(4, 'bao_gom', 'Ăn uống theo chương trình', 'Bữa sáng buffet, các bữa chính theo lịch trình', 'fas fa-utensils', 3, 1),
(4, 'bao_gom', 'Xe du lịch', 'Xe du lịch đời mới, máy lạnh', 'fas fa-bus', 4, 1),
(4, 'bao_gom', 'Vé tham quan', 'Vé vào cửa các điểm tham quan theo chương trình', 'fas fa-ticket-alt', 5, 1),
(4, 'bao_gom', 'Hướng dẫn viên', 'HDV Việt Nam và Thái Lan suốt tuyến', 'fas fa-user-tie', 6, 1),
(4, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch quốc tế', 'fas fa-shield-alt', 7, 1),
(4, 'bao_gom', 'Visa Thái Lan', 'Visa nhập cảnh Thái Lan', 'fas fa-passport', 8, 1),
(4, 'bao_gom', 'Show Alcazar', 'Vé xem show Alcazar tại Pattaya', 'fas fa-theater-masks', 9, 1),

-- Dịch vụ không bao gồm
(4, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(4, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip 100 Baht/khách/ngày', 'fas fa-hand-holding-usd', 2, 0),
(4, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 3.000.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(4, 'khong_bao_gom', 'Hành lý quá cước', 'Hành lý quá cước quy định của hãng hàng không', 'fas fa-suitcase', 4, 0),
(4, 'khong_bao_gom', 'Các show về đêm', 'Các show về đêm không có trong chương trình', 'fas fa-glass-cheers', 5, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Thái Lan)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Thái Lan
(4, 'quan_trong', 'Hộ chiếu', 'Hộ chiếu phải còn hạn ít nhất 6 tháng tính từ ngày khởi hành', 'fas fa-passport', 'danger', 1),
(4, 'quan_trong', 'Trang phục', 'Trang phục lịch sự khi vào các đền chùa, cung điện', 'fas fa-tshirt', 'danger', 2),
(4, 'quan_trong', 'Tiền tệ', 'Nên đổi tiền Baht trước khi đi hoặc tại sân bay', 'fas fa-money-bill-wave', 'danger', 3),

-- Lưu ý khuyến khích
(4, 'khuyen_khich', 'Mua sắm', 'Nên mua sắm tại các trung tâm thương mại lớn', 'fas fa-shopping-bag', 'info', 1),
(4, 'khuyen_khich', 'Ẩm thực', 'Nên thử Pad Thai, Tom Yum, Som Tam', 'fas fa-utensils', 'info', 2),
(4, 'khuyen_khich', 'Giao tiếp', 'Học một số từ tiếng Thái cơ bản: Sawadee (Xin chào), Khop Khun (Cảm ơn)', 'fas fa-comments', 'info', 3),

-- Cam kết
(4, 'cam_oan', 'Không phát sinh chi phí', 'Cam kết không phát sinh chi phí ngoài chương trình', 'fas fa-check-circle', 'success', 1),
(4, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Thái Lan)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(4, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 3000000, 'nguoi_lon', 1),
(4, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 1500000, 'tat_ca', 2),
(4, 'Phụ thu visa gấp', 'Áp dụng cho khách làm visa gấp trong 2 ngày', 500000, 'tat_ca', 3),
(4, 'Phụ thu hộ chiếu gấp', 'Áp dụng cho khách làm hộ chiếu gấp', 400000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Thái Lan)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(4, 'chuan_bi', 'Giấy tờ cần mang theo', 'Hộ chiếu (còn hạn ít nhất 6 tháng), vé máy bay, voucher khách sạn, 4 ảnh 4x6 nền trắng', 'fas fa-passport', 1),
(4, 'chuan_bi', 'Trang phục', 'Quần áo thoải mái, giày dép đi bộ, áo khoác nhẹ (máy lạnh trên xe và trong nhà hàng khá lạnh)', 'fas fa-tshirt', 2),
(4, 'chuan_bi', 'Tiền tệ', 'Nên đổi khoảng 5000-7000 Baht cho chi tiêu cá nhân (1 USD ≈ 30-32 Baht)', 'fas fa-money-bill-wave', 3),
(4, 'quy_dinh', 'Quy định hải quan Thái Lan', 'Không mang theo trái cây, thực phẩm tươi sống\nKhông mang quá 20.000 Baht tiền mặt khi nhập cảnh\nKhông mang thuốc lá quá 1 cây, rượu quá 1 lít', 'fas fa-clipboard-list', 1),
(4, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 15 ngày: phạt 30% tổng tiền\nHủy trước 10-14 ngày: phạt 50% tổng tiền\nHủy trước 5-9 ngày: phạt 70% tổng tiền\nHủy trước 0-4 ngày: phạt 100% tổng tiền', 'fas fa-ban', 2),
(4, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: 30% giá người lớn\nTrẻ em từ 2-11 tuổi: 75% giá người lớn (có giường riêng)\nTrẻ em từ 2-11 tuổi: 65% giá người lớn (ngủ chung với bố mẹ)\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 3),
(4, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nSố khẩn cấp tại Thái Lan: 191\nĐại sứ quán Việt Nam tại Thái Lan: +66-2-2515836', 'fas fa-phone', 1),
(4, 'khac', 'Thời tiết Thái Lan', 'Mùa khô (tháng 11-2): thời tiết mát mẻ, ít mưa\nMùa nóng (tháng 3-5): thời tiết nóng, ít mưa\nMùa mưa (tháng 6-10): mưa nhiều, độ ẩm cao', 'fas fa-cloud-sun-rain', 2);

-- Cập nhật thông tin bổ sung cho tour Thái Lan
UPDATE Tour SET 
    diem_noi_bat = '["Cung Điện Hoàng Gia", "Chùa Wat Arun", "Pattaya", "Show Alcazar"]',
    yeu_cau_suc_khoe = 'Sức khỏe bình thường',
    do_tuoi_phu_hop = 'Từ 5 tuổi trở lên',
    kich_thuoc_nhom = '20-30 người',
    ngon_ngu_huong_dan = 'Tiếng Việt, Tiếng Anh'
WHERE id = 4;

-- =====================================================
-- TOUR 5: NHẬT BẢN - TOKYO - OSAKA - KYOTO
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Nhật Bản)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(5, 1, 'Ngày 1: Hà Nội - Tokyo', 
 'Bay đến Tokyo, nhận phòng khách sạn, tự do khám phá khu Shinjuku',
 'Tokyo', 
 '["Bay đến Tokyo", "Nhận phòng khách sạn", "Tự do khám phá khu Shinjuku"]',
 '{"sang": false, "trua": false, "toi": true}',
 'Khách sạn 3 sao tại Tokyo',
 'Máy bay, xe du lịch',
 'Tập trung tại sân bay Nội Bài lúc 8:00',
 1),

(5, 2, 'Ngày 2: Tokyo - Núi Phú Sĩ', 
 'Tham quan núi Phú Sĩ, hồ Kawaguchi, làng cổ Oshino Hakkai',
 'Núi Phú Sĩ', 
 '["Tham quan núi Phú Sĩ", "Hồ Kawaguchi", "Làng cổ Oshino Hakkai", "Onsen - tắm suối nước nóng"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn kiểu Nhật tại khu vực Phú Sĩ',
 'Xe du lịch',
 'Mang theo đồ bơi cho onsen',
 2),

(5, 3, 'Ngày 3: Phú Sĩ - Tokyo', 
 'Tham quan đền Asakusa, Tokyo Skytree, khu mua sắm Ginza',
 'Tokyo', 
 '["Đền Asakusa", "Tokyo Skytree", "Khu mua sắm Ginza", "Akihabara"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 3 sao tại Tokyo',
 'Xe du lịch, tàu điện',
 'Chuẩn bị giày đi bộ thoải mái',
 3),

(5, 4, 'Ngày 4: Tokyo - Osaka', 
 'Di chuyển đến Osaka bằng tàu cao tốc Shinkansen, tham quan lâu đài Osaka',
 'Osaka', 
 '["Di chuyển đến Osaka bằng Shinkansen", "Lâu đài Osaka", "Khu Dotonbori", "Mua sắm tại Shinsaibashi"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 3 sao tại Osaka',
 'Tàu cao tốc Shinkansen, xe du lịch',
 'Chuẩn bị hành lý gọn nhẹ cho chuyến tàu',
 4),

(5, 5, 'Ngày 5: Osaka - Kyoto - Osaka', 
 'Tham quan cố đô Kyoto, đền Kiyomizu-dera, rừng tre Arashiyama',
 'Kyoto', 
 '["Đền Kiyomizu-dera", "Rừng tre Arashiyama", "Đền Vàng Kinkakuji", "Khu Gion"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 3 sao tại Osaka',
 'Xe du lịch, tàu điện',
 'Trang phục lịch sự khi vào đền',
 5),

(5, 6, 'Ngày 6: Osaka - Universal Studios', 
 'Tham quan công viên giải trí Universal Studios Japan',
 'Osaka', 
 '["Universal Studios Japan", "Khu Harry Potter", "Các trò chơi hấp dẫn", "Mua sắm quà lưu niệm"]',
 '{"sang": true, "trua": false, "toi": true}',
 'Khách sạn 3 sao tại Osaka',
 'Xe du lịch, tàu điện',
 'Chuẩn bị giày đi bộ thoải mái',
 6),

(5, 7, 'Ngày 7: Osaka - Hà Nội', 
 'Mua sắm tại Rinku Premium Outlets, bay về Hà Nội',
 'Osaka - Hà Nội', 
 '["Mua sắm tại Rinku Premium Outlets", "Ra sân bay", "Bay về Hà Nội"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Xe du lịch, máy bay',
 'Check-out khách sạn trước 10:00',
 7);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Nhật Bản)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Nhật Bản
(5, 'bao_gom', 'Vé máy bay khứ hồi', 'Vé máy bay Hà Nội - Tokyo/Osaka - Hà Nội', 'fas fa-plane', 1, 1),
(5, 'bao_gom', 'Khách sạn 3 sao', '6 đêm tại khách sạn 3 sao (2 người/phòng)', 'fas fa-hotel', 2, 1),
(5, 'bao_gom', 'Ăn uống theo chương trình', 'Bữa sáng buffet, các bữa chính theo lịch trình', 'fas fa-utensils', 3, 1),
(5, 'bao_gom', 'Xe du lịch', 'Xe du lịch đời mới, máy lạnh', 'fas fa-bus', 4, 1),
(5, 'bao_gom', 'Vé tham quan', 'Vé vào cửa các điểm tham quan theo chương trình', 'fas fa-ticket-alt', 5, 1),
(5, 'bao_gom', 'Vé tàu Shinkansen', 'Vé tàu cao tốc Shinkansen Tokyo - Osaka', 'fas fa-train', 6, 1),
(5, 'bao_gom', 'Vé Universal Studios', 'Vé vào cửa Universal Studios Japan', 'fas fa-film', 7, 1),
(5, 'bao_gom', 'Hướng dẫn viên', 'HDV Việt Nam và Nhật Bản suốt tuyến', 'fas fa-user-tie', 8, 1),
(5, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch quốc tế', 'fas fa-shield-alt', 9, 1),
(5, 'bao_gom', 'Visa Nhật Bản', 'Visa nhập cảnh Nhật Bản', 'fas fa-passport', 10, 1),

-- Dịch vụ không bao gồm
(5, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(5, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip 500-1000 Yên/khách/ngày', 'fas fa-hand-holding-usd', 2, 0),
(5, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 8.000.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(5, 'khong_bao_gom', 'Hành lý quá cước', 'Hành lý quá cước quy định của hãng hàng không', 'fas fa-suitcase', 4, 0),
(5, 'khong_bao_gom', 'Các bữa ăn tự túc', 'Các bữa ăn không có trong chương trình', 'fas fa-utensils', 5, 0),
(5, 'khong_bao_gom', 'Thuế VAT', 'Thuế VAT 10%', 'fas fa-receipt', 6, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Nhật Bản)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Nhật Bản
(5, 'quan_trong', 'Hộ chiếu', 'Hộ chiếu phải còn hạn ít nhất 6 tháng tính từ ngày khởi hành', 'fas fa-passport', 'danger', 1),
(5, 'quan_trong', 'Quy định hải quan', 'Không mang thực phẩm tươi sống, trái cây vào Nhật Bản', 'fas fa-clipboard-list', 'danger', 2),
(5, 'quan_trong', 'Tiền tệ', 'Nên đổi tiền Yên trước khi đi hoặc tại sân bay', 'fas fa-money-bill-wave', 'danger', 3),
(5, 'quan_trong', 'Thời tiết', 'Kiểm tra thời tiết trước khi đi để chuẩn bị trang phục phù hợp', 'fas fa-cloud-sun', 'danger', 4),

-- Lưu ý khuyến khích
(5, 'khuyen_khich', 'Văn hóa', 'Tìm hiểu về văn hóa, phong tục Nhật Bản trước khi đi', 'fas fa-book', 'info', 1),
(5, 'khuyen_khich', 'Giao tiếp', 'Học một số từ tiếng Nhật cơ bản: Konnichiwa (Xin chào), Arigatou (Cảm ơn)', 'fas fa-comments', 'info', 2),
(5, 'khuyen_khich', 'Ẩm thực', 'Nên thử sushi, ramen, takoyaki, okonomiyaki', 'fas fa-utensils', 'info', 3),
(5, 'khuyen_khich', 'Mua sắm', 'Nên mua sắm tại Don Quijote, Uniqlo, Daiso', 'fas fa-shopping-bag', 'info', 4),

-- Cam kết
(5, 'cam_oan', 'Không phát sinh chi phí', 'Cam kết không phát sinh chi phí ngoài chương trình', 'fas fa-check-circle', 'success', 1),
(5, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2),
(5, 'cam_oan', 'Chất lượng dịch vụ', 'Cam kết chất lượng dịch vụ đúng tiêu chuẩn', 'fas fa-star', 'success', 3);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Nhật Bản)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(5, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 8000000, 'nguoi_lon', 1),
(5, 'Phụ thu mùa cao điểm', 'Áp dụng cho tour khởi hành vào mùa hoa anh đào (tháng 3-4) và mùa lá đỏ (tháng 10-11)', 3000000, 'tat_ca', 2),
(5, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 5000000, 'tat_ca', 3),
(5, 'Phụ thu visa gấp', 'Áp dụng cho khách làm visa gấp trong 3 ngày', 1500000, 'tat_ca', 4),
(5, 'Phụ thu phòng view đẹp', 'Áp dụng cho phòng view núi Phú Sĩ', 1000000, 'tat_ca', 5);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Nhật Bản)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(5, 'chuan_bi', 'Giấy tờ cần mang theo', 'Hộ chiếu (còn hạn ít nhất 6 tháng), vé máy bay, voucher khách sạn, 2 ảnh 4.5x4.5cm nền trắng, giấy xác nhận công việc, sao kê tài khoản ngân hàng', 'fas fa-passport', 1),
(5, 'chuan_bi', 'Trang phục', 'Quần áo theo mùa, giày đi bộ thoải mái, áo khoác (Nhật Bản có nhiều khu vực máy lạnh rất mạnh)', 'fas fa-tshirt', 2),
(5, 'chuan_bi', 'Tiền tệ', 'Nên đổi khoảng 50,000-70,000 Yên cho chi tiêu cá nhân (1 USD ≈ 110-115 Yên)', 'fas fa-money-bill-wave', 3),
(5, 'chuan_bi', 'Đồ dùng cá nhân', 'Adapter chuyển đổi ổ cắm (Nhật Bản dùng ổ cắm kiểu A), sạc dự phòng, thuốc cá nhân, kem chống nắng', 'fas fa-plug', 4),
(5, 'quy_dinh', 'Quy định hải quan Nhật Bản', 'Không mang theo trái cây, thực phẩm tươi sống\nKhông mang quá 1,000,000 Yên tiền mặt khi nhập cảnh\nKhông mang thuốc lá quá 1 cây, rượu quá 3 chai', 'fas fa-clipboard-list', 1),
(5, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 30 ngày: phạt 10% tổng tiền\nHủy trước 15-29 ngày: phạt 30% tổng tiền\nHủy trước 7-14 ngày: phạt 50% tổng tiền\nHủy trước 0-6 ngày: phạt 100% tổng tiền', 'fas fa-ban', 2),
(5, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: 30% giá người lớn\nTrẻ em từ 2-11 tuổi: 80% giá người lớn (có giường riêng)\nTrẻ em từ 2-11 tuổi: 70% giá người lớn (ngủ chung với bố mẹ)\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 3),
(5, 'quy_dinh', 'Quy định onsen', 'Khi tắm onsen (suối nước nóng) phải cởi bỏ hoàn toàn quần áo\nKhông mang đồ ăn, thức uống vào khu vực onsen\nKhông chụp ảnh trong khu vực onsen\nKhông đeo trang sức khi tắm onsen', 'fas fa-hot-tub', 4),
(5, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nSố khẩn cấp tại Nhật Bản: 110 (cảnh sát), 119 (cứu hỏa, cấp cứu)\nĐại sứ quán Việt Nam tại Nhật Bản: +81-3-3466-3311', 'fas fa-phone', 1),
(5, 'khac', 'Thời tiết Nhật Bản', 'Mùa xuân (tháng 3-5): 10-20°C, hoa anh đào nở\nMùa hè (tháng 6-8): 25-35°C, nóng ẩm\nMùa thu (tháng 9-11): 15-25°C, lá đỏ đẹp\nMùa đông (tháng 12-2): 0-10°C, có tuyết ở một số khu vực', 'fas fa-cloud-sun-rain', 2),
(5, 'khac', 'Mạng internet', 'Có thể thuê bộ phát wifi tại sân bay hoặc mua sim du lịch Nhật Bản\nNhiều nơi công cộng có wifi miễn phí', 'fas fa-wifi', 3);

-- Cập nhật thông tin bổ sung cho tour Nhật Bản
UPDATE Tour SET 
    diem_noi_bat = '["Núi Phú Sĩ", "Tokyo Skytree", "Đền Kiyomizu-dera", "Universal Studios Japan"]',
    yeu_cau_suc_khoe = 'Sức khỏe tốt, có thể đi bộ nhiều',
    do_tuoi_phu_hop = 'Từ 8 tuổi trở lên',
    kich_thuoc_nhom = '15-20 người',
    ngon_ngu_huong_dan = 'Tiếng Việt, Tiếng Anh, Tiếng Nhật (phiên dịch)'
WHERE id = 5;

-- =====================================================
-- TOUR 6: NHA TRANG - VINPEARL LAND
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Nha Trang)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(6, 1, 'Ngày 1: TP.HCM - Nha Trang', 
 'Bay đến Nha Trang, nhận phòng khách sạn, tự do tắm biển',
 'Nha Trang', 
 '["Bay đến Nha Trang", "Nhận phòng khách sạn", "Tắm biển", "Ăn tối hải sản"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Khách sạn 4 sao view biển',
 'Máy bay, xe du lịch',
 'Tập trung tại sân bay Tân Sơn Nhất lúc 7:00',
 1),

(6, 2, 'Ngày 2: Nha Trang - Tour 4 đảo', 
 'Tham quan 4 đảo: Hòn Mun, Hòn Một, Hòn Tằm, Hòn Miễu',
 'Nha Trang', 
 '["Tour 4 đảo", "Lặn ngắm san hô tại Hòn Mun", "Tắm biển tại Hòn Một", "Ăn trưa trên tàu", "Thưởng thức nhạc sống trên tàu"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 4 sao view biển',
 'Tàu du lịch',
 'Mang theo đồ bơi, kem chống nắng',
 2),

(6, 3, 'Ngày 3: Nha Trang - Vinpearl Land', 
 'Tham quan và vui chơi tại Vinpearl Land',
 'Nha Trang', 
 '["Đi cáp treo ra Vinpearl Land", "Vui chơi tại công viên nước", "Tham quan thủy cung", "Các trò chơi cảm giác mạnh"]',
 '{"sang": true, "trua": false, "toi": true}',
 'Khách sạn 4 sao view biển',
 'Cáp treo, xe du lịch',
 'Mang theo đồ bơi, khăn tắm',
 3),

(6, 4, 'Ngày 4: Nha Trang - TP.HCM', 
 'Tham quan Tháp Bà Ponagar, Hòn Chồng, mua sắm đặc sản, bay về TP.HCM',
 'Nha Trang - TP.HCM', 
 '["Tham quan Tháp Bà Ponagar", "Hòn Chồng", "Mua sắm đặc sản", "Bay về TP.HCM"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Xe du lịch, máy bay',
 'Check-out khách sạn trước 12:00',
 4);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Nha Trang)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Nha Trang
(6, 'bao_gom', 'Vé máy bay khứ hồi', 'Vé máy bay TP.HCM - Nha Trang - TP.HCM', 'fas fa-plane', 1, 1),
(6, 'bao_gom', 'Khách sạn 4 sao', '3 đêm tại khách sạn 4 sao view biển (2 người/phòng)', 'fas fa-hotel', 2, 1),
(6, 'bao_gom', 'Ăn uống theo chương trình', 'Bữa sáng buffet, các bữa chính theo lịch trình', 'fas fa-utensils', 3, 1),
(6, 'bao_gom', 'Xe du lịch', 'Xe du lịch đời mới, máy lạnh', 'fas fa-bus', 4, 1),
(6, 'bao_gom', 'Tour 4 đảo', 'Tour tham quan 4 đảo bằng tàu du lịch', 'fas fa-ship', 5, 1),
(6, 'bao_gom', 'Vé Vinpearl Land', 'Vé vào cửa Vinpearl Land trọn gói', 'fas fa-ticket-alt', 6, 1),
(6, 'bao_gom', 'Vé cáp treo', 'Vé cáp treo 2 chiều ra đảo Vinpearl', 'fas fa-tram', 7, 1),
(6, 'bao_gom', 'Hướng dẫn viên', 'HDV nhiệt tình, kinh nghiệm suốt tuyến', 'fas fa-user-tie', 8, 1),
(6, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch 30 triệu/người', 'fas fa-shield-alt', 9, 1),
(6, 'bao_gom', 'Nước uống', 'Nước suối 2 chai/người/ngày', 'fas fa-tint', 10, 1),

-- Dịch vụ không bao gồm
(6, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(6, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip tự nguyện', 'fas fa-hand-holding-usd', 2, 0),
(6, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 1.500.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(6, 'khong_bao_gom', 'Thuế VAT', 'Thuế VAT 10%', 'fas fa-receipt', 4, 0),
(6, 'khong_bao_gom', 'Các bữa ăn tự túc', 'Bữa trưa ngày 3 tại Vinpearl Land', 'fas fa-utensils', 5, 0),
(6, 'khong_bao_gom', 'Dịch vụ lặn biển có bình khí', 'Dịch vụ lặn biển có bình khí tại Hòn Mun', 'fas fa-swimmer', 6, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Nha Trang)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Nha Trang
(6, 'quan_trong', 'Giấy tờ tùy thân', 'Mang theo CMND/CCCD để làm thủ tục bay và check-in khách sạn', 'fas fa-id-card', 'danger', 1),
(6, 'quan_trong', 'Thời tiết', 'Mùa mưa (tháng 10-12) có thể ảnh hưởng đến lịch trình', 'fas fa-cloud-rain', 'danger', 2),
(6, 'quan_trong', 'An toàn khi tắm biển', 'Tuân thủ quy định an toàn khi tắm biển, không tắm biển khi có sóng lớn', 'fas fa-water', 'danger', 3),

-- Lưu ý khuyến khích
(6, 'khuyen_khich', 'Trang phục', 'Mang đồ bơi, quần áo thoáng mát, mũ, kính râm', 'fas fa-tshirt', 'info', 1),
(6, 'khuyen_khich', 'Kem chống nắng', 'Sử dụng kem chống nắng chỉ số SPF 50+ khi ra biển', 'fas fa-sun', 'info', 2),
(6, 'khuyen_khich', 'Đặc sản nên mua', 'Yến sào, nem nướng, mực một nắng, hải sản khô', 'fas fa-shopping-bag', 'info', 3),

-- Cam kết
(6, 'cam_oan', 'Chất lượng khách sạn', 'Cam kết khách sạn đúng tiêu chuẩn 4 sao', 'fas fa-star', 'success', 1),
(6, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Nha Trang)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(6, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 1500000, 'nguoi_lon', 1),
(6, 'Phụ thu cuối tuần', 'Áp dụng cho tour khởi hành thứ 6, thứ 7', 300000, 'tat_ca', 2),
(6, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 800000, 'tat_ca', 3),
(6, 'Phụ thu phòng hướng biển', 'Áp dụng cho phòng view biển trực diện', 400000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Nha Trang)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(6, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, vé máy bay, voucher khách sạn', 'fas fa-id-card', 1),
(6, 'chuan_bi', 'Trang phục', 'Đồ bơi, quần áo thoáng mát, dép xỏ ngón, mũ, kính râm', 'fas fa-tshirt', 2),
(6, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, khăn tắm', 'fas fa-shopping-basket', 3),
(6, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 7 ngày: hoàn 80% tổng tiền\nHủy trước 3-6 ngày: hoàn 50% tổng tiền\nHủy trước 1-2 ngày: hoàn 30% tổng tiền\nHủy trong ngày: không hoàn tiền', 'fas fa-ban', 1),
(6, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: miễn phí (không có chế độ ăn riêng)\nTrẻ em từ 2-5 tuổi: 50% giá người lớn\nTrẻ em từ 6-11 tuổi: 80% giá người lớn\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 2),
(6, 'quy_dinh', 'Quy định tại Vinpearl Land', 'Không mang đồ ăn, thức uống vào Vinpearl Land\nTuân thủ quy định an toàn tại các trò chơi\nGiữ vé cẩn thận, mất vé phải mua lại', 'fas fa-clipboard-list', 3),
(6, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nSố khẩn cấp: 113 (cảnh sát), 115 (cấp cứu)\nHDV: 090 123 4567', 'fas fa-phone', 1),
(6, 'khac', 'Thời tiết Nha Trang', 'Mùa khô (tháng 1-8): thời tiết đẹp, ít mưa\nMùa mưa (tháng 9-12): mưa nhiều, đặc biệt tháng 10-11', 'fas fa-cloud-sun', 2),
(6, 'khac', 'Địa điểm mua sắm', 'Chợ Đầm: đặc sản, quà lưu niệm\nChợ Xóm Mới: hải sản tươi sống\nVincom Plaza: mua sắm hiện đại', 'fas fa-shopping-cart', 3);

-- Cập nhật thông tin bổ sung cho tour Nha Trang
UPDATE Tour SET 
    diem_noi_bat = '["Vinpearl Land", "Tour 4 đảo", "Tháp Bà Ponagar", "Hải sản tươi ngon"]',
    yeu_cau_suc_khoe = 'Sức khỏe bình thường, biết bơi là lợi thế',
    do_tuoi_phu_hop = 'Mọi lứa tuổi',
    kich_thuoc_nhom = '20-25 người',
    ngon_ngu_huong_dan = 'Tiếng Việt'
WHERE id = 6;

-- =====================================================
-- TOUR 7: CÔN ĐẢO
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Côn Đảo)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(7, 1, 'Ngày 1: TP.HCM - Côn Đảo', 
 'Bay đến Côn Đảo, tham quan di tích lịch sử',
 'Côn Đảo', 
 '["Bay đến Côn Đảo", "Nhận phòng resort", "Tham quan nhà tù Côn Đảo", "Chuồng Cọp Pháp", "Nghĩa trang Hàng Dương"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Resort 4 sao tại Côn Đảo',
 'Máy bay, xe du lịch',
 'Tập trung tại sân bay Tân Sơn Nhất lúc 6:00',
 1),

(7, 2, 'Ngày 2: Côn Đảo - Khám phá biển đảo', 
 'Tham quan các bãi biển đẹp, lặn ngắm san hô',
 'Côn Đảo', 
 '["Tham quan Bãi Đầm Trầu", "Bãi Nhát", "Lặn ngắm san hô", "Tắm biển", "Thưởng thức hải sản tươi sống"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Resort 4 sao tại Côn Đảo',
 'Xe du lịch, tàu du lịch',
 'Mang theo đồ bơi, kem chống nắng',
 2),

(7, 3, 'Ngày 3: Côn Đảo - TP.HCM', 
 'Viếng mộ Cô Sáu, mua sắm đặc sản, bay về TP.HCM',
 'Côn Đảo - TP.HCM', 
 '["Viếng mộ Cô Sáu", "Tham quan Bảo tàng Côn Đảo", "Mua sắm đặc sản", "Bay về TP.HCM"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Xe du lịch, máy bay',
 'Check-out resort trước 12:00',
 3);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Côn Đảo)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Côn Đảo
(7, 'bao_gom', 'Vé máy bay khứ hồi', 'Vé máy bay TP.HCM - Côn Đảo - TP.HCM', 'fas fa-plane', 1, 1),
(7, 'bao_gom', 'Resort 4 sao', '2 đêm tại resort 4 sao (2 người/phòng)', 'fas fa-hotel', 2, 1),
(7, 'bao_gom', 'Ăn uống theo chương trình', 'Bữa sáng buffet, các bữa chính theo lịch trình', 'fas fa-utensils', 3, 1),
(7, 'bao_gom', 'Xe du lịch', 'Xe du lịch đời mới, máy lạnh', 'fas fa-bus', 4, 1),
(7, 'bao_gom', 'Tàu tham quan', 'Tàu tham quan biển đảo, lặn ngắm san hô', 'fas fa-ship', 5, 1),
(7, 'bao_gom', 'Vé tham quan', 'Vé vào cửa các điểm tham quan theo chương trình', 'fas fa-ticket-alt', 6, 1),
(7, 'bao_gom', 'Hướng dẫn viên', 'HDV nhiệt tình, am hiểu lịch sử Côn Đảo', 'fas fa-user-tie', 7, 1),
(7, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch 30 triệu/người', 'fas fa-shield-alt', 8, 1),
(7, 'bao_gom', 'Nước uống', 'Nước suối 2 chai/người/ngày', 'fas fa-tint', 9, 1),
(7, 'bao_gom', 'Thiết bị lặn ngắm san hô', 'Kính lặn, ống thở, áo phao', 'fas fa-swimmer', 10, 1),

-- Dịch vụ không bao gồm
(7, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(7, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip tự nguyện', 'fas fa-hand-holding-usd', 2, 0),
(7, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 2.000.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(7, 'khong_bao_gom', 'Thuế VAT', 'Thuế VAT 10%', 'fas fa-receipt', 4, 0),
(7, 'khong_bao_gom', 'Dịch vụ lặn biển có bình khí', 'Dịch vụ lặn biển có bình khí', 'fas fa-swimmer', 5, 0),
(7, 'khong_bao_gom', 'Đồ uống có cồn', 'Bia, rượu và các đồ uống có cồn', 'fas fa-wine-glass', 6, 0);

-- =====================================================
-- TOUR 7: CÔN ĐẢO
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Côn Đảo) - tiếp tục
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
(7, 'khuyen_khich', 'Kem chống nắng', 'Sử dụng kem chống nắng chỉ số SPF 50+ khi ra biển', 'fas fa-sun', 'info', 2),
(7, 'khuyen_khich', 'Đồ dùng cá nhân', 'Mang theo thuốc chống say sóng, thuốc cá nhân', 'fas fa-first-aid', 'info', 3),

-- Cam kết
(7, 'cam_oan', 'Chất lượng resort', 'Cam kết resort đúng tiêu chuẩn 4 sao', 'fas fa-star', 'success', 1),
(7, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Côn Đảo)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(7, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 2000000, 'nguoi_lon', 1),
(7, 'Phụ thu cuối tuần', 'Áp dụng cho tour khởi hành thứ 6, thứ 7', 500000, 'tat_ca', 2),
(7, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 1000000, 'tat_ca', 3),
(7, 'Phụ thu phòng view biển', 'Áp dụng cho phòng view biển trực diện', 600000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Côn Đảo)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(7, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, vé máy bay, voucher khách sạn', 'fas fa-id-card', 1),
(7, 'chuan_bi', 'Trang phục', 'Đồ bơi, quần áo thoáng mát, dép xỏ ngón, trang phục lịch sự khi viếng mộ', 'fas fa-tshirt', 2),
(7, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, thuốc chống say sóng, máy ảnh', 'fas fa-shopping-basket', 3),
(7, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 7 ngày: hoàn 80% tổng tiền\nHủy trước 3-6 ngày: hoàn 50% tổng tiền\nHủy trước 1-2 ngày: hoàn 30% tổng tiền\nHủy trong ngày: không hoàn tiền', 'fas fa-ban', 1),
(7, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: miễn phí (không có chế độ ăn riêng)\nTrẻ em từ 2-5 tuổi: 50% giá người lớn\nTrẻ em từ 6-11 tuổi: 80% giá người lớn\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 2),
(7, 'quy_dinh', 'Quy định tại khu di tích', 'Không chụp ảnh trong một số khu vực\nGiữ im lặng khi tham quan nhà tù\nKhông mang theo đồ ăn, thức uống vào khu di tích', 'fas fa-landmark', 3),
(7, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nSố khẩn cấp: 113 (cảnh sát), 115 (cấp cứu)\nHDV: 090 123 4567', 'fas fa-phone', 1),
(7, 'khac', 'Thời tiết Côn Đảo', 'Mùa khô (tháng 3-9): thời tiết đẹp, ít mưa\nMùa mưa (tháng 10-2): mưa nhiều, biển động', 'fas fa-cloud-sun', 2),
(7, 'khac', 'Đặc sản nên mua', 'Hải sản khô, mực một nắng, nước mắm, đặc sản rừng', 'fas fa-shopping-cart', 3);

-- Cập nhật thông tin bổ sung cho tour Côn Đảo
UPDATE Tour SET 
    diem_noi_bat = '["Di tích lịch sử", "Bãi biển hoang sơ", "Lặn ngắm san hô", "Mộ Cô Sáu"]',
    yeu_cau_suc_khoe = 'Sức khỏe bình thường, không say sóng',
    do_tuoi_phu_hop = 'Từ 10 tuổi trở lên',
    kich_thuoc_nhom = '10-15 người',
    ngon_ngu_huong_dan = 'Tiếng Việt'
WHERE id = 7;

-- =====================================================
-- TOUR 8: ĐÀ LẠT - THÀNH PHỐ NGÀN HOA
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Đà Lạt)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(8, 1, 'Ngày 1: TP.HCM - Đà Lạt', 
 'Di chuyển từ TP.HCM đến Đà Lạt, tham quan Quảng trường Lâm Viên',
 'Đà Lạt', 
 '["Di chuyển từ TP.HCM đến Đà Lạt", "Nhận phòng khách sạn", "Tham quan Quảng trường Lâm Viên", "Dạo chơi chợ đêm Đà Lạt"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Khách sạn 3 sao trung tâm Đà Lạt',
 'Xe du lịch',
 'Tập trung tại điểm hẹn lúc 6:00',
 1),

(8, 2, 'Ngày 2: Khám phá Đà Lạt', 
 'Tham quan các điểm du lịch nổi tiếng của Đà Lạt',
 'Đà Lạt', 
 '["Tham quan Vườn hoa thành phố", "Thác Datanla", "Thiền viện Trúc Lâm", "Hồ Tuyền Lâm", "Đồi Robin"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Khách sạn 3 sao trung tâm Đà Lạt',
 'Xe du lịch',
 'Mang theo áo ấm vì thời tiết Đà Lạt có thể lạnh',
 2),

(8, 3, 'Ngày 3: Đà Lạt - TP.HCM', 
 'Tham quan nông trại, mua đặc sản, trở về TP.HCM',
 'Đà Lạt - TP.HCM', 
 '["Tham quan nông trại dâu tây", "Làng hoa Vạn Thành", "Mua đặc sản Đà Lạt", "Di chuyển về TP.HCM"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Xe du lịch',
 'Check-out khách sạn trước 12:00',
 3);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Đà Lạt)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Đà Lạt
(8, 'bao_gom', 'Xe du lịch', 'Xe du lịch đời mới, máy lạnh', 'fas fa-bus', 1, 1),
(8, 'bao_gom', 'Khách sạn 3 sao', '2 đêm tại khách sạn 3 sao (2 người/phòng)', 'fas fa-hotel', 2, 1),
(8, 'bao_gom', 'Ăn uống theo chương trình', 'Bữa sáng buffet, các bữa chính theo lịch trình', 'fas fa-utensils', 3, 1),
(8, 'bao_gom', 'Vé tham quan', 'Vé vào cửa các điểm tham quan theo chương trình', 'fas fa-ticket-alt', 4, 1),
(8, 'bao_gom', 'Hướng dẫn viên', 'HDV nhiệt tình, kinh nghiệm suốt tuyến', 'fas fa-user-tie', 5, 1),
(8, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch 20 triệu/người', 'fas fa-shield-alt', 6, 1),
(8, 'bao_gom', 'Nước uống', 'Nước suối 1 chai/người/ngày', 'fas fa-tint', 7, 1),

-- Dịch vụ không bao gồm
(8, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(8, 'khong_bao_gom', 'Tip HDV và tài xế', 'Tip tự nguyện', 'fas fa-hand-holding-usd', 2, 0),
(8, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 600.000đ cho phòng đơn', 'fas fa-bed', 3, 0),
(8, 'khong_bao_gom', 'Thuế VAT', 'Thuế VAT 10%', 'fas fa-receipt', 4, 0),
(8, 'khong_bao_gom', 'Các bữa ăn ngoài chương trình', 'Các bữa ăn không có trong lịch trình', 'fas fa-utensils', 5, 0),
(8, 'khong_bao_gom', 'Vé máng trượt Datanla', 'Vé máng trượt tại thác Datanla', 'fas fa-skiing', 6, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Đà Lạt)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Đà Lạt
(8, 'quan_trong', 'Giấy tờ tùy thân', 'Mang theo CMND/CCCD để làm thủ tục check-in khách sạn', 'fas fa-id-card', 'danger', 1),
(8, 'quan_trong', 'Thời tiết', 'Đà Lạt có thời tiết lạnh, đặc biệt vào buổi sáng và tối', 'fas fa-temperature-low', 'danger', 2),
(8, 'quan_trong', 'Sức khỏe', 'Tour có nhiều điểm tham quan đi bộ, cần sức khỏe tốt', 'fas fa-heartbeat', 'danger', 3),

-- Lưu ý khuyến khích
(8, 'khuyen_khich', 'Trang phục', 'Mang theo áo ấm, giày đi bộ thoải mái', 'fas fa-tshirt', 'info', 1),
(8, 'khuyen_khich', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, máy ảnh', 'fas fa-shopping-basket', 'info', 2),
(8, 'khuyen_khich', 'Đặc sản nên mua', 'Dâu tây, rau củ, hoa quả, trà, cà phê, rượu cần', 'fas fa-shopping-bag', 'info', 3),

-- Cam kết
(8, 'cam_oan', 'Chất lượng khách sạn', 'Cam kết khách sạn đúng tiêu chuẩn 3 sao', 'fas fa-star', 'success', 1),
(8, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Đà Lạt)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(8, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn', 600000, 'nguoi_lon', 1),
(8, 'Phụ thu cuối tuần', 'Áp dụng cho tour khởi hành thứ 6, thứ 7', 200000, 'tat_ca', 2),
(8, 'Phụ thu lễ tết', 'Áp dụng cho các tour khởi hành vào dịp lễ tết', 500000, 'tat_ca', 3),
(8, 'Phụ thu khách sạn 4 sao', 'Nâng cấp lên khách sạn 4 sao', 400000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Đà Lạt)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(8, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, voucher khách sạn', 'fas fa-id-card', 1),
(8, 'chuan_bi', 'Trang phục', 'Áo ấm, quần dài, giày đi bộ thoải mái', 'fas fa-tshirt', 2),
(8, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, máy ảnh', 'fas fa-shopping-basket', 3),
(8, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 7 ngày: hoàn 80% tổng tiền\nHủy trước 3-6 ngày: hoàn 50% tổng tiền\nHủy trước 1-2 ngày: hoàn 30% tổng tiền\nHủy trong ngày: không hoàn tiền', 'fas fa-ban', 1),
(8, 'quy_dinh', 'Quy định về trẻ em', 'Trẻ em dưới 2 tuổi: miễn phí (không có chế độ ăn riêng)\nTrẻ em từ 2-5 tuổi: 50% giá người lớn\nTrẻ em từ 6-11 tuổi: 75% giá người lớn\nTrẻ em từ 12 tuổi trở lên: tính như người lớn', 'fas fa-child', 2),
(8, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nSố khẩn cấp: 113 (cảnh sát), 115 (cấp cứu)\nHDV: 090 123 4567', 'fas fa-phone', 1),
(8, 'khac', 'Thời tiết Đà Lạt', 'Nhiệt độ trung bình: 15-24°C\nMùa mưa: tháng 5-10\nMùa khô: tháng 11-4', 'fas fa-cloud-sun', 2),
(8, 'khac', 'Địa điểm mua sắm', 'Chợ Đà Lạt: đặc sản, quà lưu niệm\nLàng hoa Vạn Thành: hoa tươi\nCác nông trại: dâu tây, rau củ', 'fas fa-shopping-cart', 3);

-- Cập nhật thông tin bổ sung cho tour Đà Lạt
UPDATE Tour SET 
    diem_noi_bat = '["Thành phố ngàn hoa", "Khí hậu mát mẻ", "Thác Datanla", "Thiền viện Trúc Lâm"]',
    yeu_cau_suc_khoe = 'Sức khỏe bình thường, có thể đi bộ nhiều',
    do_tuoi_phu_hop = 'Mọi lứa tuổi',
    kich_thuoc_nhom = '20-30 người',
    ngon_ngu_huong_dan = 'Tiếng Việt'
WHERE id = 8;

-- =====================================================
-- TOUR 9: TREKKING FANSIPAN
-- =====================================================

-- Thêm dữ liệu mẫu cho bảng LichTrinhTour (Tour Fansipan)
INSERT INTO LichTrinhTour (id_tour, ngay_thu, tieu_de, mo_ta, dia_diem, hoat_dong, bua_an, khach_san, phuong_tien, ghi_chu, thu_tu) VALUES
(9, 1, 'Ngày 1: Hà Nội - Sapa', 
 'Di chuyển từ Hà Nội đến Sapa, tham quan thị trấn Sapa',
 'Sapa', 
 '["Di chuyển từ Hà Nội đến Sapa", "Nhận phòng khách sạn", "Tham quan thị trấn Sapa", "Chuẩn bị cho hành trình trekking"]',
 '{"sang": false, "trua": true, "toi": true}',
 'Khách sạn 3 sao tại Sapa',
 'Xe du lịch',
 'Tập trung tại điểm hẹn lúc 6:30',
 1),

(9, 2, 'Ngày 2: Trekking Fansipan - Ngày 1', 
 'Bắt đầu hành trình chinh phục đỉnh Fansipan',
 'Fansipan', 
 '["Bắt đầu hành trình trekking", "Đi qua rừng nguyên sinh", "Tham quan thác nước", "Cắm trại tại độ cao 2200m"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Lều trại tại độ cao 2200m',
 'Đi bộ',
 'Chuẩn bị tinh thần và thể lực tốt',
 2),

(9, 3, 'Ngày 3: Trekking Fansipan - Ngày 2', 
 'Chinh phục đỉnh Fansipan và quay về trạm dừng chân',
 'Fansipan', 
 '["Tiếp tục hành trình trekking", "Chinh phục đỉnh Fansipan 3143m", "Chụp ảnh lưu niệm", "Quay về trạm dừng chân", "Nghỉ ngơi tại lều trại"]',
 '{"sang": true, "trua": true, "toi": true}',
 'Lều trại tại độ cao 2200m',
 'Đi bộ',
 'Đoạn đường khó nhất của hành trình',
 3),

(9, 4, 'Ngày 4: Fansipan - Sapa - Hà Nội', 
 'Quay về Sapa và trở về Hà Nội',
 'Sapa - Hà Nội', 
 '["Quay về Sapa", "Tắm nước nóng thư giãn", "Ăn trưa", "Di chuyển về Hà Nội"]',
 '{"sang": true, "trua": true, "toi": false}',
 '',
 'Đi bộ, xe du lịch',
 'Kết thúc hành trình trekking',
 4);

-- Thêm dữ liệu mẫu cho bảng DichVuBaoGom (Tour Fansipan)
INSERT INTO DichVuBaoGom (id_tour, loai_dich_vu, ten_dich_vu, mo_ta, icon, thu_tu, la_bao_gom) VALUES
-- Dịch vụ bao gồm cho tour Fansipan
(9, 'bao_gom', 'Xe du lịch', 'Xe du lịch đời mới, máy lạnh Hà Nội - Sapa - Hà Nội', 'fas fa-bus', 1, 1),
(9, 'bao_gom', 'Khách sạn 3 sao', '1 đêm tại khách sạn 3 sao ở Sapa (2 người/phòng)', 'fas fa-hotel', 2, 1),
(9, 'bao_gom', 'Lều trại', '2 đêm tại lều trại chuyên dụng trên núi', 'fas fa-campground', 3, 1),
(9, 'bao_gom', 'Ăn uống theo chương trình', 'Các bữa ăn theo lịch trình', 'fas fa-utensils', 4, 1),
(9, 'bao_gom', 'Hướng dẫn viên', 'HDV chuyên nghiệp, kinh nghiệm trekking', 'fas fa-user-tie', 5, 1),
(9, 'bao_gom', 'Porter', 'Người khuân vác hành lý, lều trại, thực phẩm', 'fas fa-people-carry', 6, 1),
(9, 'bao_gom', 'Thiết bị trekking', 'Gậy trekking, túi ngủ, đèn đội đầu', 'fas fa-hiking', 7, 1),
(9, 'bao_gom', 'Bảo hiểm du lịch', 'Bảo hiểm du lịch mạo hiểm 100 triệu/người', 'fas fa-shield-alt', 8, 1),
(9, 'bao_gom', 'Nước uống', 'Nước suối 2 chai/người/ngày', 'fas fa-tint', 9, 1),
(9, 'bao_gom', 'Giấy phép trekking', 'Giấy phép vào rừng quốc gia Hoàng Liên', 'fas fa-file-alt', 10, 1),

-- Dịch vụ không bao gồm
(9, 'khong_bao_gom', 'Chi phí cá nhân', 'Giặt ủi, điện thoại, minibar', 'fas fa-wallet', 1, 0),
(9, 'khong_bao_gom', 'Tip HDV và porter', 'Tip tự nguyện', 'fas fa-hand-holding-usd', 2, 0),
(9, 'khong_bao_gom', 'Phụ thu phòng đơn', 'Phụ thu 500.000đ cho phòng đơn tại khách sạn', 'fas fa-bed', 3, 0),
(9, 'khong_bao_gom', 'Thuế VAT', 'Thuế VAT 10%', 'fas fa-receipt', 4, 0),
(9, 'khong_bao_gom', 'Đồ uống có cồn', 'Bia, rượu và các đồ uống có cồn', 'fas fa-wine-glass', 5, 0),
(9, 'khong_bao_gom', 'Thiết bị cá nhân', 'Quần áo, giày trekking, balo cá nhân', 'fas fa-tshirt', 6, 0);

-- Thêm dữ liệu mẫu cho bảng LuuYTour (Tour Fansipan)
INSERT INTO LuuYTour (id_tour, loai_luu_y, tieu_de, noi_dung, icon, mau_sac, thu_tu) VALUES
-- Lưu ý quan trọng cho tour Fansipan
(9, 'quan_trong', 'Sức khỏe', 'Cần có sức khỏe tốt, không mắc bệnh tim mạch, huyết áp', 'fas fa-heartbeat', 'danger', 1),
(9, 'quan_trong', 'Thời tiết', 'Thời tiết trên núi thay đổi thất thường, cần chuẩn bị kỹ', 'fas fa-cloud-rain', 'danger', 2),
(9, 'quan_trong', 'Độ cao', 'Có thể gặp triệu chứng say độ cao, cần uống nhiều nước', 'fas fa-mountain', 'danger', 3),
(9, 'quan_trong', 'Tuổi tác', 'Tour không phù hợp với người trên 60 tuổi và dưới 15 tuổi', 'fas fa-user-clock', 'danger', 4),

-- Lưu ý khuyến khích
(9, 'khuyen_khich', 'Tập luyện', 'Nên tập luyện thể lực trước chuyến đi ít nhất 2 tuần', 'fas fa-dumbbell', 'info', 1),
(9, 'khuyen_khich', 'Trang phục', 'Mang giày trekking, quần áo chống thấm nước, áo ấm', 'fas fa-tshirt', 'info', 2),
(9, 'khuyen_khich', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, găng tay, mũ, kính râm', 'fas fa-first-aid', 'info', 3),
(9, 'khuyen_khich', 'Balo', 'Mang balo nhỏ đựng đồ cá nhân khi trekking', 'fas fa-backpack', 'info', 4),

-- Cam kết
(9, 'cam_oan', 'An toàn', 'Cam kết đảm bảo an toàn tối đa cho khách hàng', 'fas fa-shield-alt', 'success', 1),
(9, 'cam_oan', 'Hỗ trợ 24/7', 'Hỗ trợ khách hàng 24/7 trong suốt chuyến đi', 'fas fa-headset', 'success', 2),
(9, 'cam_oan', 'Hoàn tiền', 'Hoàn 100% tiền nếu không thể trekking do thời tiết xấu', 'fas fa-undo', 'success', 3);

-- Thêm dữ liệu mẫu cho bảng PhuThuTour (Tour Fansipan)
INSERT INTO PhuThuTour (id_tour, ten_phu_thu, mo_ta, gia, ap_dung_cho, thu_tu) VALUES
(9, 'Phụ thu phòng đơn', 'Áp dụng cho khách ở phòng đơn tại khách sạn', 500000, 'nguoi_lon', 1),
(9, 'Phụ thu porter riêng', 'Thuê porter riêng cho hành lý cá nhân', 800000, 'nguoi_lon', 2),
(9, 'Phụ thu lều riêng', 'Sử dụng lều riêng khi cắm trại', 600000, 'nguoi_lon', 3),
(9, 'Phụ thu mùa cao điểm', 'Áp dụng cho tour khởi hành từ tháng 9-11', 700000, 'tat_ca', 4);

-- Thêm dữ liệu mẫu cho bảng HuongDanTour (Tour Fansipan)
INSERT INTO HuongDanTour (id_tour, loai_huong_dan, tieu_de, noi_dung, icon, thu_tu) VALUES
(9, 'chuan_bi', 'Giấy tờ cần mang theo', 'CMND/CCCD, giấy khám sức khỏe (nếu có)', 'fas fa-id-card', 1),
(9, 'chuan_bi', 'Trang phục', 'Giày trekking chống trượt, quần áo chống thấm, áo khoác ấm, áo mưa, mũ, găng tay, tất dày', 'fas fa-tshirt', 2),
(9, 'chuan_bi', 'Đồ dùng cá nhân', 'Kem chống nắng, thuốc cá nhân, thuốc chống say độ cao, khăn, đèn pin, sạc dự phòng', 'fas fa-shopping-basket', 3),
(9, 'chuan_bi', 'Balo', 'Balo 30-40L đựng đồ cá nhân, túi nilon đựng quần áo', 'fas fa-backpack', 4),
(9, 'quy_dinh', 'Quy định hủy tour', 'Hủy trước 15 ngày: hoàn 80% tổng tiền\nHủy trước 7-14 ngày: hoàn 50% tổng tiền\nHủy trước 3-6 ngày: hoàn 30% tổng tiền\nHủy trước 0-2 ngày: không hoàn tiền', 'fas fa-ban', 1),
(9, 'quy_dinh', 'Quy định về độ tuổi', 'Độ tuổi phù hợp: 15-60 tuổi\nTrẻ em dưới 15 tuổi: không nhận\nNgười trên 60 tuổi: cần giấy khám sức khỏe', 'fas fa-user-clock', 2),
(9, 'quy_dinh', 'Quy định về an toàn', 'Tuân thủ hướng dẫn của HDV\nKhông tự ý rời khỏi nhóm\nKhông hút thuốc trong rừng\nKhông xả rác bừa bãi', 'fas fa-exclamation-triangle', 3),
(9, 'khac', 'Thông tin liên hệ', 'Hotline hỗ trợ: 1900 1234\nSố khẩn cấp: 113 (cảnh sát), 115 (cấp cứu)\nHDV: 090 123 4567', 'fas fa-phone', 1),
(9, 'khac', 'Thời tiết Fansipan', 'Mùa đẹp nhất: tháng 9-11 và tháng 3-4\nMùa mưa: tháng 5-8\nMùa lạnh: tháng 12-2', 'fas fa-cloud-sun-rain', 2),
(9, 'khac', 'Độ khó', 'Độ khó: 7/10\nQuãng đường: khoảng 20km\nĐộ cao: 3143m\nThời gian trekking: 2 ngày', 'fas fa-chart-line', 3);

-- Cập nhật thông tin bổ sung cho tour Fansipan
UPDATE Tour SET 
    diem_noi_bat = '["Đỉnh Fansipan 3143m", "Rừng nguyên sinh", "Cảnh quan hùng vĩ", "Trải nghiệm cắm trại"]',
    yeu_cau_suc_khoe = 'Sức khỏe tốt, không mắc bệnh tim mạch, huyết áp',
    do_tuoi_phu_hop = 'Từ 15 đến 60 tuổi',
    kich_thuoc_nhom = '8-12 người',
    ngon_ngu_huong_dan = 'Tiếng Việt, Tiếng Anh'
WHERE id = 9;