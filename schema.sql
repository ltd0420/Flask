-- =====================================================
-- SCHEMA CƠ SỞ DỮ LIỆU TRAVEL BOOKING SYSTEM
-- Bao gồm cả Admin và Customer
-- =====================================================

-- Tạo bảng DanhMucTour
CREATE TABLE IF NOT EXISTS DanhMucTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_danh_muc TEXT NOT NULL,
    mo_ta TEXT,
    hinh_anh TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Tour
CREATE TABLE IF NOT EXISTS Tour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_danh_muc INTEGER,
    ten_tour TEXT NOT NULL,
    mo_ta TEXT,
    gia_nguoi_lon INTEGER NOT NULL,
    gia_tre_em INTEGER,
    dia_diem_khoi_hanh TEXT NOT NULL,
    dia_diem_den TEXT NOT NULL,
    thoi_gian_tour TEXT NOT NULL,
    so_nguoi_toi_da INTEGER,
    ngay_khoi_hanh DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai TEXT DEFAULT 'đang mở',
    luot_xem INTEGER DEFAULT 0,
    so_nguoi_da_dang_ky INTEGER DEFAULT 0,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diem_noi_bat TEXT, -- Các điểm nổi bật (JSON format)
    yeu_cau_suc_khoe TEXT, -- Yêu cầu sức khỏe
    do_tuoi_phu_hop TEXT, -- Độ tuổi phù hợp
    kich_thuoc_nhom TEXT, -- Kích thước nhóm
    ngon_ngu_huong_dan TEXT, -- Ngôn ngữ hướng dẫn
    FOREIGN KEY (id_danh_muc) REFERENCES DanhMucTour(id)
);

-- Tạo bảng DichVuPhuTro
CREATE TABLE IF NOT EXISTS DichVuPhuTro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ten_dich_vu TEXT NOT NULL,
    mo_ta TEXT,
    gia INTEGER NOT NULL,
    loai_dich_vu TEXT,
    trang_thai TEXT DEFAULT 'active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng KhachHang
CREATE TABLE IF NOT EXISTS KhachHang (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ho_ten TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mat_khau TEXT NOT NULL,
    so_dien_thoai TEXT,
    dia_chi TEXT,
    ngay_sinh DATE,
    gioi_tinh TEXT,
    trang_thai TEXT DEFAULT 'active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BẢNG ADMIN - THÊM MỚI
-- =====================================================

-- Tạo bảng Admin
CREATE TABLE IF NOT EXISTS Admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    mat_khau TEXT NOT NULL,
    ho_ten TEXT NOT NULL,
    vai_tro TEXT DEFAULT 'admin', -- 'admin', 'super_admin', 'manager', 'staff'
    trang_thai TEXT DEFAULT 'active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lan_dang_nhap_cuoi TIMESTAMP
);

-- Tạo bảng AdminSession để quản lý phiên đăng nhập admin
CREATE TABLE IF NOT EXISTS AdminSession (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_admin INTEGER NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_het_han TIMESTAMP,
    trang_thai TEXT DEFAULT 'active',
    FOREIGN KEY (id_admin) REFERENCES Admin(id)
);

-- =====================================================
-- CÁC BẢNG KHÁC (GIỮ NGUYÊN)
-- =====================================================

-- Tạo bảng DonDatTour
CREATE TABLE IF NOT EXISTS DonDatTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_khach_hang INTEGER NOT NULL,
    id_tour INTEGER NOT NULL,
    ngay_dat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    so_nguoi_lon INTEGER NOT NULL,
    so_tre_em INTEGER DEFAULT 0,
    tong_tien INTEGER NOT NULL,
    trang_thai TEXT DEFAULT 'chờ xác nhận',
    ghi_chu TEXT,
    FOREIGN KEY (id_khach_hang) REFERENCES KhachHang(id),
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Tạo bảng ChiTietDonDatTour
CREATE TABLE IF NOT EXISTS ChiTietDonDatTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_don_dat_tour INTEGER NOT NULL,
    id_dich_vu_phu_tro INTEGER NOT NULL,
    so_luong INTEGER NOT NULL,
    gia INTEGER NOT NULL,
    thanh_tien INTEGER NOT NULL,
    FOREIGN KEY (id_don_dat_tour) REFERENCES DonDatTour(id),
    FOREIGN KEY (id_dich_vu_phu_tro) REFERENCES DichVuPhuTro(id)
);

