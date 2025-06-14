import sqlite3
import os
import sys
import re

# Đường dẫn hiện tại
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, 'tour_management.db')
schema_path = os.path.join(current_dir, 'schema.sql')
sample_data_path = os.path.join(current_dir, 'sample_data.sql')

# Kiểm tra xem file database đã tồn tại chưa
if os.path.exists(db_path):
    print(f"Database file already exists at {db_path}")
    choice = input("Do you want to recreate the database? (y/n): ")
    if choice.lower() != 'y':
        print("Database initialization cancelled.")
        sys.exit(0)
    else:
        os.remove(db_path)
        print("Existing database removed.")

# Kết nối đến cơ sở dữ liệu (sẽ tạo mới nếu chưa tồn tại)
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Thiết lập encoding cho SQLite
cursor.execute("PRAGMA encoding = 'UTF-8'")

# Đọc file schema SQL
with open(schema_path, 'r', encoding='utf-8') as schema_file:
    schema_script = schema_file.read()

# Thực thi script SQL để tạo các bảng
try:
    cursor.executescript(schema_script)
    conn.commit()
    print(f"Database schema initialized successfully at {db_path}")
    
    # Kiểm tra các bảng đã được tạo
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print("\nCreated tables:")
    for table in tables:
        print(f"- {table[0]}")
    
    # Hỏi người dùng có muốn thêm dữ liệu mẫu không
    choice = input("\nDo you want to add sample data? (y/n): ")
    if choice.lower() == 'y':
        # Đọc file dữ liệu mẫu SQL
        if os.path.exists(sample_data_path):
            with open(sample_data_path, 'r', encoding='utf-8') as sample_data_file:
                sample_data_script = sample_data_file.read()
            
            # Tiền xử lý script SQL để loại bỏ tiền tố N'' (SQLite không cần tiền tố này)
            sample_data_script = re.sub(r"N'(.*?)'", r"'\1'", sample_data_script)
            
            # Thực thi script SQL để thêm dữ liệu mẫu
            try:
                # Chia nhỏ script thành các câu lệnh riêng biệt
                for statement in sample_data_script.split(';'):
                    if statement.strip():
                        try:
                            cursor.execute(statement)
                            print(f"Executed: {statement[:50]}...")
                        except sqlite3.Error as stmt_error:
                            print(f"Error executing statement: {stmt_error}")
                            print(f"Statement: {statement}")
                
                conn.commit()
                print("\nSample data added successfully")
                
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
                print(f"Error adding sample data: {e}")
        else:
            print(f"Sample data file not found at {sample_data_path}")
    
except sqlite3.Error as e:
    print(f"Error initializing database: {e}")
finally:
    conn.close()

print("\nDatabase initialization completed.")
