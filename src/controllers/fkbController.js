const supabase = require('../config/supabase');

/* ===============================
   GET ALL FKB
================================ */
exports.getAllFKB = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('fkb')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log(`Berhasil mengambil ${data.length} FKB.`);
        res.json(data);
    } catch (err) {
        console.error('Error ambil FKB:', err.message);
        res.status(500).json({ message: 'Gagal mengambil data FKB' });
    }
};

/* ===============================
   ADD FKB
================================ */
exports.addFKB = async (req, res) => {
    try {
        const {
            no_faktur,
            nama,
            alamat,
            no_ktp,
            merk,
            tipe,
            jenis,
            model,
            tahun_pembuatan,
            isi_silinder,
            warna,
            no_rangka,
            no_mesin,
            bahan_bakar,
            harga
        } = req.body;

        // Validasi minimal (sesuai DB: alamat NOT NULL)
        if (!alamat) {
            return res.status(400).json({ message: 'Alamat wajib diisi' });
        }

        const { data, error } = await supabase
            .from('fkb')
            .insert([{
                no_faktur,
                nama,
                alamat,
                no_ktp,
                merk,
                tipe,
                jenis,
                model,
                tahun_pembuatan,
                isi_silinder,
                warna,
                no_rangka,
                no_mesin,
                bahan_bakar,
                harga
            }])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'FKB berhasil ditambahkan',
            data
        });
    } catch (err) {
        console.error('Error simpan FKB:', err.message);
        res.status(500).json({ message: 'Gagal menyimpan FKB: ' + err.message });
    }
};

exports.getFKBById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('fkb')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({ message: 'FKB tidak ditemukan' });
  }

  res.json(data);
};