# E-UMKM

E-UMKM adalah platform berbasis web yang dirancang untuk membantu Usaha Mikro, Kecil, dan Menengah (UMKM) dalam menjual produk mereka secara online. Platform ini menyediakan berbagai fitur untuk mempermudah pengelolaan bisnis UMKM, termasuk manajemen produk, sistem transaksi online, AI rekomendasi, dan dashboard admin.

## 🎯 Tujuan Website E-UMKM
E-UMKM bertujuan untuk menjadi solusi digital bagi pelaku usaha kecil agar lebih mudah dan efisien dalam menjual produk mereka. Beberapa fitur utama yang ditawarkan antara lain:

- **Manajemen Produk** – Memungkinkan admin untuk mengelola produk di marketplace.
- **Sistem Transaksi Online** – Pengguna dapat membeli produk langsung melalui website.
- **AI Rekomendasi untuk UMKM** – Memberikan saran tentang stok, optimasi harga, dan tren produk.
- **Dashboard Admin** – Menampilkan analisis performa penjualan dan data pelanggan.

## 🚀 Fitur Utama

### 1. Halaman Utama (Landing Page)
- Tampilan modern dan responsif yang menampilkan produk unggulan.
- Informasi tentang UMKM dan manfaat menggunakan platform ini.
- Navigasi intuitif untuk eksplorasi kategori produk.

### 2. Halaman Produk
- Menampilkan daftar produk dari berbagai UMKM.
- Sistem filter dan pencarian berdasarkan kategori atau harga.
- Deskripsi produk yang lengkap dengan gambar, harga, dan tombol "Tambah ke Keranjang".

### 3. Sistem Login dan Autentikasi
- User dapat mendaftar dan login untuk melakukan pembelian.
- Admin memiliki akses ke dashboard untuk mengelola produk, pesanan, dan laporan.
- User biasa tidak memiliki akses ke fitur admin.

### 4. Dashboard Admin
- Menampilkan **Total Penjualan, Total Pesanan, Produk Terjual, dan Pelanggan Baru** berdasarkan data dari Supabase.
- Rekomendasi AI untuk membantu admin dalam mengoptimalkan stok, menentukan harga, dan mengikuti tren pasar.
- Data **Pesanan Terbaru** yang diambil langsung dari tabel `transactions`.

### 5. Sistem Checkout & Transaksi
- **User harus login sebelum melakukan transaksi.**
- Sistem pemesanan mencatat detail pembelian pengguna.
- Metode pembayaran akan dikembangkan lebih lanjut.

### 6. Manajemen Produk
- Admin dapat menambah, mengedit, dan menghapus produk.
- Data produk diambil dari Supabase untuk integrasi database yang lebih optimal.
- Potensi pengembangan integrasi dengan sistem dropshipping atau afiliasi di masa depan.

## 🛠 Teknologi yang Digunakan

| Teknologi  | Keterangan |
|------------|-----------|
| **Front-End** | React.js (berbasis Vite) |
| **Back-End** | Supabase (alternatif Firebase) |
| **Database** | PostgreSQL di Supabase |
| **Hosting** | Vercel |
| **UI Design** | ShadCN UI & Tailwind CSS |

---

## 💻 Pengaturan dan Instalasi Lokal

Jika ingin mengembangkan secara lokal menggunakan IDE pilihanmu, ikuti langkah-langkah berikut:

### **Clone Repository dan Setup Proyek**

```sh
# 1. Clone repository ini
git clone <YOUR_GIT_URL>

# 2. Masuk ke direktori proyek
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
npm i

# 4. Jalankan server development
npm run dev
```

### **Edit File Langsung di GitHub**
- Masuk ke file yang ingin diedit.
- Klik ikon "Edit" (pensil) di kanan atas tampilan file.
- Lakukan perubahan dan commit langsung.

### **Gunakan GitHub Codespaces**
- Masuk ke halaman utama repository.
- Klik tombol "Code" (hijau) di kanan atas.
- Pilih tab "Codespaces".
- Klik "New codespace" untuk menjalankan lingkungan development di dalam GitHub.
- Edit file langsung dan push perubahan setelah selesai.

---

## 🔗 Link Website
Akses E-UMKM melalui: [E-UMKM](https://e-umkm.vercel.app/)
---

Dengan berbagai fitur yang dimilikinya, E-UMKM siap menjadi solusi bagi pelaku usaha kecil dalam mengelola bisnis mereka secara digital. 🚀