-- Tạo bảng HinhAnhTour
CREATE TABLE IF NOT EXISTS HinhAnhTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tour INTEGER NOT NULL,
    duong_dan TEXT NOT NULL,
    mo_ta TEXT,
    la_anh_chinh INTEGER DEFAULT 0,
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Tạo bảng DanhGiaTour
CREATE TABLE IF NOT EXISTS DanhGiaTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_khach_hang INTEGER NOT NULL,
    id_tour INTEGER NOT NULL,
    diem_danh_gia INTEGER NOT NULL,
    noi_dung TEXT,
    ngay_danh_gia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_khach_hang) REFERENCES KhachHang(id),
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Tạo bảng TourYeuThich
CREATE TABLE IF NOT EXISTS TourYeuThich (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_khach_hang INTEGER,
    id_tour INTEGER,
    ngay_them TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_khach_hang) REFERENCES KhachHang(id),
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Tạo bảng ThongBao
CREATE TABLE IF NOT EXISTS ThongBao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_khach_hang INTEGER,
    tieu_de TEXT NOT NULL,
    noi_dung TEXT NOT NULL,
    da_doc INTEGER DEFAULT 0,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_khach_hang) REFERENCES KhachHang(id)
);

-- Tạo bảng LichSuHoatDong
CREATE TABLE IF NOT EXISTS LichSuHoatDong (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_khach_hang INTEGER,
    hanh_dong TEXT NOT NULL,
    chi_tiet TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_khach_hang) REFERENCES KhachHang(id)
);

-- Thêm bảng LichTrinhTour để lưu lịch trình chi tiết
CREATE TABLE IF NOT EXISTS LichTrinhTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tour INTEGER NOT NULL,
    ngay_thu INTEGER NOT NULL, -- Ngày thứ mấy trong tour (1, 2, 3...)
    tieu_de TEXT NOT NULL, -- Tiêu đề ngày (VD: "Ngày 1: Hà Nội - Hạ Long")
    mo_ta TEXT, -- Mô tả chi tiết hoạt động trong ngày
    dia_diem TEXT, -- Địa điểm chính trong ngày
    hoat_dong TEXT, -- Các hoạt động cụ thể (JSON format)
    bua_an TEXT, -- Thông tin bữa ăn (JSON format: {"sang": true, "trua": true, "toi": false})
    khach_san TEXT, -- Thông tin khách sạn nghỉ đêm
    phuong_tien TEXT, -- Phương tiện di chuyển
    ghi_chu TEXT, -- Ghi chú đặc biệt
    thu_tu INTEGER DEFAULT 1, -- Thứ tự sắp xếp
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Thêm bảng DichVuBaoGom để lưu các dịch vụ bao gồm trong tour
CREATE TABLE IF NOT EXISTS DichVuBaoGom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tour INTEGER NOT NULL,
    loai_dich_vu TEXT NOT NULL, -- 'bao_gom' hoặc 'khong_bao_gom'
    ten_dich_vu TEXT NOT NULL,
    mo_ta TEXT,
    icon TEXT, -- Icon class (VD: "fas fa-plane")
    thu_tu INTEGER DEFAULT 1,
    la_bao_gom INTEGER DEFAULT 1, -- 1: bao gồm, 0: không bao gồm
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Thêm bảng LuuYTour để lưu các lưu ý quan trọng
CREATE TABLE IF NOT EXISTS LuuYTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tour INTEGER NOT NULL,
    loai_luu_y TEXT NOT NULL, -- 'quan_trong', 'khuyen_khich', 'cam_oan'
    tieu_de TEXT NOT NULL,
    noi_dung TEXT NOT NULL,
    icon TEXT, -- Icon class
    mau_sac TEXT, -- Màu sắc hiển thị (VD: "warning", "info", "danger")
    thu_tu INTEGER DEFAULT 1,
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Thêm bảng PhuThuTour để lưu các phụ thu
CREATE TABLE IF NOT EXISTS PhuThuTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tour INTEGER NOT NULL,
    ten_phu_thu TEXT NOT NULL,
    mo_ta TEXT,
    gia INTEGER NOT NULL,
    ap_dung_cho TEXT, -- 'nguoi_lon', 'tre_em', 'tat_ca'
    thu_tu INTEGER DEFAULT 1,
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- Thêm bảng HuongDanTour để lưu hướng dẫn chi tiết
CREATE TABLE IF NOT EXISTS HuongDanTour (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tour INTEGER NOT NULL,
    loai_huong_dan TEXT NOT NULL, -- 'chuan_bi', 'quy_dinh', 'khac'
    tieu_de TEXT NOT NULL,
    noi_dung TEXT NOT NULL,
    icon TEXT, -- Icon class
    thu_tu INTEGER DEFAULT 1,
    FOREIGN KEY (id_tour) REFERENCES Tour(id)
);

