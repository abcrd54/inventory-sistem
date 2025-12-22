const supabase = require('../config/supabase');

exports.getStats = async (req, res) => {
    // Session check tetap ada sebagai guard terakhir
    if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Menggunakan Promise.all agar fetch data berjalan bersamaan (lebih cepat)
        const [unitRes, invoiceRes] = await Promise.all([
            supabase.from('unit').select('*', { count: 'exact', head: true }),
            supabase.from('invoice').select('*').limit(5).order('id', { ascending: false })
        ]);

        if (unitRes.error) throw unitRes.error;
        if (invoiceRes.error) throw invoiceRes.error;

        res.json({
            user: { 
                username: req.session.username, 
                role: req.session.role 
            },
            summary: {
                total_unit: unitRes.count || 0,
                recent_sales: invoiceRes.data || []
            }
        });
    } catch (err) {
        console.error("Dashboard Error:", err.message);
        res.status(500).json({ error: "Gagal memuat data statistik" });
    }
};