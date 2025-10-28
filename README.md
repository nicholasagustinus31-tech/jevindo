# Jevindo Company Profile Website

Website statis modern untuk Jevindo sebagai distributor resmi Bluetti Indonesia. Dibangun dengan HTML5, CSS3, dan JavaScript murni tanpa backend.

## Struktur Folder

```
├── index.html
├── about.html
├── products.html
├── use-cases.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── data/
│   └── products.json
├── images/
│   ├── favicon.svg
│   └── logo.svg
├── sitemap.xml
└── robots.txt
```

## Dependensi Front-end

Seluruh dependensi dimuat melalui CDN:

- Google Fonts – Poppins (400/500/600/700)
- GSAP 3.12 (core & ScrollTrigger) untuk animasi hero dan parallax ringan
- AOS 2.3.4 untuk animasi scroll
- EmailJS 3 (opsional jika menggunakan formulir kontak) – inisialisasi dengan `emailjs.init('PUBLIC_KEY')`
- Google Analytics (gantikan `G-XXXXXXX` dengan Measurement ID Anda)
- Google reCAPTCHA v3 (gantikan placeholder `YOUR_RECAPTCHA_SITE_KEY`)

## Konfigurasi yang Perlu Diperbarui

1. **EmailJS**
   - Isi atribut `data-service`, `data-template`, dan `emailjs.init('PUBLIC_KEY')` pada `contact.html`/`index.html`.
   - Template harus menangani field: `name`, `email`, `phone`, `message`.

2. **WhatsApp CTA**
   - Ganti nomor WhatsApp default `6281234567890` dengan nomor resmi Jevindo.

3. **Google Analytics & reCAPTCHA**
   - Update Measurement ID dan Site Key sesuai akun Anda.

4. **Meta Data & URL**
   - Perbarui `canonical` dan `og:url` jika domain produksi berubah.

## Menambah Produk Baru

1. Buka `data/products.json`.
2. Temukan kategori yang sesuai (power-station, solar-panel, battery-module, accessories).
3. Tambahkan objek produk baru dengan struktur:
   ```json
   {
     "name": "Bluetti XYZ",
     "image": "https://...",
     "capacityWh": 1000,
     "outputW": 1200,
     "surgeW": 2400,
     "ports": "...",
     "recharge": "...",
     "rechargeTime": "...",
     "weight": "...",
     "dimension": "...",
     "highlights": ["..."],
     "scenarios": "...",
     "warranty": "Garansi Resmi Bluetti ...",
     "ctaBuy": "https://wa.me/...",
     "ctaConsult": "https://wa.me/...",
     "featured": true
   }
   ```
4. Simpan file. Produk akan otomatis muncul di halaman Produk dan (jika `featured: true`) di beranda.

## Checklist SEO Sebelum Go Live

- [ ] Isi ID Google Analytics dan verifikasi Search Console.
- [ ] Ganti placeholder nomor WhatsApp dan email.
- [ ] Tambahkan favicon dalam format `.png`/`.ico` jika diperlukan selain `favicon.svg`.
- [ ] Pastikan seluruh gambar menggunakan format WebP atau kompresi optimal.
- [ ] Submit `sitemap.xml` ke Google Search Console dan pastikan `robots.txt` dapat diakses.
- [ ] Perbarui konten hero/testimoni agar relevan dengan kampanye terkini.

## Deploy ke Hostinger

1. Unggah seluruh folder ke direktori `public_html` via FTP/File Manager.
2. Pastikan struktur folder sesuai dengan daftar di atas.
3. Uji akses setiap halaman (`/about.html`, `/products.html`, dll.) dan formulir kontak.
4. Aktifkan kompresi GZIP dan caching statis melalui kontrol panel Hostinger untuk optimasi performa.

## Lisensi Gambar

Seluruh gambar saat ini menggunakan sumber bebas royalti dari Pixabay (link tercantum di file JSON/HTML). Ganti dengan dokumentasi resmi Jevindo bila tersedia.
