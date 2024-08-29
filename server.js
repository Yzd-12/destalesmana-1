const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/contact-form', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Schema dan model untuk menyimpan data formulir
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Untuk menghidangkan file statis

// Endpoint untuk menerima data formulir
app.post('/submit-form', (req, res) => {
    const newContact = new Contact(req.body);
    newContact.save()
        .then(() => res.json({ success: true }))
        .catch(() => res.json({ success: false }));
});

// Endpoint untuk mengakses data formulir (opsional, jika diperlukan)
app.get('/view-contacts', (req, res) => {
    Contact.find()
        .then(contacts => res.json(contacts))
        .catch(() => res.status(500).send('Gagal memuat data.'));
});

// Halaman beranda yang hanya dapat diakses oleh pengguna yang memiliki akses
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Halaman untuk menampilkan data (opsional)
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/view-contacts.html');
});

// Mulai server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
