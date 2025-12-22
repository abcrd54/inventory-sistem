const supabase = require('../config/supabase');

exports.getStats = async (req, res) => {
  // Cek Session
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { count: unitCount } = await supabase.from('unit').select('*', { count: 'exact', head: true });
    const { data: recentInvoices } = await supabase.from('invoice').select('*').limit(5).order('id', { ascending: false });

    res.json({
      user: { username: req.session.username, role: req.session.role },
      summary: {
        total_unit: unitCount || 0,
        recent_sales: recentInvoices || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};