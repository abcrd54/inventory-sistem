const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const apiRoutes = require('./routes/api');

// 1. Middleware Dasar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Konfigurasi Session (PENTING: Harus sebelum routing)
app.use(session({
    name: 'inventory_sid', // Memberi nama cookie agar lebih aman
    secret: 'kunci-rahasia-inventory', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set false karena masih menggunakan HTTP (localhost)
        httpOnly: true, // Mencegah akses cookie dari JavaScript luar
        maxAge: 3600000 
    }
}));

// 3. Folder Statis
// Pastikan path ke folder 'public' tepat. Jika app.js ada di folder 'src', gunakan '../public'
app.use(express.static(path.join(__dirname, '../public')));

// 4. Middleware Cek Login (Reusable)
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/');
};

// 5. Routing API
app.get('/api/user-info', (req, res) => {
    if (req.session.userId) {
        res.json({
            username: req.session.username || "Guest", 
            role: req.session.role || "User",
        });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

app.use('/api', apiRoutes);

// 6. Routing Halaman
app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard/index.html');
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Gunakan Middleware isAuthenticated agar kode lebih rapi
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard/index.html'));
});

app.get('/dashboard/:page', isAuthenticated, (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, '../public/dashboard', page);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Halaman tidak ditemukan');
        }
    });
});

// 7. Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send('Gagal logout');
        res.clearCookie('inventory_sid');
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});