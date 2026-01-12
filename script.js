// 1. PRELOADER HIDE
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden'; // Sembunyikan sepenuhnya
    setTimeout(() => preloader.style.display = 'none', 500); // Hapus dari DOM setelah animasi
});

// 2. CUSTOM CURSOR MOVEMENT
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', moveCursor);
window.addEventListener('touchmove', moveCursor); // Tambahkan ini buat HP

function moveCursor(e) {
    // Ambil posisi dari mouse ATAU dari sentuhan jari
    const posX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const posY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Lingkaran besar mengikuti dengan sedikit animasi (biar halus)
    outline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
}

// Fungsi Gerak di HP (Sentuhan Jari)
window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    
    outline.style.left = `${x}px`;
    outline.style.top = `${y}px`;
});

// 3. TYPING EFFECT (Untuk Nama Kamu)
const typingElement = document.getElementById('typing-name');
const myName = "Halo, Saya Luthfia Agustina,"; // Ubah ini dengan nama kamu
let charIndex = 0;

function typeEffect() {
    if (charIndex < myName.length) {
        typingElement.innerHTML += myName.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    } else {
        // Setelah nama selesai diketik, tambahkan teks berikutnya
        const taglineText = " seorang Creative Developer."; // Tambah tag line setelah nama
        let taglineIndex = 0;
        const taglineInterval = setInterval(() => {
            if (taglineIndex < taglineText.length) {
                typingElement.innerHTML += taglineText.charAt(taglineIndex);
                taglineIndex++;
            } else {
                clearInterval(taglineInterval);
            }
        }, 80); // Kecepatan ketik tag line
    }
}
window.onload = typeEffect;

// 4. DARK MODE TOGGLE
const btnToggle = document.getElementById('dark-mode-toggle');
btnToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = btnToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// 5. SCROLL ANIMATION (Progress Bar & Reveal)
const progressFills = document.querySelectorAll('.progress-fill');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            bar.style.width = bar.getAttribute('data-percent');
        }
    });
}, { threshold: 0.5 }); // Memulai animasi saat 50% elemen terlihat

progressFills.forEach(fill => observer.observe(fill));

// 6. SMOOTH SCROLL FOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Dapatkan target elemen
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Hitung offset agar tidak tertutup navbar
        const navbarHeight = document.querySelector('nav').offsetHeight;
        const offsetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
});


// 7. FORM VALIDATION LOGIC
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isNameValid = checkInput('name', 'Nama tidak boleh kosong');
    let isEmailValid = checkEmail();
    let isMessageValid = checkInput('message', 'Pesan tidak boleh kosong');

    if (isNameValid && isEmailValid && isMessageValid) {
        const btn = form.querySelector('button');
        btn.innerHTML = "Berhasil Dikirim! <i class='fas fa-check'></i>";
        btn.style.background = "#2ecc71"; // Warna hijau untuk berhasil
        form.reset();
        
        setTimeout(() => {
            btn.innerHTML = "Kirim Pesan <i class='fas fa-paper-plane'></i>";
            btn.style.background = "var(--pink-dark)";
            // Hapus kelas error jika ada
            document.querySelectorAll('.input-box.error').forEach(el => el.classList.remove('error'));
        }, 3000);
    }
});

function checkInput(id, message) {
    const input = document.getElementById(id);
    const parent = input.parentElement;
    if (input.value.trim() === "") {
        parent.classList.add('error');
        parent.querySelector('.error-msg').innerText = message;
        return false;
    } else {
        parent.classList.remove('error');
        return true;
    }
}

function checkEmail() {
    const email = document.getElementById('email');
    const parent = email.parentElement;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!pattern.test(email.value) || email.value.trim() === "") { // Tambah cek kosong juga
        parent.classList.add('error');
        parent.querySelector('.error-msg').innerText = "Format email salah atau kosong";
        return false;
    } else {
        parent.classList.remove('error');
        return true;
    }
}

// Tambahkan elemen modal ke HTML secara otomatis lewat JS
const modalHTML = `
    <div class="modal-overlay" id="modalContainer">
        <div class="modal-content">
            <span class="close-btn" id="closeModal">&times;</span>
            <div class="modal-img-preview" id="modalImg"></div>
            <h3 id="modalTitle" style="color:#f06292; margin-bottom:10px;"></h3>
            <p id="modalDesc" style="color:#666;"></p>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Logika Klik Tombol Lihat Proyek
const allViewLinks = document.querySelectorAll('.view-link');
const modalContainer = document.getElementById('modalContainer');

allViewLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Supaya tidak loncat ke atas halaman
        
        // Ambil data dari kartu yang sedang diklik
        const card = this.closest('.work-card');
        const title = card.querySelector('h4').innerText;
        const desc = card.querySelector('p').innerText;
        const img = card.querySelector('.work-thumb').style.backgroundImage;

        // Masukkan data ke dalam modal
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalDesc').innerText = "Detail Lengkap: " + desc + ". Proyek ini dikerjakan dengan penuh ketelitian untuk memberikan hasil visual terbaik.";
        document.getElementById('modalImg').style.backgroundImage = img;

        // Munculkan Modal
        modalContainer.classList.add('active');
    });
});

// Tutup Modal saat klik X atau klik di luar kotak
document.getElementById('closeModal').onclick = () => modalContainer.classList.remove('active');
window.onclick = (e) => {
    if (e.target == modalContainer) modalContainer.classList.remove('active');
};