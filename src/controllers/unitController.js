const supabase = require('../config/supabase');

exports.getAllUnits = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('unit')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log(`Berhasil mengambil ${data.length} unit.`);
        res.json(data);
    } catch (err) {
        console.error("Error ambil unit:", err.message);
        res.status(500).json({ message: "Gagal mengambil data dari database" });
    }
};

exports.addUnit = async (req, res) => {
    try {
        // Ambil data dari body
        const { tipe, warna, kategori, nomor_rangka, nomor_dinamo, status } = req.body;
        
        // Simpan ke Supabase
        const { data, error } = await supabase
            .from('unit')
            .insert([{ 
                tipe, 
                warna, 
                kategori, 
                nomor_rangka, 
                nomor_dinamo, 
                status 
            }])
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Unit berhasil ditambahkan", data });
    } catch (err) {
        console.error("Error simpan unit:", err.message);
        res.status(500).json({ message: "Gagal menyimpan data: " + err.message });
    }
};