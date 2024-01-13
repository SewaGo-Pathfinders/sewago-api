# SewaGo API
Sebenarnya tim kami ingin menggunakan clean architecture, tetapi karena keterbatasan waktu jadi kami buat seadanya dahulu. Kami mendahulukan endpoint yang berhubungan dengan authentication dan authorization, karena itu adalah kunci keamanan utama dari API kami.

## Endpoint yang diselesaikan

### /auth/sign-in
Endpoint ini menerima sebuah query url berupa token dari front-end, yang dimana token tersebut didapat dari hasil user login (login dengan google maupun native). Lalu memverifikasi token tersebut untuk memastikan keamanannya. Jika terverifikasi, back-end akan membuat sebuah request token dan refresh token. Request token akan diberikan kepada user melalui body respon, sedangkan refresh token akan di simpan dalam database dan juga dikirim melalui cookie user agar lebih aman.

### /auth/sign-up
Dalam endpoint satu ini cukup simple, tugasnya hanya membuat user baru berdasarkan body yang dikirim front-end. Lalu membuatkan tempat untuk data user dalam database.

### /auth/address
Endpoint ini menangani pembuatan biodata lengkap user, ini terpisah karena logikanya user tidak diwajibkan mengisi biodata kecuali user ingin meminjam atau membuka toko penyewaan.
