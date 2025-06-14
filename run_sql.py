import sqlite3
import os
import re

# Đường dẫn hiện tại
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, 'tour_management.db')
sql_path = os.path.join(current_dir, 'sample_data.sql')

# Kết nối đến cơ sở dữ liệu
conn = sqlite3.connect(db_path)
# Đảm bảo SQLite trả về text dưới dạng chuỗi Unicode
conn.text_factory = lambda x: str(x, 'utf-8', errors='ignore')
cursor = conn.cursor()

# Thiết lập encoding cho SQLite
cursor.execute("PRAGMA encoding = 'UTF-8'")

# Đọc file SQL
with open(sql_path, 'r', encoding='utf-8') as sql_file:
    sql_script = sql_file.read()

# Tiền xử lý script SQL để loại bỏ tiền tố N'' (SQLite không cần tiền tố này)
# Thay thế N'chuỗi' bằng 'chuỗi'
sql_script = re.sub(r"N'(.*?)'", r"'\1'", sql_script)

# Thực thi script SQL
try:
    # Chia nhỏ script thành các câu lệnh riêng biệt
    # Điều này giúp xử lý lỗi tốt hơn và hiển thị dòng gặp lỗi
    for statement in sql_script.split(';'):
        if statement.strip():
            try:
                cursor.execute(statement)
                print(f"Executed: {statement[:50]}...")
            except sqlite3.Error as stmt_error:
                print(f"Error executing statement: {stmt_error}")
                print(f"Statement: {statement}")
    
    conn.commit()
    print("\nSQL script executed successfully")
    
    # Hiển thị số lượng bản ghi trong các bảng
    # Cập nhật danh sách bảng để bao gồm các bảng mới
    tables = [
        'DanhMucTour', 'Tour', 'DichVuPhuTro', 'KhachHang', 
        'DonDatTour', 'ChiTietDonDatTour', 'HinhAnhTour', 'DanhGiaTour',
        'LichTrinhTour', 'DichVuBaoGom', 'LuuYTour', 'PhuThuTour', 'HuongDanTour'
    ]
    print("\nTable record counts:")
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"{table}: {count} records")
        except sqlite3.Error as table_error:
            print(f"{table}: Error - {table_error}")
        
    # Kiểm tra dữ liệu tiếng Việt
    print("\nKiểm tra dữ liệu tiếng Việt:")
    cursor.execute("SELECT ho_ten FROM KhachHang LIMIT 3")
    for row in cursor.fetchall():
        print(f"Tên khách hàng: {row[0]}")
    
    # Kiểm tra dữ liệu tiếng Việt trong bảng Tour
    print("\nKiểm tra dữ liệu tiếng Việt trong bảng Tour:")
    cursor.execute("SELECT ten_tour FROM Tour LIMIT 3")
    for row in cursor.fetchall():
        print(f"Tên tour: {row[0]}")
    
    # Kiểm tra dữ liệu trong bảng LichTrinhTour
    print("\nKiểm tra dữ liệu trong bảng LichTrinhTour:")
    try:
        cursor.execute("SELECT tieu_de FROM LichTrinhTour LIMIT 3")
        for row in cursor.fetchall():
            print(f"Tiêu đề lịch trình: {row[0]}")
    except sqlite3.Error:
        print("Bảng LichTrinhTour chưa có dữ liệu hoặc chưa được tạo")
        
except sqlite3.Error as e:
    print(f"Error executing SQL script: {e}")
finally:
    conn.close()
