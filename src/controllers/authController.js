const supabase = require('../config/supabase');

// SIGNUP
exports.signup = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password, role }]) // Idealnya password di-hash dengan bcrypt
      .select();

    if (error) return res.status(400).json(error);
    res.status(201).json({ message: 'User berhasil didaftarkan', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN (dengan Session)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Simpan data ke session
    req.session.userId = data.id;
    req.session.role = data.role;
    req.session.username = data.username;

    res.json({ message: 'Login berhasil' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout berhasil' });
};