const express = require('express');
const mongoose = require('mongoose');

// Inisialisasi aplikasi Express
const app = express();

// Mengatur parsing body dari request menjadi JSON
app.use(express.json());

// Menghubungkan ke database MongoDB menggunakan Mongoose
mongoose.connect('mongodb+srv://pabw:pabw@sistemmanajemenkonten-p.hbldkvq.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Terhubung ke MongoDB');
  })
  .catch((error) => {
    console.error('Kesalahan saat menghubungkan ke MongoDB:', error);
  });

// Membuat schema artikel
const artikelSchema = new mongoose.Schema({
  konten: String,
  judul: String,
  tanggal: Date,
  slug: String,
});

// Membuat model Artikel berdasarkan schema
const Artikel = mongoose.model('Artikel', artikelSchema);

// Membuat artikel baru
app.post('/artikel', (req, res) => {
  const { konten, judul, tanggal, slug } = req.body;

  Artikel.create({
    konten,
    judul,
    tanggal,
    slug,
  })
    .then((artikel) => {
      res.status(201).json(artikel);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal membuat artikel' });
    });
});

// Membaca satu artikel berdasarkan slug
app.get('/artikel/:slug', (req, res) => {
  const slug = req.params.slug;

  Artikel.findOne({ slug })
    .then((artikel) => {
      if (artikel) {
        res.json(artikel);
      } else {
        res.status(404).json({ error: 'Artikel tidak ditemukan' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal membaca artikel' });
    });
});

// Membaca semua artikel
app.get('/artikel', (req, res) => {
  Artikel.find()
    .then((artikel) => {
      res.json(artikel);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal membaca artikel' });
    });
});

// Menghapus artikel
app.delete('/artikel/:slug', (req, res) => {
  const slug = req.params.slug;

  Artikel.findOneAndDelete({ slug })
    .then((artikel) => {
      if (artikel) {
        res.json({ message: 'Artikel berhasil dihapus' });
      } else {
        res.status(404).json({ error: 'Artikel tidak ditemukan' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal menghapus artikel' });
    });
});

// Mengedit artikel
app.put('/artikel/:slug', (req, res) => {
  const slug = req.params.slug;
  const { konten, judul, tanggal } = req.body;

  Artikel.findOneAndUpdate(
    { slug },
    { konten, judul, tanggal },
    { new: true }
  )
    .then((artikel) => {
      if (artikel) {
        res.json(artikel);
      } else {
        res.status(404).json({ error: 'Artikel tidak ditemukan' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal mengedit artikel' });
    });
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
