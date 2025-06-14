from flask import Flask, request, jsonify, render_template, redirect, url_for, session, g
import sqlite3
import os
import json
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Khởi tạo ứng dụng Flask
app = Flask(__name__)
app.secret_key = 'your_secret_key' 
app.config['JSON_AS_ASCII'] = False 
app.config['TEMPLATES_AUTO_RELOAD'] = True

# Cấu hình cơ sở dữ liệu
DATABASE = 'tour_management.db'

# Hàm get_db() 
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
        # Thêm dòng này để đảm bảo SQLite sử dụng UTF-8
        db.execute("PRAGMA encoding = 'UTF-8'")
    return db

# Đóng kết nối cơ sở dữ liệu khi request kết thúc
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# Hàm thực thi truy vấn
def query_db(query, args=(), one=False):
    try:
        cur = get_db().execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv
    except Exception as e:
        print(f"Database query error: {e}")
        return None if one else []

# Hàm thực thi truy vấn và commit
def execute_db(query, args=()):
    try:
        conn = get_db()
        cur = conn.execute(query, args)
        conn.commit()
        cur.close()
        return cur.lastrowid
    except Exception as e:
        print(f"Database execute error: {e}")
        return None

# Hàm tạo thông báo cho khách hàng
def create_notification(customer_id, title, content, booking_id=None):
    try:
        notification_id = execute_db('''
            INSERT INTO ThongBao (id_khach_hang, tieu_de, noi_dung, ngay_tao)
            VALUES (?, ?, ?, ?)
        ''', [customer_id, title, content, datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
        
        # Ghi log hoạt động
        execute_db('''
            INSERT INTO LichSuHoatDong (id_khach_hang, hanh_dong, chi_tiet, ngay_tao)
            VALUES (?, ?, ?, ?)
        ''', [customer_id, 'Nhận thông báo', f'{title}: {content}', datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
        
        return notification_id
    except Exception as e:
        print(f"Lỗi khi tạo thông báo: {e}")
        return None

# Route cho trang chủ
@app.route('/')
def index():
    user = None
    if 'user_id' in session:
        user_id = session['user_id']
        user = query_db('SELECT id, ho_ten, email FROM KhachHang WHERE id = ?', [user_id], one=True)
    return render_template('index.html', user=user)

# Route cho trang giới thiệu
@app.route('/gioithieu')
def about():
    return render_template('gioithieu.html')

# Route cho trang blog
@app.route('/blog')
def blog():
    return render_template('blog.html')

# Route cho trang liên hệ
@app.route('/lienhe')
def contact():
    return render_template('lienhe.html')

# Route cho trang danh sách tour
@app.route('/tours')
def tours():
    try:
        # Kết nối đến cơ sở dữ liệu với hỗ trợ UTF-8
        conn = sqlite3.connect('tour_management.db')
        conn.text_factory = str
        cursor = conn.cursor()
        
        # Truy vấn danh sách danh mục tour
        cursor.execute("""
            SELECT id, ten_danh_muc, mo_ta, hinh_anh 
            FROM DanhMucTour
            ORDER BY id
        """)
        categories = [
            {
                'id': row[0],
                'ten': row[1],
                'mo_ta': row[2],
                'hinh_anh': row[3]
            } for row in cursor.fetchall()
        ]
        
        # Truy vấn danh sách tour phổ biến
        cursor.execute("""
            SELECT t.id, t.ten_tour, t.mo_ta, t.gia_nguoi_lon, t.dia_diem_khoi_hanh, 
                   t.dia_diem_den, t.thoi_gian_tour, h.duong_dan
            FROM Tour t
            LEFT JOIN HinhAnhTour h ON t.id = h.id_tour AND h.la_anh_chinh = 1
            ORDER BY t.id
            LIMIT 6
        """)
        popular_tours = [
            {
                'id': row[0],
                'ten': row[1],
                'mo_ta': row[2],
                'gia': row[3],
                'khoi_hanh': row[4],
                'diem_den': row[5],
                'thoi_gian': row[6],
                'hinh_anh': row[7] if row[7] else '/static/images/tour-placeholder.jpg'
            } for row in cursor.fetchall()
        ]
        
        conn.close()
        
        return render_template(
            'tours.html', 
            categories=categories, 
            popular_tours=popular_tours
        )
    except Exception as e:
        print(f"Lỗi khi tải trang tours: {e}")
        return render_template('tours.html', error=str(e))

# Route cho trang chi tiết tour
@app.route('/tour/<int:tour_id>')
def tour_detail(tour_id):
    # Kiểm tra xem tour có tồn tại không
    tour = query_db('SELECT id FROM Tour WHERE id = ?', [tour_id], one=True)
    if not tour:
        return redirect(url_for('tours'))
    
    return render_template('tour-detail.html', tour_id=tour_id)

# Route cho trang xác nhận đặt tour (cả hai URL)
@app.route('/don-dat-tour/<int:tour_id>')
@app.route('/tour-confirm/<int:tour_id>')
def tour_confirm(tour_id):
    # Kiểm tra xem tour có tồn tại không
    tour = query_db('SELECT id FROM Tour WHERE id = ?', [tour_id], one=True)
    if not tour:
        return redirect(url_for('tours'))
    
    # Kiểm tra đăng nhập
    if 'user_id' not in session:
        return redirect(url_for('login', redirect=f'/don-dat-tour/{tour_id}'))
    
    return render_template('tour-confirm.html', tour_id=tour_id)

# Route cho trang đăng nhập
@app.route('/login')
@app.route('/dang-nhap')
def login():
    return render_template('login.html')

# Route cho trang đăng ký
@app.route('/register')
@app.route('/dang-ky')
def register():
    return render_template('register.html')

# Route cho trang profile
@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    user = query_db('SELECT * FROM KhachHang WHERE id = ?', [user_id], one=True)
    if not user:
        session.pop('user_id', None)
        return redirect(url_for('login'))
    
    return render_template('profile.html', user=user)

# Route cho trang bookings
@app.route('/bookings')
def bookings():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    bookings = query_db('''
        SELECT d.*, t.ten_tour, t.dia_diem_khoi_hanh, t.dia_diem_den, t.ngay_khoi_hanh, t.ngay_ket_thuc
        FROM DonDatTour d
        JOIN Tour t ON d.id_tour = t.id
        WHERE d.id_khach_hang = ?
        ORDER BY d.ngay_dat DESC
    ''', [user_id])
    
    return render_template('bookings.html', bookings=bookings)

# Route cho trang wishlist
@app.route('/wishlist')
def wishlist():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('wishlist.html')

# Route cho trang thông báo
@app.route('/notifications')
def notifications():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('notifications.html')

# =====================================================
# ADMIN ROUTES - THÊM MỚI
# =====================================================

# Decorator để kiểm tra quyền admin
def admin_required(f):
    def decorated_function(*args, **kwargs):
        if 'admin_id' not in session:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Route cho trang đăng nhập admin
@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

# Route cho trang admin dashboard
@app.route('/admin')
@admin_required
def admin_dashboard():
    admin_id = session['admin_id']
    admin = query_db('SELECT * FROM Admin WHERE id = ?', [admin_id], one=True)
    if not admin:
        session.pop('admin_id', None)
        return redirect(url_for('admin_login'))
    
    return render_template('admin/dashboard.html', admin=admin)

# Route admin với decorator
@app.route('/admin/tours')
@admin_required
def admin_tours():
    admin = query_db('SELECT * FROM Admin WHERE id = ?', [session['admin_id']], one=True)
    return render_template('admin/tours.html', admin=admin)

@app.route('/admin/customers')
@admin_required
def admin_customers():
    admin = query_db('SELECT * FROM Admin WHERE id = ?', [session['admin_id']], one=True)
    return render_template('admin/customers.html', admin=admin)

@app.route('/admin/bookings')
@admin_required
def admin_bookings():
    admin = query_db('SELECT * FROM Admin WHERE id = ?', [session['admin_id']], one=True)
    return render_template('admin/bookings.html', admin=admin)

# Route admin cho quản lý đánh giá tour
@app.route('/admin/reviews')
@admin_required
def admin_reviews():
    admin = query_db('SELECT * FROM Admin WHERE id = ?', [session['admin_id']], one=True)
    return render_template('admin/reviews.html', admin=admin)

# Route admin cho báo cáo
@app.route('/admin/reports')
@admin_required
def admin_reports():
    admin = query_db('SELECT * FROM Admin WHERE id = ?', [session['admin_id']], one=True)
    return render_template('admin/reports.html', admin=admin)

# =====================================================
# ADMIN FUNCTIONALITY - THÊM MỚI
# =====================================================

# API kiểm tra trạng thái đăng nhập
@app.route('/api/check-auth')
def check_auth():
    if 'user_id' in session:
        user_id = session['user_id']
        user = query_db('SELECT id, ho_ten, email FROM KhachHang WHERE id = ?', [user_id], one=True)
        if user:
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user['id'],
                    'ho_ten': user['ho_ten'],
                    'name': user['ho_ten'],  # Thêm alias cho tương thích
                    'email': user['email']
                }
            })
    return jsonify({'authenticated': False})

# =====================================================
# ADMIN API ROUTES - THÊM MỚI
# =====================================================

# API đăng nhập admin
@app.route('/api/admin/login', methods=['POST'])
def api_admin_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Vui lòng nhập đầy đủ thông tin'}), 400
        
        # Kiểm tra thông tin đăng nhập admin
        admin = query_db(
            'SELECT * FROM Admin WHERE (username = ? OR email = ?) AND trang_thai = "active"', 
            [username, username], 
            one=True
        )
        
        if not admin:
            return jsonify({'error': 'Tài khoản không tồn tại hoặc đã bị khóa'}), 401
        
        # Kiểm tra mật khẩu
        if password != admin['mat_khau']:
            return jsonify({'error': 'Mật khẩu không chính xác'}), 401
        
        # Tạo session cho admin
        session['admin_id'] = admin['id']
        session['admin_username'] = admin['username']
        session['admin_role'] = admin['vai_tro']
        session['admin_name'] = admin['ho_ten']
        session['is_admin'] = True
        
        # Cập nhật thời gian đăng nhập cuối
        execute_db(
            'UPDATE Admin SET lan_dang_nhap_cuoi = ? WHERE id = ?',
            [datetime.now().strftime('%Y-%m-%d %H:%M:%S'), admin['id']]
        )
        
        # Trả về thông tin admin (không bao gồm mật khẩu)
        admin_dict = dict(admin)
        admin_dict.pop('mat_khau', None)
        
        return jsonify({
            'success': True,
            'message': 'Đăng nhập admin thành công',
            'admin': admin_dict,
            'redirect': '/admin'
        })
        
    except Exception as e:
        print(f"Lỗi trong API admin login: {str(e)}")
        return jsonify({'error': 'Lỗi server khi đăng nhập'}), 500

# API kiểm tra trạng thái đăng nhập admin
@app.route('/api/admin/check-auth')
def admin_check_auth():
    if 'admin_id' in session:
        admin_id = session['admin_id']
        admin = query_db('SELECT id, username, email, ho_ten, vai_tro FROM Admin WHERE id = ?', [admin_id], one=True)
        if admin:
            return jsonify({
                'authenticated': True,
                'admin': dict(admin)
            })
    return jsonify({'authenticated': False})

# API đăng xuất admin
@app.route('/api/admin/logout')
def admin_logout():
    # Xóa tất cả session admin
    session.pop('admin_id', None)
    session.pop('admin_username', None)
    session.pop('admin_role', None)
    session.pop('admin_name', None)
    session.pop('is_admin', None)
    
    return jsonify({'success': True, 'message': 'Đăng xuất admin thành công'})

# API đăng xuất (cập nhật để hỗ trợ cả admin và customer)
@app.route('/api/logout')
def logout():
    # Kiểm tra xem đây là admin hay customer logout
    if 'admin_id' in session:
        # Admin logout
        session.pop('admin_id', None)
        session.pop('admin_username', None)
        session.pop('admin_role', None)
        session.pop('admin_name', None)
        session.pop('is_admin', None)
        return jsonify({'success': True, 'message': 'Đăng xuất admin thành công'})
    else:
        # Customer logout
        session.clear()
        session.pop('user_id', None)
        session.pop('user_name', None)
        session.pop('user_email', None)
        
        print("Đã đăng xuất người dùng, session hiện tại:", session)
        
        return jsonify({'success': True, 'message': 'Đăng xuất thành công'})

# Route đăng xuất
@app.route('/logout', methods=['GET', 'POST'])
def logout_page():
    print("Đang xử lý đăng xuất...")
    session.clear()
    print("Đã xóa session, session hiện tại:", session)
    return redirect(url_for('index'))

# API lấy chi tiết tour - ĐƯỢC CẢI THIỆN VÀ SỬA LỖI
@app.route('/api/tours/<int:tour_id>')
def api_tour_detail(tour_id):
    try:
        print(f"=== API TOUR DETAIL - ID: {tour_id} ===")
        
        # Lấy thông tin tour với xử lý lỗi tốt hơn
        tour_query = '''
            SELECT t.*, COALESCE(c.ten_danh_muc, 'Chưa phân loại') as ten_danh_muc 
            FROM Tour t 
            LEFT JOIN DanhMucTour c ON t.id_danh_muc = c.id 
            WHERE t.id = ?
        '''
        tour = query_db(tour_query, [tour_id], one=True)
        print(f"Tour found: {tour is not None}")
        
        if not tour:
            return jsonify({'error': 'Tour không tồn tại'}), 404
        
        # Cập nhật lượt xem (với xử lý lỗi)
        try:
            execute_db('UPDATE Tour SET luot_xem = COALESCE(luot_xem, 0) + 1 WHERE id = ?', [tour_id])
        except Exception as e:
            print(f"Lỗi khi cập nhật lượt xem: {e}")
        
        # Lấy hình ảnh tour
        images = query_db('SELECT * FROM HinhAnhTour WHERE id_tour = ? ORDER BY la_anh_chinh DESC, id ASC', [tour_id])
        if not images:
            # Tạo hình ảnh mặc định nếu không có
            images = [{
                'id': 0,
                'id_tour': tour_id,
                'duong_dan': '/static/images/tours/default-tour.jpg',
                'mo_ta': 'Hình ảnh tour',
                'la_anh_chinh': 1
            }]
        print(f"Images found: {len(images)}")
        
        # Lấy đánh giá tour
        reviews_query = '''
            SELECT d.*, COALESCE(k.ho_ten, 'Khách hàng') as ho_ten 
            FROM DanhGiaTour d 
            LEFT JOIN KhachHang k ON d.id_khach_hang = k.id 
            WHERE d.id_tour = ?
            ORDER BY d.ngay_danh_gia DESC
        '''
        reviews = query_db(reviews_query, [tour_id])
        print(f"Reviews found: {len(reviews)}")
        
        # Tính điểm đánh giá trung bình
        avg_rating = 0
        if reviews:
            total_rating = sum(review['diem_danh_gia'] for review in reviews if review['diem_danh_gia'])
            avg_rating = total_rating / len(reviews) if len(reviews) > 0 else 0
        
        # Lấy lịch trình tour
        schedule = query_db('''
            SELECT * FROM LichTrinhTour 
            WHERE id_tour = ? 
            ORDER BY ngay_thu ASC, thu_tu ASC
        ''', [tour_id])
        print(f"Schedule found: {len(schedule)}")
        
        # SỬA LỖI: Lấy dịch vụ bao gồm từ bảng DichVuBaoGom
        included_services = query_db('''
            SELECT * FROM DichVuBaoGom 
            WHERE id_tour = ? 
            ORDER BY la_bao_gom DESC, thu_tu ASC
        ''', [tour_id])
        print(f"Included services found: {len(included_services)}")

        # Debug: In ra dữ liệu để kiểm tra
        for service in included_services:
            print(f"Service: {service['ten_dich_vu']}, Type: {service['loai_dich_vu']}, Included: {service['la_bao_gom']}")
        
        # Lấy lưu ý tour
        notes = query_db('''
            SELECT * FROM LuuYTour 
            WHERE id_tour = ? 
            ORDER BY loai_luu_y ASC, thu_tu ASC
        ''', [tour_id])
        print(f"Notes found: {len(notes)}")
        
        # Lấy phụ thu tour
        surcharges = query_db('''
            SELECT * FROM PhuThuTour 
            WHERE id_tour = ? 
            ORDER BY thu_tu ASC
        ''', [tour_id])
        print(f"Surcharges found: {len(surcharges)}")
        
        # Lấy hướng dẫn tour
        guidelines = query_db('''
            SELECT * FROM HuongDanTour 
            WHERE id_tour = ? 
            ORDER BY loai_huong_dan ASC, thu_tu ASC
        ''', [tour_id])
        print(f"Guidelines found: {len(guidelines)}")
        
        # Lấy gợi ý dịch vụ phụ trợ
        recommended_services = query_db('SELECT * FROM DichVuPhuTro LIMIT 5')
        print(f"Recommended services found: {len(recommended_services)}")
        
        print("=== END API TOUR DETAIL ===")
        
        # Trả về kết quả
        return jsonify({
            'tour': dict(tour),
            'hinh_anh': [dict(image) for image in images],
            'danh_gia': [dict(review) for review in reviews],
            'diem_danh_gia_trung_binh': round(avg_rating, 1) if avg_rating else 0,
            'lich_trinh': [dict(item) for item in schedule],
            'dich_vu_bao_gom': [dict(service) for service in included_services],
            'luu_y': [dict(note) for note in notes],
            'phu_thu': [dict(surcharge) for surcharge in surcharges],
            'huong_dan': [dict(guideline) for guideline in guidelines],
            'dich_vu_phu_tro_goi_y': [dict(service) for service in recommended_services]
        })
        
    except Exception as e:
        print(f"Lỗi trong API tour detail: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API lấy danh sách tour
@app.route('/api/tours')
def api_tours():
    try:
        # Lấy tham số từ request
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        offset = (page - 1) * limit
        
        category_id = request.args.get('danh_muc_id')
        departure = request.args.get('dia_diem_khoi_hanh')
        destination = request.args.get('dia_diem_den')
        min_price = request.args.get('gia_min')
        max_price = request.args.get('gia_max')
        min_date = request.args.get('ngay_khoi_hanh_min')
        max_date = request.args.get('ngay_khoi_hanh_max')
        duration = request.args.get('thoi_gian')
        sort = request.args.get('sort', 'id')
        keyword = request.args.get('keyword')
        
        # Xây dựng câu truy vấn
        query = '''
            SELECT t.*, COALESCE(c.ten_danh_muc, 'Chưa phân loại') as ten_danh_muc, 
            (SELECT COUNT(*) FROM DanhGiaTour WHERE id_tour = t.id) as so_luong_danh_gia,
            (SELECT AVG(diem_danh_gia) FROM DanhGiaTour WHERE id_tour = t.id) as diem_danh_gia_trung_binh,
            (SELECT duong_dan FROM HinhAnhTour WHERE id_tour = t.id AND la_anh_chinh = 1 LIMIT 1) as hinh_anh_chinh
            FROM Tour t
            LEFT JOIN DanhMucTour c ON t.id_danh_muc = c.id
            WHERE 1=1
        '''
        
        params = []
        
        # Thêm điều kiện lọc
        if category_id:
            if ',' in category_id:
                categories = category_id.split(',')
                placeholders = ','.join(['?' for _ in categories])
                query += f' AND t.id_danh_muc IN ({placeholders})'
                params.extend(categories)
            else:
                query += ' AND t.id_danh_muc = ?'
                params.append(category_id)
        
        if departure:
            if ',' in departure:
                departures = departure.split(',')
                placeholders = ','.join(['?' for _ in departures])
                query += f' AND t.dia_diem_khoi_hanh IN ({placeholders})'
                params.extend(departures)
            else:
                query += ' AND t.dia_diem_khoi_hanh = ?'
                params.append(departure)
        
        if destination:
            query += ' AND t.dia_diem_den LIKE ?'
            params.append(f'%{destination}%')
        
        if min_price:
            query += ' AND t.gia_nguoi_lon >= ?'
            params.append(min_price)
        
        if max_price:
            query += ' AND t.gia_nguoi_lon <= ?'
            params.append(max_price)
        
        if min_date:
            query += ' AND t.ngay_khoi_hanh >= ?'
            params.append(min_date)
        
        if max_date:
            query += ' AND t.ngay_khoi_hanh <= ?'
            params.append(max_date)
        
        if duration:
            if ',' in duration:
                durations = duration.split(',')
                duration_conditions = []
                for d in durations:
                    duration_conditions.append('t.thoi_gian_tour LIKE ?')
                    params.append(f'%{d}%')
                query += f' AND ({" OR ".join(duration_conditions)})'
            else:
                query += ' AND t.thoi_gian_tour LIKE ?'
                params.append(f'%{duration}%')
        
        if keyword:
            query += ' AND (t.ten_tour LIKE ? OR t.mo_ta LIKE ? OR t.dia_diem_den LIKE ?)'
            params.extend([f'%{keyword}%', f'%{keyword}%', f'%{keyword}%'])
        
        # Đếm tổng số tour thỏa mãn điều kiện
        count_query = f'SELECT COUNT(*) as total FROM ({query})'
        total_result = query_db(count_query, params, one=True)
        total = total_result['total'] if total_result else 0
        
        # Thêm sắp xếp
        if sort == 'gia_thap':
            query += ' ORDER BY t.gia_nguoi_lon ASC'
        elif sort == 'gia_cao':
            query += ' ORDER BY t.gia_nguoi_lon DESC'
        elif sort == 'danh_gia':
            query += ' ORDER BY diem_danh_gia_trung_binh DESC'
        elif sort == 'moi_nhat':
            query += ' ORDER BY t.ngay_khoi_hanh ASC'
        elif sort == 'luot_xem':
            query += ' ORDER BY t.luot_xem DESC'
        else:
            query += ' ORDER BY t.id DESC'
        
        # Thêm phân trang
        query += ' LIMIT ? OFFSET ?'
        params.extend([limit, offset])
        
        # Thực thi truy vấn
        tours = query_db(query, params)
        
        # Trả về kết quả
        return jsonify({
            'tours': [dict(tour) for tour in tours],
            'total': total,
            'page': page,
            'per_page': limit,
            'total_pages': (total + limit - 1) // limit if total > 0 else 0
        })
        
    except Exception as e:
        print(f"Lỗi trong API tours: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API đăng nhập
@app.route('/api/login', methods=['POST'])
@app.route('/api/dang-nhap', methods=['POST'], endpoint='api_login_vi')
def api_login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('mat_khau', data.get('password'))
        
        if not email or not password:
            return jsonify({'error': 'Vui lòng nhập đầy đủ thông tin'})
        
        # Kiểm tra thông tin đăng nhập
        user = query_db('SELECT * FROM KhachHang WHERE email = ?', [email], one=True)
        
        if not user:
            return jsonify({'error': 'Email không tồn tại'})
        
        stored_password = user['mat_khau']
        
        if password != stored_password:
            return jsonify({'error': 'Mật khẩu không chính xác'})
        
        # Tạo session cho người dùng đã đăng nhập
        session['user_id'] = user['id']
        session['user_name'] = user['ho_ten']
        session['user_email'] = user['email']
        
        # Trả về thông tin người dùng (không bao gồm mật khẩu)
        user_dict = dict(user)
        user_dict.pop('mat_khau', None)
        
        return jsonify({
            'message': 'Đăng nhập thành công',
            'user': user_dict
        })
        
    except Exception as e:
        print(f"Lỗi trong API login: {str(e)}")
        return jsonify({'error': 'Lỗi server khi đăng nhập'}), 500

# API đăng ký
@app.route('/api/register', methods=['POST'])
@app.route('/api/dang-ky', methods=['POST'], endpoint='api_register_vi')
def api_register():
    try:
        data = request.json
        ho_ten = data.get('ho_ten', data.get('name', data.get('full_name')))
        email = data.get('email')
        mat_khau = data.get('mat_khau', data.get('password'))
        so_dien_thoai = data.get('so_dien_thoai', data.get('phone'))
        dia_chi = data.get('dia_chi', data.get('address'))
        ngay_sinh = data.get('ngay_sinh', data.get('birth_date'))
        gioi_tinh = data.get('gioi_tinh', data.get('gender'))
        
        # Kiểm tra dữ liệu đầu vào
        if not ho_ten or not email or not mat_khau:
            return jsonify({'error': 'Vui lòng nhập đầy đủ thông tin bắt buộc'})
        
        # Kiểm tra định dạng email
        import re
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({'error': 'Email không hợp lệ'})
        
        # Kiểm tra email đã tồn tại chưa
        existing_user = query_db('SELECT id FROM KhachHang WHERE email = ?', [email], one=True)
        if existing_user:
            return jsonify({'error': 'Email đã được sử dụng'})
        
        # Kiểm tra độ dài mật khẩu
        if len(mat_khau) < 6:
            return jsonify({'error': 'Mật khẩu phải có ít nhất 6 ký tự'})
        
        # Thêm người dùng mới
        user_id = execute_db(
            'INSERT INTO KhachHang (ho_ten, email, mat_khau, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ho_ten, email, mat_khau, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh]
        )
        
        if not user_id:
            return jsonify({'error': 'Không thể tạo tài khoản'}), 500
        
        # Lấy thông tin người dùng vừa tạo
        user = query_db('SELECT id, ho_ten, email, so_dien_thoai, dia_chi FROM KhachHang WHERE id = ?', [user_id], one=True)
        
        print(f"Đăng ký thành công: ID={user_id}, Email={email}")
        
        return jsonify({
            'message': 'Đăng ký thành công',
            'user': dict(user)
        })
        
    except Exception as e:
        print(f"Lỗi trong API register: {str(e)}")
        return jsonify({'error': 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.'}), 500

# API đặt tour
@app.route('/api/dat-tour', methods=['POST'])
@app.route('/api/book-tour', methods=['POST'], endpoint='api_book_tour_vi')
def api_book_tour():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Không nhận được dữ liệu JSON'}), 400
            
        tour_id = data.get('id_tour', data.get('tour_id'))
        so_nguoi_lon = data.get('so_nguoi_lon', data.get('adults'))
        so_tre_em = data.get('so_tre_em', data.get('children', 0))
        ngay_khoi_hanh = data.get('ngay_khoi_hanh', data.get('departure_date'))
        dich_vu_phu_tro = data.get('dich_vu_phu_tro', data.get('additional_services', []))
        
        if not tour_id or not so_nguoi_lon or not ngay_khoi_hanh:
            return jsonify({'error': 'Vui lòng nhập đầy đủ thông tin bắt buộc'}), 400
        
        # Lấy thông tin tour
        tour = query_db('SELECT * FROM Tour WHERE id = ?', [tour_id], one=True)
        if not tour:
            return jsonify({'error': 'Tour không tồn tại'}), 404
        # Lấy thông tin tour
        tour = query_db('SELECT * FROM Tour WHERE id = ?', [tour_id], one=True)
        if not tour:
            return jsonify({'error': 'Tour không tồn tại'}), 404
        
        # Kiểm tra người dùng đã đăng nhập chưa
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập để đặt tour'}), 401
        
        user_id = session['user_id']
        
        # Tính tổng tiền
        tong_tien = tour['gia_nguoi_lon'] * so_nguoi_lon
        if so_tre_em and tour['gia_tre_em']:
            tong_tien += tour['gia_tre_em'] * so_tre_em
        
        # Thêm đơn đặt tour
        don_dat_tour_id = execute_db(
            'INSERT INTO DonDatTour (id_khach_hang, id_tour, ngay_dat, so_nguoi_lon, so_tre_em, tong_tien, trang_thai, ghi_chu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, tour_id, datetime.now().strftime('%Y-%m-%d'), so_nguoi_lon, so_tre_em, tong_tien, 'chờ xác nhận', '']
        )
        
        if not don_dat_tour_id:
            return jsonify({'error': 'Không thể tạo đơn đặt tour'}), 500
        
        # Thêm chi tiết đơn đặt tour (dịch vụ phụ trợ)
        for dich_vu in dich_vu_phu_tro:
            id_dich_vu = dich_vu.get('id_dich_vu', dich_vu.get('service_id'))
            so_luong = dich_vu.get('so_luong', dich_vu.get('quantity', 1))
            
            # Lấy thông tin dịch vụ
            dich_vu_info = query_db('SELECT * FROM DichVuPhuTro WHERE id = ?', [id_dich_vu], one=True)
            if dich_vu_info:
                gia = dich_vu_info['gia']
                thanh_tien = gia * so_luong
                
                execute_db(
                    'INSERT INTO ChiTietDonDatTour (id_don_dat_tour, id_dich_vu_phu_tro, so_luong, gia, thanh_tien) VALUES (?, ?, ?, ?, ?)',
                    [don_dat_tour_id, id_dich_vu, so_luong, gia, thanh_tien]
                )
                
                # Cập nhật tổng tiền
                tong_tien += thanh_tien
        
        # Cập nhật tổng tiền
        execute_db('UPDATE DonDatTour SET tong_tien = ? WHERE id = ?', [tong_tien, don_dat_tour_id])
        
        # Tạo thông báo cho khách hàng
        create_notification(
            user_id,
            'Đặt tour thành công',
            f'Bạn đã đặt tour "{tour["ten_tour"]}" thành công. Đơn đặt tour #{don_dat_tour_id} đang chờ xác nhận.',
            don_dat_tour_id
        )
        
        return jsonify({
            'success': True,
            'message': 'Đặt tour thành công',
            'don_dat_tour_id': don_dat_tour_id
        })
        
    except Exception as e:
        print(f"Lỗi trong API book tour: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Lỗi server khi đặt tour: {str(e)}'}), 500

# API đánh giá tour
@app.route('/api/danh-gia', methods=['POST'])
@app.route('/api/review', methods=['POST'], endpoint='api_review_vi')
def api_review():
    try:
        data = request.json
        tour_id = data.get('id_tour', data.get('tour_id'))
        diem_danh_gia = data.get('diem_danh_gia', data.get('rating'))
        noi_dung = data.get('noi_dung', data.get('content', ''))
        
        if not tour_id or not diem_danh_gia:
            return jsonify({'error': 'Vui lòng nhập đầy đủ thông tin bắt buộc'})
        
        # Kiểm tra người dùng đã đăng nhập chưa
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập để đánh giá tour'})
        
        user_id = session['user_id']
        
        # Kiểm tra xem người dùng đã đánh giá tour này chưa
        existing_review = query_db('SELECT id FROM DanhGiaTour WHERE id_khach_hang = ? AND id_tour = ?', [user_id, tour_id], one=True)
        
        if existing_review:
            # Cập nhật đánh giá
            execute_db(
                'UPDATE DanhGiaTour SET diem_danh_gia = ?, noi_dung = ?, ngay_danh_gia = ? WHERE id = ?',
                [diem_danh_gia, noi_dung, datetime.now().strftime('%Y-%m-%d'), existing_review['id']]
            )
        else:
            # Thêm đánh giá mới
            execute_db(
                'INSERT INTO DanhGiaTour (id_khach_hang, id_tour, diem_danh_gia, noi_dung, ngay_danh_gia) VALUES (?, ?, ?, ?, ?)',
                [user_id, tour_id, diem_danh_gia, noi_dung, datetime.now().strftime('%Y-%m-%d')]
            )
        
        return jsonify({
            'message': 'Đánh giá thành công'
        })
        
    except Exception as e:
        print(f"Lỗi trong API review: {str(e)}")
        return jsonify({'error': 'Lỗi server khi đánh giá'}), 500

# API lấy danh sách tour yêu thích
@app.route('/api/tour-yeu-thich', methods=['GET', 'POST'])
def api_favorite_tours():
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập để thực hiện chức năng này'}), 401
        
        user_id = session['user_id']
        
        # GET: Lấy danh sách hoặc kiểm tra trạng thái yêu thích
        if request.method == 'GET':
            tour_id = request.args.get('tour_id')
            
            if tour_id:
                # Kiểm tra tour có trong danh sách yêu thích không
                favorite = query_db('SELECT id FROM TourYeuThich WHERE id_khach_hang = ? AND id_tour = ?', [user_id, tour_id], one=True)
                return jsonify({'is_favorite': favorite is not None})
            else:
                # Lấy danh sách tour yêu thích
                tours = query_db('''
                    SELECT t.*, c.ten_danh_muc,
                    (SELECT COUNT(*) FROM DanhGiaTour WHERE id_tour = t.id) as so_luong_danh_gia,
                    (SELECT AVG(diem_danh_gia) FROM DanhGiaTour WHERE id_tour = t.id) as diem_danh_gia_trung_binh,
                    (SELECT duong_dan FROM HinhAnhTour WHERE id_tour = t.id AND la_anh_chinh = 1 LIMIT 1) as hinh_anh_chinh
                    FROM TourYeuThich y
                    JOIN Tour t ON y.id_tour = t.id
                    LEFT JOIN DanhMucTour c ON t.id_danh_muc = c.id
                    WHERE y.id_khach_hang = ?
                    ORDER BY y.ngay_them DESC
                ''', [user_id])
                
                return jsonify({
                    'success': True,
                    'tours': [dict(tour) for tour in tours]
                })
        
        # POST: Thêm tour vào yêu thích
        else:
            data = request.json
            tour_id = data.get('id_tour')
            
            if not tour_id:
                return jsonify({'error': 'Thiếu thông tin tour'}), 400
            
            # Kiểm tra tour có tồn tại không
            tour = query_db('SELECT id FROM Tour WHERE id = ?', [tour_id], one=True)
            if not tour:
                return jsonify({'error': 'Tour không tồn tại'}), 404
            
            # Kiểm tra đã yêu thích chưa
            existing = query_db('SELECT id FROM TourYeuThich WHERE id_khach_hang = ? AND id_tour = ?', [user_id, tour_id], one=True)
            
            if existing:
                return jsonify({'error': 'Tour đã có trong danh sách yêu thích'}), 400
            
            # Thêm vào danh sách yêu thích
            result = execute_db(
                'INSERT INTO TourYeuThich (id_khach_hang, id_tour, ngay_them) VALUES (?, ?, ?)',
                [user_id, tour_id, datetime.now().strftime('%Y-%m-%d')]
            )
            
            if result:
                return jsonify({
                    'success': True,
                    'message': 'Đã thêm tour vào danh sách yêu thích'
                })
            else:
                return jsonify({'error': 'Không thể thêm tour vào yêu thích'}), 500
            
    except Exception as e:
        print(f"Lỗi trong API favorite tours: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Lỗi server'}), 500

# API xóa tour khỏi danh sách yêu thích
@app.route('/api/tour-yeu-thich/<int:tour_id>', methods=['DELETE'])
def api_remove_favorite(tour_id):
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập để thực hiện chức năng này'})
        
        user_id = session['user_id']
        
        # Xóa tour khỏi danh sách yêu thích
        execute_db('DELETE FROM TourYeuThich WHERE id_khach_hang = ? AND id_tour = ?', [user_id, tour_id])
        
        return jsonify({
            'success': True,
            'message': 'Đã xóa tour khỏi danh sách yêu thích'
        })
        
    except Exception as e:
        print(f"Lỗi trong API remove favorite: {str(e)}")
        return jsonify({'error': 'Lỗi server'}), 500

# API kiểm tra dữ liệu database
@app.route('/api/debug/tour/<int:tour_id>/services')
def debug_tour_services(tour_id):
    try:
        # Lấy tất cả dịch vụ của tour
        services = query_db('''
            SELECT * FROM DichVuBaoGom 
            WHERE id_tour = ? 
            ORDER BY la_bao_gom DESC, thu_tu ASC
        ''', [tour_id])
        
        # Kiểm tra cấu trúc bảng
        table_info = query_db("PRAGMA table_info(DichVuBaoGom)")
        
        return jsonify({
            'tour_id': tour_id,
            'services_count': len(services),
            'services': [dict(service) for service in services],
            'table_structure': [dict(col) for col in table_info]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API lấy danh sách đơn đặt tour
@app.route('/api/bookings')
def api_bookings():
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập để xem đơn đặt tour'}), 401
        
        user_id = session['user_id']
        
        # Lấy danh sách đơn đặt tour
        bookings = query_db('''
            SELECT d.*, t.ten_tour, t.dia_diem_khoi_hanh, t.dia_diem_den, 
                   t.ngay_khoi_hanh, t.ngay_ket_thuc,
                   (SELECT duong_dan FROM HinhAnhTour WHERE id_tour = t.id AND la_anh_chinh = 1 LIMIT 1) as hinh_anh
            FROM DonDatTour d
            JOIN Tour t ON d.id_tour = t.id
            WHERE d.id_khach_hang = ?
            ORDER BY d.ngay_dat DESC
        ''', [user_id])
        
        return jsonify({
            'success': True,
            'bookings': [dict(booking) for booking in bookings]
        })
        
    except Exception as e:
        print(f"Lỗi trong API bookings: {str(e)}")
        return jsonify({'error': 'Lỗi server khi tải đơn đặt tour'}), 500

# API hủy đơn đặt tour
@app.route('/api/bookings/<int:booking_id>/cancel', methods=['POST'])
def api_cancel_booking(booking_id):
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập'}), 401
        
        user_id = session['user_id']
        
        # Kiểm tra đơn đặt tour có tồn tại và thuộc về user không
        booking = query_db('SELECT * FROM DonDatTour WHERE id = ? AND id_khach_hang = ?', [booking_id, user_id], one=True)
        
        if not booking:
            return jsonify({'error': 'Không tìm thấy đơn đặt tour'}), 404
        
        # Kiểm tra trạng thái có thể hủy không
        if booking['trang_thai'] not in ['chờ xác nhận']:
            return jsonify({'error': 'Không thể hủy đơn đặt tour này'}), 400
        
        # Cập nhật trạng thái
        execute_db('UPDATE DonDatTour SET trang_thai = ? WHERE id = ?', ['đã hủy', booking_id])
        
        # Tạo thông báo
        tour = query_db('SELECT ten_tour FROM Tour WHERE id = ?', [booking['id_tour']], one=True)
        create_notification(
            user_id,
            'Đơn đặt tour đã hủy',
            f'Đơn đặt tour #{booking_id} - {tour["ten_tour"] if tour else "Tour"} đã được hủy thành công.',
            booking_id
        )
        
        return jsonify({
            'success': True,
            'message': 'Hủy đơn đặt tour thành công'
        })
        
    except Exception as e:
        print(f"Lỗi trong API cancel booking: {str(e)}")
        return jsonify({'error': 'Lỗi server khi hủy đơn đặt tour'}), 500

# API cập nhật profile
@app.route('/api/profile', methods=['PUT'])
def api_update_profile():
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập'}), 401
        
        user_id = session['user_id']
        data = request.json
        
        ho_ten = data.get('ho_ten')
        so_dien_thoai = data.get('so_dien_thoai')
        dia_chi = data.get('dia_chi')
        ngay_sinh = data.get('ngay_sinh')
        gioi_tinh = data.get('gioi_tinh')
        
        # Cập nhật thông tin
        execute_db('''
            UPDATE KhachHang 
            SET ho_ten = ?, so_dien_thoai = ?, dia_chi = ?, ngay_sinh = ?, gioi_tinh = ?
            WHERE id = ?
        ''', [ho_ten, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh, user_id])
        
        # Lấy thông tin đã cập nhật
        user = query_db('SELECT id, ho_ten, email, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh FROM KhachHang WHERE id = ?', [user_id], one=True)
        
        return jsonify({
            'success': True,
            'message': 'Cập nhật thông tin thành công',
            'user': dict(user)
        })
        
    except Exception as e:
        print(f"Lỗi trong API update profile: {str(e)}")
        return jsonify({'error': 'Lỗi server khi cập nhật thông tin'}), 500

# API đổi mật khẩu
@app.route('/api/change-password', methods=['POST'])
def api_change_password():
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập'}), 401
        
        user_id = session['user_id']
        data = request.json
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        
        if not current_password or not new_password or not confirm_password:
            return jsonify({'error': 'Vui lòng nhập đầy đủ thông tin'}), 400
        
        if new_password != confirm_password:
            return jsonify({'error': 'Mật khẩu mới và xác nhận mật khẩu không khớp'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'Mật khẩu mới phải có ít nhất 6 ký tự'}), 400
        
        # Lấy thông tin người dùng
        user = query_db('SELECT * FROM KhachHang WHERE id = ?', [user_id], one=True)
        if not user:
            return jsonify({'error': 'Không tìm thấy thông tin người dùng'}), 404
        
        # Kiểm tra mật khẩu hiện tại
        if current_password != user['mat_khau']:
            return jsonify({'error': 'Mật khẩu hiện tại không đúng'}), 400
        
        # Cập nhật mật khẩu mới
        execute_db('UPDATE KhachHang SET mat_khau = ? WHERE id = ?', [new_password, user_id])
        
        return jsonify({
            'success': True,
            'message': 'Đổi mật khẩu thành công'
        })
        
    except Exception as e:
        print(f"Lỗi trong API change password: {str(e)}")
        return jsonify({'error': 'Lỗi server khi đổi mật khẩu'}), 500

# =====================================================
# ADMIN API ROUTES FOR TOURS MANAGEMENT
# =====================================================

# API lấy danh sách tours cho admin
@app.route('/api/admin/tours', methods=['GET'])
def api_admin_tours():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Lấy danh sách tours với thông tin thống kê
        tours_query = '''
            SELECT t.*, 
                   COALESCE(c.ten_danh_muc, 'Chưa phân loại') as ten_danh_muc,
                   (SELECT COUNT(*) FROM DonDatTour WHERE id_tour = t.id) as so_don_dat,
                   (SELECT SUM(tong_tien) FROM DonDatTour WHERE id_tour = t.id AND trang_thai != 'đã hủy') as doanh_thu,
                   (SELECT COUNT(*) FROM DonDatTour WHERE id_tour = t.id AND trang_thai = 'đã xác nhận') as so_nguoi_da_dang_ky
            FROM Tour t
            LEFT JOIN DanhMucTour c ON t.id_danh_muc = c.id
            ORDER BY t.id DESC
        '''
        
        tours = query_db(tours_query)
        
        return jsonify({
            'success': True,
            'tours': [dict(tour) for tour in tours]
        })
        
    except Exception as e:
        print(f"Lỗi trong API admin tours: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API thêm tour mới
@app.route('/api/admin/tours', methods=['POST'])
def api_admin_add_tour():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        data = request.json
        
        # Validate dữ liệu đầu vào
        required_fields = ['ten_tour', 'gia_nguoi_lon', 'dia_diem_khoi_hanh', 'dia_diem_den', 'thoi_gian_tour', 'ngay_khoi_hanh', 'ngay_ket_thuc']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Thiếu thông tin: {field}'}), 400
        
        # Thêm tour mới
        tour_id = execute_db('''
            INSERT INTO Tour (
                ten_tour, mo_ta, gia_nguoi_lon, gia_tre_em, 
                dia_diem_khoi_hanh, dia_diem_den, thoi_gian_tour,
                so_nguoi_toi_da, ngay_khoi_hanh, ngay_ket_thuc, 
                trang_thai, ngay_tao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', [
            data.get('ten_tour'),
            data.get('mo_ta', ''),
            data.get('gia_nguoi_lon'),
            data.get('gia_tre_em'),
            data.get('dia_diem_khoi_hanh'),
            data.get('dia_diem_den'),
            data.get('thoi_gian_tour'),
            data.get('so_nguoi_toi_da'),
            data.get('ngay_khoi_hanh'),
            data.get('ngay_ket_thuc'),
            data.get('trang_thai', 'đang mở'),
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ])
        
        if tour_id:
            return jsonify({
                'success': True,
                'message': 'Thêm tour thành công',
                'tour_id': tour_id
            })
        else:
            return jsonify({'error': 'Không thể thêm tour'}), 500
            
    except Exception as e:
        print(f"Lỗi trong API add tour: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API cập nhật tour
@app.route('/api/admin/tours/<int:tour_id>', methods=['PUT'])
def api_admin_update_tour(tour_id):
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        data = request.json
        
        # Kiểm tra tour có tồn tại không
        existing_tour = query_db('SELECT id FROM Tour WHERE id = ?', [tour_id], one=True)
        if not existing_tour:
            return jsonify({'error': 'Tour không tồn tại'}), 404
        
        # Cập nhật tour
        execute_db('''
            UPDATE Tour SET 
                ten_tour = ?, mo_ta = ?, gia_nguoi_lon = ?, gia_tre_em = ?,
                dia_diem_khoi_hanh = ?, dia_diem_den = ?, thoi_gian_tour = ?,
                so_nguoi_toi_da = ?, ngay_khoi_hanh = ?, ngay_ket_thuc = ?,
                trang_thai = ?
            WHERE id = ?
        ''', [
            data.get('ten_tour'),
            data.get('mo_ta', ''),
            data.get('gia_nguoi_lon'),
            data.get('gia_tre_em'),
            data.get('dia_diem_khoi_hanh'),
            data.get('dia_diem_den'),
            data.get('thoi_gian_tour'),
            data.get('so_nguoi_toi_da'),
            data.get('ngay_khoi_hanh'),
            data.get('ngay_ket_thuc'),
            data.get('trang_thai', 'đang mở'),
            tour_id
        ])
        
        return jsonify({
            'success': True,
            'message': 'Cập nhật tour thành công'
        })
        
    except Exception as e:
        print(f"Lỗi trong API update tour: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API xóa tour
@app.route('/api/admin/tours/<int:tour_id>', methods=['DELETE'])
def api_admin_delete_tour(tour_id):
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Kiểm tra tour có tồn tại không
        existing_tour = query_db('SELECT id FROM Tour WHERE id = ?', [tour_id], one=True)
        if not existing_tour:
            return jsonify({'error': 'Tour không tồn tại'}), 404
        
        # Kiểm tra xem có đơn đặt tour nào không
        bookings = query_db('SELECT COUNT(*) as count FROM DonDatTour WHERE id_tour = ?', [tour_id], one=True)
        if bookings and bookings['count'] > 0:
            return jsonify({'error': 'Không thể xóa tour đã có đơn đặt'}), 400
        
        # Xóa các dữ liệu liên quan trước
        execute_db('DELETE FROM HinhAnhTour WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM DanhGiaTour WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM TourYeuThich WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM LichTrinhTour WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM DichVuBaoGom WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM LuuYTour WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM PhuThuTour WHERE id_tour = ?', [tour_id])
        execute_db('DELETE FROM HuongDanTour WHERE id_tour = ?', [tour_id])
        
        # Xóa tour
        execute_db('DELETE FROM Tour WHERE id = ?', [tour_id])
        
        return jsonify({
            'success': True,
            'message': 'Xóa tour thành công'
        })
        
    except Exception as e:
        print(f"Lỗi trong API delete tour: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API lấy danh sách khách hàng cho admin
@app.route('/api/admin/customers', methods=['GET'])
def api_admin_customers():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        customers_query = '''
            SELECT k.*, 
                   (SELECT COUNT(*) FROM DonDatTour WHERE id_khach_hang = k.id) as so_don_dat,
                   (SELECT SUM(tong_tien) FROM DonDatTour WHERE id_khach_hang = k.id AND trang_thai != 'đã hủy') as tong_chi_tieu
            FROM KhachHang k
            ORDER BY k.id DESC
        '''
        
        customers = query_db(customers_query)
        
        return jsonify({
            'success': True,
            'customers': [dict(customer) for customer in customers]
        })
        
    except Exception as e:
        print(f"Lỗi trong API admin customers: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API lấy danh sách đơn đặt tour cho admin
@app.route('/api/admin/bookings', methods=['GET'])
def api_admin_bookings():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        bookings_query = '''
            SELECT d.*, t.ten_tour, k.ho_ten, k.email, k.so_dien_thoai, t.dia_diem_den
            FROM DonDatTour d
            JOIN Tour t ON d.id_tour = t.id
            JOIN KhachHang k ON d.id_khach_hang = k.id
            ORDER BY d.ngay_dat DESC
        '''
        
        bookings = query_db(bookings_query)
        
        return jsonify({
            'success': True,
            'bookings': [dict(booking) for booking in bookings]
        })
        
    except Exception as e:
        print(f"Lỗi trong API admin bookings: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API cập nhật trạng thái đơn đặt tour - CẢI THIỆN VỚI THÔNG BÁO
@app.route('/api/admin/bookings/<int:booking_id>/status', methods=['PUT'])
def api_admin_update_booking_status(booking_id):
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        data = request.json
        new_status = data.get('trang_thai')
        
        if not new_status:
            return jsonify({'error': 'Thiếu thông tin trạng thái'}), 400
        
        # Lấy thông tin đơn đặt tour hiện tại
        booking = query_db('''
            SELECT d.*, t.ten_tour, k.ho_ten, k.email 
            FROM DonDatTour d
            JOIN Tour t ON d.id_tour = t.id
            JOIN KhachHang k ON d.id_khach_hang = k.id
            WHERE d.id = ?
        ''', [booking_id], one=True)
        
        if not booking:
            return jsonify({'error': 'Không tìm thấy đơn đặt tour'}), 404
        
        old_status = booking['trang_thai']
        
        # Cập nhật trạng thái
        execute_db('UPDATE DonDatTour SET trang_thai = ? WHERE id = ?', [new_status, booking_id])
        
        # Tạo thông báo cho khách hàng dựa trên trạng thái mới
        notification_messages = {
            'đã xác nhận': {
                'title': 'Đơn đặt tour đã được xác nhận',
                'content': f'Đơn đặt tour #{booking_id} - {booking["ten_tour"]} đã được xác nhận. Vui lòng chuẩn bị cho chuyến đi của bạn!'
            },
            'đã thanh toán': {
                'title': 'Thanh toán thành công',
                'content': f'Đơn đặt tour #{booking_id} - {booking["ten_tour"]} đã được thanh toán thành công. Chúng tôi sẽ liên hệ với bạn sớm!'
            },
            'đã hủy': {
                'title': 'Đơn đặt tour đã bị hủy',
                'content': f'Đơn đặt tour #{booking_id} - {booking["ten_tour"]} đã bị hủy. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.'
            },
            'hoàn thành': {
                'title': 'Chuyến đi hoàn thành',
                'content': f'Chuyến đi {booking["ten_tour"]} đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi! Hãy để lại đánh giá nhé.'
            }
        }
        
        # Gửi thông báo nếu trạng thái thay đổi và có thông báo tương ứng
        if old_status != new_status and new_status in notification_messages:
            msg = notification_messages[new_status]
            create_notification(
                booking['id_khach_hang'],
                msg['title'],
                msg['content'],
                booking_id
            )
        
        # Lấy thông tin admin để ghi log
        admin = query_db('SELECT ho_ten FROM Admin WHERE id = ?', [session['admin_id']], one=True)
        admin_name = admin['ho_ten'] if admin else 'Admin'
        
        # Ghi log hoạt động
        execute_db('''
            INSERT INTO LichSuHoatDong (id_khach_hang, hanh_dong, chi_tiet, ngay_tao)
            VALUES (?, ?, ?, ?)
        ''', [
            booking['id_khach_hang'], 
            'Cập nhật trạng thái đơn đặt tour',
            f'Đơn #{booking_id} được {admin_name} cập nhật từ "{old_status}" thành "{new_status}"',
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ])
        
        return jsonify({
            'success': True,
            'message': f'Cập nhật trạng thái thành công. Khách hàng đã được thông báo.',
            'old_status': old_status,
            'new_status': new_status
        })
        
    except Exception as e:
        print(f"Lỗi trong API update booking status: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API lấy thông báo cho khách hàng
@app.route('/api/notifications')
def api_notifications():
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập'}), 401
        
        user_id = session['user_id']
        
        # Lấy danh sách thông báo
        notifications = query_db('''
            SELECT * FROM ThongBao 
            WHERE id_khach_hang = ? 
            ORDER BY ngay_tao DESC 
            LIMIT 20
        ''', [user_id])
        
        # Đếm số thông báo chưa đọc
        unread_count = query_db('''
            SELECT COUNT(*) as count FROM ThongBao 
            WHERE id_khach_hang = ? AND da_doc = 0
        ''', [user_id], one=True)
        
        return jsonify({
            'success': True,
            'notifications': [dict(notification) for notification in notifications],
            'unread_count': unread_count['count'] if unread_count else 0
        })
        
    except Exception as e:
        print(f"Lỗi trong API notifications: {str(e)}")
        return jsonify({'error': 'Lỗi server khi tải thông báo'}), 500

# API đánh dấu thông báo đã đọc
@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
def api_mark_notification_read(notification_id):
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập'}), 401
        
        user_id = session['user_id']
        
        # Cập nhật trạng thái đã đọc
        execute_db('''
            UPDATE ThongBao SET da_doc = 1 
            WHERE id = ? AND id_khach_hang = ?
        ''', [notification_id, user_id])
        
        return jsonify({
            'success': True,
            'message': 'Đã đánh dấu thông báo đã đọc'
        })
        
    except Exception as e:
        print(f"Lỗi trong API mark notification read: {str(e)}")
        return jsonify({'error': 'Lỗi server'}), 500

# API đánh dấu tất cả thông báo đã đọc
@app.route('/api/notifications/read-all', methods=['PUT'])
def api_mark_all_notifications_read():
    try:
        # Kiểm tra đăng nhập
        if 'user_id' not in session:
            return jsonify({'error': 'Vui lòng đăng nhập'}), 401
        
        user_id = session['user_id']
        
        # Cập nhật tất cả thông báo thành đã đọc
        execute_db('''
            UPDATE ThongBao SET da_doc = 1 
            WHERE id_khach_hang = ? AND da_doc = 0
        ''', [user_id])
        
        return jsonify({
            'success': True,
            'message': 'Đã đánh dấu tất cả thông báo đã đọc'
        })
        
    except Exception as e:
        print(f"Lỗi trong API mark all notifications read: {str(e)}")
        return jsonify({'error': 'Lỗi server'}), 500

# API lấy danh sách đánh giá cho admin
@app.route('/api/admin/reviews', methods=['GET'])
def api_admin_reviews():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Lấy tham số phân trang và lọc
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        offset = (page - 1) * limit
        
        tour_id = request.args.get('tour_id')
        rating = request.args.get('rating')
        status = request.args.get('status', 'all')
        
        # Xây dựng câu truy vấn
        query = '''
            SELECT d.*, t.ten_tour, k.ho_ten, k.email,
                   CASE 
                       WHEN d.diem_danh_gia >= 4 THEN 'positive'
                       WHEN d.diem_danh_gia >= 3 THEN 'neutral'
                       ELSE 'negative'
                   END as sentiment
            FROM DanhGiaTour d
            JOIN Tour t ON d.id_tour = t.id
            JOIN KhachHang k ON d.id_khach_hang = k.id
            WHERE 1=1
        '''
        
        params = []
        
        # Thêm điều kiện lọc
        if tour_id:
            query += ' AND d.id_tour = ?'
            params.append(tour_id)
        
        if rating:
            query += ' AND d.diem_danh_gia = ?'
            params.append(rating)
        
        # Đếm tổng số đánh giá
        count_query = f'SELECT COUNT(*) as total FROM ({query})'
        total_result = query_db(count_query, params, one=True)
        total = total_result['total'] if total_result else 0
        
        # Thêm sắp xếp và phân trang
        query += ' ORDER BY d.ngay_danh_gia DESC LIMIT ? OFFSET ?'
        params.extend([limit, offset])
        
        reviews = query_db(query, params)
        
        return jsonify({
            'success': True,
            'reviews': [dict(review) for review in reviews],
            'total': total,
            'page': page,
            'per_page': limit,
            'total_pages': (total + limit - 1) // limit if total > 0 else 0
        })
        
    except Exception as e:
        print(f"Lỗi trong API admin reviews: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API xóa đánh giá
@app.route('/api/admin/reviews/<int:review_id>', methods=['DELETE'])
def api_admin_delete_review(review_id):
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Kiểm tra đánh giá có tồn tại không
        review = query_db('SELECT * FROM DanhGiaTour WHERE id = ?', [review_id], one=True)
        if not review:
            return jsonify({'error': 'Không tìm thấy đánh giá'}), 404
        
        # Xóa đánh giá
        execute_db('DELETE FROM DanhGiaTour WHERE id = ?', [review_id])
        
        # Ghi log hoạt động
        admin = query_db('SELECT ho_ten FROM Admin WHERE id = ?', [session['admin_id']], one=True)
        admin_name = admin['ho_ten'] if admin else 'Admin'
        
        execute_db('''
            INSERT INTO LichSuHoatDong (id_khach_hang, hanh_dong, chi_tiet, ngay_tao)
            VALUES (?, ?, ?, ?)
        ''', [
            review['id_khach_hang'], 
            'Đánh giá bị xóa bởi admin',
            f'Đánh giá #{review_id} bị xóa bởi {admin_name}',
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ])
        
        return jsonify({
            'success': True,
            'message': 'Xóa đánh giá thành công'
        })
        
    except Exception as e:
        print(f"Lỗi trong API delete review: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API thống kê đánh giá
@app.route('/api/admin/reviews/stats')
def api_admin_reviews_stats():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Thống kê tổng quan
        total_reviews = query_db('SELECT COUNT(*) as count FROM DanhGiaTour', one=True)
        avg_rating = query_db('SELECT AVG(diem_danh_gia) as avg FROM DanhGiaTour', one=True)
        
        # Thống kê theo điểm đánh giá
        rating_stats = query_db('''
            SELECT diem_danh_gia, COUNT(*) as so_luong
            FROM DanhGiaTour
            GROUP BY diem_danh_gia
            ORDER BY diem_danh_gia DESC
        ''')
        
        # Thống kê theo tháng (6 tháng gần nhất)
        monthly_stats = query_db('''
            SELECT 
                strftime('%Y-%m', ngay_danh_gia) as thang,
                COUNT(*) as so_danh_gia,
                AVG(diem_danh_gia) as diem_trung_binh
            FROM DanhGiaTour
            WHERE ngay_danh_gia >= date('now', '-6 months')
            GROUP BY strftime('%Y-%m', ngay_danh_gia)
            ORDER BY thang ASC
        ''')
        
        # Top tour có đánh giá cao nhất
        top_rated_tours = query_db('''
            SELECT 
                t.id, t.ten_tour,
                COUNT(d.id) as so_danh_gia,
                AVG(d.diem_danh_gia) as diem_trung_binh
            FROM Tour t
            LEFT JOIN DanhGiaTour d ON t.id = d.id_tour
            GROUP BY t.id, t.ten_tour
            HAVING COUNT(d.id) >= 3
            ORDER BY AVG(d.diem_danh_gia) DESC, COUNT(d.id) DESC
            LIMIT 5
        ''')
        
        # Top tour có đánh giá thấp nhất
        low_rated_tours = query_db('''
            SELECT 
                t.id, t.ten_tour,
                COUNT(d.id) as so_danh_gia,
                AVG(d.diem_danh_gia) as diem_trung_binh
            FROM Tour t
            LEFT JOIN DanhGiaTour d ON t.id = d.id_tour
            GROUP BY t.id, t.ten_tour
            HAVING COUNT(d.id) >= 3
            ORDER BY AVG(d.diem_danh_gia) ASC, COUNT(d.id) DESC
            LIMIT 5
        ''')
        
        return jsonify({
            'success': True,
            'stats': {
                'total_reviews': total_reviews['count'] if total_reviews else 0,
                'average_rating': round(avg_rating['avg'], 2) if avg_rating and avg_rating['avg'] else 0,
                'rating_distribution': [dict(stat) for stat in rating_stats],
                'monthly_stats': [dict(stat) for stat in monthly_stats],
                'top_rated_tours': [dict(tour) for tour in top_rated_tours],
                'low_rated_tours': [dict(tour) for tour in low_rated_tours]
            }
        })
        
    except Exception as e:
        print(f"Lỗi trong API reviews stats: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API báo cáo doanh thu dashboard
@app.route('/api/admin/reports/dashboard')
def api_admin_reports_dashboard():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Thống kê tổng quan
        total_tours = query_db('SELECT COUNT(*) as count FROM Tour', one=True)
        total_customers = query_db('SELECT COUNT(*) as count FROM KhachHang', one=True)
        total_bookings = query_db('SELECT COUNT(*) as count FROM DonDatTour', one=True)
        total_revenue = query_db('''
            SELECT SUM(tong_tien) as total 
            FROM DonDatTour 
            WHERE trang_thai != 'đã hủy'
        ''', one=True)
        
        # Thống kê theo trạng thái đơn đặt
        booking_status = query_db('''
            SELECT trang_thai, COUNT(*) as so_luong
            FROM DonDatTour
            GROUP BY trang_thai
            ORDER BY so_luong DESC
        ''')
        
        # Thống kê theo tháng (6 tháng gần nhất)
        monthly_stats = query_db('''
            SELECT 
                strftime('%Y-%m', ngay_dat) as thang,
                COUNT(*) as so_don,
                SUM(CASE WHEN trang_thai != 'đã hủy' THEN tong_tien ELSE 0 END) as doanh_thu
            FROM DonDatTour
            WHERE ngay_dat >= date('now', '-6 months')
            GROUP BY strftime('%Y-%m', ngay_dat)
            ORDER BY thang ASC
        ''')
        
        # Top 5 tour được đặt nhiều nhất
        top_tours = query_db('''
            SELECT 
                t.id, t.ten_tour,
                COUNT(d.id) as so_don_dat,
                SUM(CASE WHEN d.trang_thai != 'đã hủy' THEN d.tong_tien ELSE 0 END) as doanh_thu
            FROM Tour t
            LEFT JOIN DonDatTour d ON t.id = d.id_tour
            GROUP BY t.id, t.ten_tour
            ORDER BY COUNT(d.id) DESC
            LIMIT 5
        ''')
        
        return jsonify({
            'success': True,
            'stats': {
                'total_tours': total_tours['count'] if total_tours else 0,
                'total_customers': total_customers['count'] if total_customers else 0,
                'total_bookings': total_bookings['count'] if total_bookings else 0,
                'total_revenue': total_revenue['total'] if total_revenue and total_revenue['total'] else 0,
                'booking_status': [dict(status) for status in booking_status],
                'monthly_stats': [dict(stat) for stat in monthly_stats],
                'top_tours': [dict(tour) for tour in top_tours]
            }
        })
        
    except Exception as e:
        print(f"Lỗi trong API reports dashboard: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API báo cáo doanh thu theo thời gian
@app.route('/api/admin/reports/revenue')
def api_admin_reports_revenue():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        period = request.args.get('period', 'month')  # month, week, day, year
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        
        # Xây dựng câu truy vấn dựa trên period
        if period == 'day':
            date_format = '%Y-%m-%d'
            group_by = "strftime('%Y-%m-%d', ngay_dat)"
        elif period == 'week':
            date_format = '%Y-W%W'
            group_by = "strftime('%Y-W%W', ngay_dat)"
        elif period == 'year':
            date_format = '%Y'
            group_by = "strftime('%Y', ngay_dat)"
        else:  # month
            date_format = '%Y-%m'
            group_by = "strftime('%Y-%m', ngay_dat)"
        
        query = f'''
            SELECT 
                {group_by} as period,
                COUNT(*) as so_don,
                SUM(CASE WHEN trang_thai != 'đã hủy' THEN tong_tien ELSE 0 END) as doanh_thu,
                COUNT(CASE WHEN trang_thai = 'đã thanh toán' THEN 1 END) as don_thanh_toan,
                COUNT(CASE WHEN trang_thai = 'đã hủy' THEN 1 END) as don_huy
            FROM DonDatTour
            WHERE 1=1
        '''
        
        params = []
        
        if from_date:
            query += ' AND date(ngay_dat) >= ?'
            params.append(from_date)
        
        if to_date:
            query += ' AND date(ngay_dat) <= ?'
            params.append(to_date)
        
        query += f' GROUP BY {group_by} ORDER BY period ASC'
        
        revenue_data = query_db(query, params)
        
        return jsonify({
            'success': True,
            'data': [dict(row) for row in revenue_data],
            'period': period
        })
        
    except Exception as e:
        print(f"Lỗi trong API reports revenue: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API báo cáo chi tiết theo tour
@app.route('/api/admin/reports/tours')
def api_admin_reports_tours():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Báo cáo chi tiết theo từng tour
        tours_report = query_db('''
            SELECT 
                t.id,
                t.ten_tour,
                t.gia_nguoi_lon,
                t.dia_diem_den,
                t.ngay_khoi_hanh,
                COUNT(d.id) as so_don_dat,
                SUM(CASE WHEN d.trang_thai != 'đã hủy' THEN d.tong_tien ELSE 0 END) as doanh_thu,
                SUM(CASE WHEN d.trang_thai != 'đã hủy' THEN d.so_nguoi_lon + d.so_tre_em ELSE 0 END) as so_khach,
                COUNT(CASE WHEN d.trang_thai = 'đã thanh toán' THEN 1 END) as don_thanh_toan,
                COUNT(CASE WHEN d.trang_thai = 'đã hủy' THEN 1 END) as don_huy,
                AVG(CASE WHEN dg.diem_danh_gia IS NOT NULL THEN dg.diem_danh_gia END) as diem_danh_gia_tb,
                COUNT(dg.id) as so_danh_gia
            FROM Tour t
            LEFT JOIN DonDatTour d ON t.id = d.id_tour
            LEFT JOIN DanhGiaTour dg ON t.id = dg.id_tour
            GROUP BY t.id, t.ten_tour, t.gia_nguoi_lon, t.dia_diem_den, t.ngay_khoi_hanh
            ORDER BY doanh_thu DESC
        ''')
        
        return jsonify({
            'success': True,
            'tours': [dict(tour) for tour in tours_report]
        })
        
    except Exception as e:
        print(f"Lỗi trong API reports tours: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API báo cáo khách hàng
@app.route('/api/admin/reports/customers')
def api_admin_reports_customers():
    try:
        # Kiểm tra quyền admin
        if 'admin_id' not in session:
            return jsonify({'error': 'Không có quyền truy cập'}), 401
        
        # Top khách hàng chi tiêu nhiều nhất
        top_customers = query_db('''
            SELECT 
                k.id,
                k.ho_ten,
                k.email,
                k.so_dien_thoai,
                COUNT(d.id) as so_don_dat,
                SUM(CASE WHEN d.trang_thai != 'đã hủy' THEN d.tong_tien ELSE 0 END) as tong_chi_tieu,
                MAX(d.ngay_dat) as lan_dat_cuoi
            FROM KhachHang k
            LEFT JOIN DonDatTour d ON k.id = d.id_khach_hang
            GROUP BY k.id, k.ho_ten, k.email, k.so_dien_thoai
            HAVING COUNT(d.id) > 0
            ORDER BY tong_chi_tieu DESC
            LIMIT 20
        ''')
        
        # Thống kê khách hàng mới theo tháng
        new_customers_monthly = query_db('''
            SELECT 
                strftime('%Y-%m', ngay_tao) as thang,
                COUNT(*) as so_khach_moi
            FROM KhachHang
            WHERE ngay_tao >= date('now', '-12 months')
            GROUP BY strftime('%Y-%m', ngay_tao)
            ORDER BY thang ASC
        ''')
        
        return jsonify({
            'success': True,
            'top_customers': [dict(customer) for customer in top_customers],
            'new_customers_monthly': [dict(stat) for stat in new_customers_monthly]
        })
        
    except Exception as e:
        print(f"Lỗi trong API reports customers: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# Khởi chạy ứng dụng
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  
    app.run(host='0.0.0.0', port=port)

