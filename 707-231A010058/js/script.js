// =========================================================
// BÀI 1: DANH SÁCH SẢN PHẨM & TÌM KIẾM
// =========================================================

const products = [
    { id: 1, name: "Laptop Gaming X500", price: 25000000 },
    { id: 2, name: "Chuột Không Dây Silent Pro", price: 500000 },
    { id: 3, name: "Bàn Phím Cơ RK900", price: 1200000 },
    { id: 4, name: "Màn Hình Cong 32 Inch 4K", price: 9800000 },
    { id: 5, name: "Tai Nghe Bluetooth AirX", price: 850000 },
    { id: 6, name: "Ổ Cứng SSD 1TB Samsung", price: 1800000 }
];

function renderProducts(productArray) {
    const listContainer = document.getElementById('productList');
    const notFoundMsg = document.getElementById('notFoundMessage');
    
    if (!listContainer || !notFoundMsg) return;

    listContainer.innerHTML = '';
    notFoundMsg.textContent = '';

    if (productArray.length === 0) {
        notFoundMsg.textContent = "❌ Không tìm thấy sản phẩm nào khớp với từ khóa.";
        return;
    }

    productArray.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Giá: ${product.price.toLocaleString('vi-VN')} VNĐ</p>
        `;
        listContainer.appendChild(productDiv);
    });
}

function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(lowerCaseSearchTerm);
    });

    renderProducts(filteredProducts);
}

function initProductSearch() {
    renderProducts(products); 

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}


// ... (Giả sử code Bài 1 và các code khác nằm phía trên) ...

// =========================================================
// BÀI 2: FORM ĐĂNG KÝ & VALIDATION
// =========================================================

// Regex kiểm tra Email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Regex kiểm tra Mật khẩu hợp lệ: Ít nhất 8 ký tự, có hoa/thường/số
function isValidPassword(password) {
    // (?=.*[a-z]): phải chứa ít nhất 1 chữ thường
    // (?=.*[A-Z]): phải chứa ít nhất 1 chữ hoa
    // (?=.*\d): phải chứa ít nhất 1 số
    // [a-zA-Z\d]{8,}: độ dài tối thiểu 8 ký tự, chỉ chứa chữ cái và số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}

function handleFormSubmit(event) {
    // 🔥 FIX QUAN TRỌNG: Ngăn form submit mặc định và tải lại trang
    event.preventDefault(); 

    // Lấy giá trị
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Reset thông báo lỗi/thành công
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    document.getElementById('successMessage').textContent = '';

    // 1. Validation Tên
    if (name.length < 2) {
        document.getElementById('nameError').textContent = "Tên phải có ít nhất 2 ký tự.";
        isValid = false;
    }
    
    // 2. Validation Email
    if (!isValidEmail(email)) {
        document.getElementById('emailError').textContent = "Email không hợp lệ (ví dụ: user@example.com).";
        isValid = false;
    }

    // 3. Validation Mật khẩu
    if (!isValidPassword(password)) {
        document.getElementById('passwordError').textContent = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.";
        isValid = false;
    }

    // 4. Validation Checkbox
    if (!terms) {
        document.getElementById('termsError').textContent = "Vui lòng đồng ý Điều khoản Dịch vụ.";
        isValid = false;
    }

    // Xử lý thành công và lưu LocalStorage (Chỉ khi isValid = true)
    if (isValid) {
        // Xử lý bảo mật dữ liệu cục bộ: Không lưu plaintext password!
        const userData = {
            name: name,
            email: email,
            // MINH HỌA: Lưu chuỗi hash/demo thay vì mật khẩu gốc
            password_security_demo: '*** [Mật khẩu đã được xử lý]', 
            timestamp: new Date().toISOString()
        };

        // Lưu object đã JSON.stringify vào LocalStorage
        localStorage.setItem('currentUserData', JSON.stringify(userData));

        // Hiển thị thông báo thành công và reset form
        document.getElementById('successMessage').textContent = "✅ Đăng ký thành công! Dữ liệu đã được lưu cục bộ.";
        document.getElementById('registrationForm').reset(); 
    }
}

// Hàm khởi tạo: Gắn Event Listener
function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        // Gắn sự kiện submit vào form
        form.addEventListener('submit', handleFormSubmit);
    }
}

// ... (Các code Bài 1 và Bài 2 ở trên) ...

// =========================================================
// BÀI 3: ĐỒNG HỒ ĐẾM NGƯỢC (COUNTDOWN TIMER)
// =========================================================

let countdownInterval;
const initialTimeInSeconds = 10 * 60; // 10 phút
let timeRemaining = initialTimeInSeconds;
let isPaused = true; // Ban đầu coi như đang tạm dừng (chưa chạy)

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

function updateTimer() {
    const display = document.getElementById('timerDisplay');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    
    if (timeRemaining <= 0) {
        // 🔥 Ngừng chạy interval ngay lập tức
        clearInterval(countdownInterval); 
        
        display.textContent = "00:00";
        display.classList.remove('warning-animation');
        
        // Cập nhật trạng thái nút
        if (startButton) startButton.textContent = "BẮT ĐẦU LẠI 🔄";
        if (pauseButton) pauseButton.disabled = true;

        showModal();
        return;
    }
    
    timeRemaining--;
    display.textContent = formatTime(timeRemaining);
    
    // Thêm animation cảnh báo khi dưới 1 phút (60 giây)
    if (timeRemaining < 60) {
        display.classList.add('warning-animation');
    } else {
        display.classList.remove('warning-animation');
    }
}

function showModal() {
    const modal = document.getElementById('modalAlert');
    if (modal) modal.style.display = 'block';
}

function hideModal() {
    const modal = document.getElementById('modalAlert');
    if (modal) modal.style.display = 'none';
}

function initCountdownTimer() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton'); 
    const display = document.getElementById('timerDisplay');
    const closeButton = document.querySelector('.close-button');
    const modal = document.getElementById('modalAlert');
    
    if (!display || !startButton || !pauseButton) return;
    
    // Khởi tạo trạng thái ban đầu
    display.textContent = formatTime(initialTimeInSeconds);
    pauseButton.disabled = true; 
    
    // --- LOGIC DỪNG/TIẾP TỤC (Pause/Resume) ---
    pauseButton.addEventListener('click', () => {
        if (!isPaused) {
            // Đang chạy -> Dừng
            clearInterval(countdownInterval);
            isPaused = true;
            pauseButton.textContent = "Tiếp tục ▶️";
            pauseButton.classList.add('paused');
            display.style.opacity = '0.7'; // Hiệu ứng mờ khi dừng
            
        } else {
            // Đang dừng -> Tiếp tục
            countdownInterval = setInterval(updateTimer, 1000);
            isPaused = false;
            pauseButton.textContent = "Dừng ⏸️";
            pauseButton.classList.remove('paused');
            display.style.opacity = '1';
        }
    });

    // --- LOGIC BẮT ĐẦU LẠI (Reset/Start) ---
    startButton.addEventListener('click', () => {
        clearInterval(countdownInterval); // Dừng mọi hoạt động cũ
        
        // Reset thời gian và trạng thái
        timeRemaining = initialTimeInSeconds;
        isPaused = false;
        
        // Khởi động
        countdownInterval = setInterval(updateTimer, 1000);
        
        // Cập nhật giao diện
        display.textContent = formatTime(timeRemaining);
        display.classList.remove('warning-animation');
        display.style.opacity = '1';
        
        startButton.textContent = "Đang Chạy...";
        pauseButton.disabled = false; // Kích hoạt nút Dừng
        pauseButton.textContent = "Dừng ⏸️";
        pauseButton.classList.remove('paused');
    });

    // Xử lý đóng modal
    if (closeButton) closeButton.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) hideModal();
    });
}