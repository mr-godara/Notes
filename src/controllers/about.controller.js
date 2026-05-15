const getAbout = (req, res) => {
  res.status(200).json({
    name: 'Amit Godara',
    email: 'your-email@example.com',
    my_features: {
      note_pinning: 'Allows users to pin important notes for quick access.'
    }
  });
};

module.exports = { getAbout };
