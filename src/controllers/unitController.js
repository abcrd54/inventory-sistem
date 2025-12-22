const supabase = require('../config/supabase');

exports.getAllUnits = async (req, res) => {
  const { data, error } = await supabase
    .from('unit')
    .select('*');
    
  if (error) return res.status(400).json(error);
  res.json(data);
};

exports.addUnit = async (req, res) => {
  const { data, error } = await supabase
    .from('unit')
    .insert([req.body])
    .select();

  if (error) return res.status(400).json(error);
  res.status(201).json(data);
};