# API Endpoints cho Apriori Engine
# Thêm vào file app.py

# API để lấy dữ liệu giao dịch cho Apriori
@app.route('/api/apriori/transactions')
def api_apriori_transactions():
    try:
        tour_id = request.args.get('tour_id')
        limit = request.args.get('limit', 1000, type=int)
        
        # Base query để lấy dữ liệu giao dịch
        query = '''
            SELECT 
                d.id as booking_id,
                d.id_tour as tour_id,
                d.id_khach_hang as customer_id,
                d.ngay_dat as booking_date,
                d.so_nguoi_lon + d.so_tre_em as group_size,
                t.dia_diem_khoi_hanh as departure_location,
                t.ngay_khoi_hanh as tour_date,
                GROUP_CONCAT(ct.id_dich_vu_phu_tro) as services
            FROM DonDatTour d
            JOIN Tour t ON d.id_tour = t.id
            LEFT JOIN ChiTietDonDatTour ct ON d.id = ct.id_don_dat_tour
            WHERE d.trang_thai != 'đã hủy'
        '''
        
        params = []
        
        if tour_id:
            query += ' AND d.id_tour = ?'
            params.append(tour_id)
        
        query += '''
            GROUP BY d.id
            ORDER BY d.ngay_dat DESC
            LIMIT ?
        '''
        params.append(limit)
        
        transactions = query_db(query, params)
        
        # Xử lý dữ liệu
        processed_transactions = []
        for transaction in transactions:
            # Xác định mùa dựa trên ngày tour
            season = get_season_from_date(transaction['tour_date'])
            
            # Xử lý services
            services = []
            if transaction['services']:
                services = [s.strip() for s in transaction['services'].split(',') if s.strip()]
            
            processed_transactions.append({
                'booking_id': transaction['booking_id'],
                'tour_id': transaction['tour_id'],
                'customer_id': transaction['customer_id'],
                'booking_date': transaction['booking_date'],
                'group_size': transaction['group_size'],
                'departure_location': transaction['departure_location'],
                'season': season,
                'services': services
            })
        
        return jsonify({
            'success': True,
            'transactions': processed_transactions,
            'total': len(processed_transactions)
        })
        
    except Exception as e:
        print(f"Lỗi trong API apriori transactions: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# Helper function để xác định mùa
def get_season_from_date(date_string):
    if not date_string:
        return 'unknown'
    
    try:
        date = datetime.strptime(date_string, '%Y-%m-%d')
        month = date.month
        
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        else:
            return 'autumn'
    except:
        return 'unknown'

# API để lấy thông tin dịch vụ
@app.route('/api/services/<int:service_id>')
def api_service_detail(service_id):
    try:
        service = query_db('SELECT * FROM DichVuPhuTro WHERE id = ?', [service_id], one=True)
        
        if not service:
            return jsonify({'error': 'Dịch vụ không tồn tại'}), 404
        
        return jsonify(dict(service))
        
    except Exception as e:
        print(f"Lỗi trong API service detail: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

# API để lưu combo selection vào session
@app.route('/api/combo/save-selection', methods=['POST'])
def api_save_combo_selection():
    try:
        data = request.json
        tour_id = data.get('tour_id')
        selected_services = data.get('selected_services', [])
        
        # Lưu vào session
        if 'combo_selections' not in session:
            session['combo_selections'] = {}
        
        session['combo_selections'][str(tour_id)] = selected_services
        session.modified = True
        
        return jsonify({
            'success': True,
            'message': 'Đã lưu lựa chọn combo'
        })
        
    except Exception as e:
        print(f"Lỗi khi lưu combo selection: {str(e)}")
        return jsonify({'error': 'Lỗi server'}), 500

# API để tính giá combo với discount
@app.route('/api/combo/calculate-price', methods=['POST'])
def api_calculate_combo_price():
    try:
        data = request.json
        tour_id = data.get('tour_id')
        selected_services = data.get('selected_services', [])
        adults = data.get('adults', 1)
        children = data.get('children', 0)
        
        # Lấy giá tour
        tour = query_db('SELECT * FROM Tour WHERE id = ?', [tour_id], one=True)
        if not tour:
            return jsonify({'error': 'Tour không tồn tại'}), 404
        
        # Tính giá tour
        tour_total = tour['gia_nguoi_lon'] * adults
        if children > 0 and tour['gia_tre_em']:
            tour_total += tour['gia_tre_em'] * children
        
        # Tính giá dịch vụ
        services_total = 0
        service_details = []
        
        for service_id in selected_services:
            service = query_db('SELECT * FROM DichVuPhuTro WHERE id = ?', [service_id], one=True)
            if service:
                service_price = service['gia'] * adults
                services_total += service_price
                service_details.append({
                    'id': service_id,
                    'name': service['ten_dich_vu'],
                    'unit_price': service['gia'],
                    'total_price': service_price,
                    'quantity': adults
                })
        
        # Tính discount dựa trên số lượng dịch vụ
        discount_rate = 0
        if len(selected_services) >= 3:
            discount_rate = 0.15  # 15% cho 3+ dịch vụ
        elif len(selected_services) >= 2:
            discount_rate = 0.10  # 10% cho 2 dịch vụ
        
        # Áp dụng discount chỉ cho dịch vụ
        discount_amount = services_total * discount_rate
        final_services_total = services_total - discount_amount
        
        # Tổng cuối cùng
        final_total = tour_total + final_services_total
        
        return jsonify({
            'success': True,
            'pricing': {
                'tour_total': tour_total,
                'services_original_total': services_total,
                'discount_rate': discount_rate,
                'discount_amount': discount_amount,
                'services_final_total': final_services_total,
                'final_total': final_total,
                'service_details': service_details
            }
        })
        
    except Exception as e:
        print(f"Lỗi khi tính giá combo: {str(e)}")
        return jsonify({'error': 'Lỗi server'}), 500