-- =====================================================
-- DỮ LIỆU ADMIN MẪU
-- =====================================================

-- Thêm dữ liệu admin mẫu
INSERT OR IGNORE INTO Admin (username, email, mat_khau, ho_ten, vai_tro) VALUES
('admin', 'admin@travelvn.com', 'admin123', 'Quản trị viên hệ thống', 'super_admin'),
('manager', 'manager@travelvn.com', 'manager123', 'Trưởng phòng kinh doanh', 'manager'),
('staff', 'staff@travelvn.com', 'staff123', 'Nhân viên tư vấn', 'staff'),
('operator', 'operator@travelvn.com', 'operator123', 'Điều hành tour', 'admin');

-- =====================================================
-- INDEX VÀ OPTIMIZATION
-- =====================================================

-- Tạo các index để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_tour_danh_muc ON Tour(id_danh_muc);
CREATE INDEX IF NOT EXISTS idx_tour_trang_thai ON Tour(trang_thai);
CREATE INDEX IF NOT EXISTS idx_tour_ngay_khoi_hanh ON Tour(ngay_khoi_hanh);
CREATE INDEX IF NOT EXISTS idx_don_dat_tour_khach_hang ON DonDatTour(id_khach_hang);
CREATE INDEX IF NOT EXISTS idx_don_dat_tour_tour ON DonDatTour(id_tour);
CREATE INDEX IF NOT EXISTS idx_don_dat_tour_trang_thai ON DonDatTour(trang_thai);
CREATE INDEX IF NOT EXISTS idx_hinh_anh_tour ON HinhAnhTour(id_tour);
CREATE INDEX IF NOT EXISTS idx_danh_gia_tour ON DanhGiaTour(id_tour);
CREATE INDEX IF NOT EXISTS idx_admin_username ON Admin(username);
CREATE INDEX IF NOT EXISTS idx_admin_email ON Admin(email);
CREATE INDEX IF NOT EXISTS idx_admin_trang_thai ON Admin(trang_thai);

-- =====================================================
-- TRIGGERS VÀ CONSTRAINTS
-- =====================================================

-- Trigger cập nhật số người đã đăng ký khi có đơn đặt tour mới
CREATE TRIGGER IF NOT EXISTS update_tour_booking_count
AFTER INSERT ON DonDatTour
BEGIN
    UPDATE Tour 
    SET so_nguoi_da_dang_ky = (
        SELECT COALESCE(SUM(so_nguoi_lon + so_tre_em), 0)
        FROM DonDatTour 
        WHERE id_tour = NEW.id_tour 
        AND trang_thai IN ('đã xác nhận', 'đã thanh toán')
    )
    WHERE id = NEW.id_tour;
END;

-- Trigger cập nhật lượt xem khi có đánh giá mới
CREATE TRIGGER IF NOT EXISTS update_tour_view_on_review
AFTER INSERT ON DanhGiaTour
BEGIN
    UPDATE Tour 
    SET luot_xem = luot_xem + 1
    WHERE id = NEW.id_tour;
END;
