const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const apiRoutes = require('./routes/api');

// 1. Middleware Dasar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Konfigurasi Session
app.use(session({
    name: 'inventory_sid',
    secret: 'kunci-rahasia-inventory', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        httpOnly: true, 
        maxAge: 3600000 // 1 Jam
    }
}));

// 3. Middleware Cek Login (Reusable)
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    // Jika request via AJAX (fetch), kirim status 401
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Jika akses URL biasa, redirect ke login
    res.redirect('/login');
};

// 4. Routing API (Tanpa proteksi login untuk Login/Signup)
app.use('/api', apiRoutes);

// Endpoint info user tetap di sini atau pindahkan ke apiRoutes
app.get('/api/user-info', (req, res) => {
    if (req.session.userId) {
        res.json({
            username: req.session.username, 
            role: req.session.role,
        });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
});

// 5. Folder Statis
app.use(express.static(path.join(__dirname, '../public')));

// 6. Routing Halaman Utama
app.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard/index.html');
    }
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 7. Routing Halaman Dashboard (Terproteksi)
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

// 8. Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.clearCookie('inventory_sid');
        res.redirect('/login');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});