const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MySQL Configuration
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'Changemenow@0437',
  database: 'restaurant'
};

// Gmail transporter using app password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/submit-order', async (req, res) => {
  const {
    email,
    phone,
    description,
    layers,
    budget,
    transactionId,
    neededDate
  } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      `INSERT INTO cake_orders 
        (email, phone, description, layers, amount, transaction_id, needed_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, phone, description, layers, budget, transactionId, neededDate]
    );
    await connection.end();

    // Email body
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [email, process.env.ADMIN_EMAIL],
      subject: "🎂 Cake Order Confirmation",
      html: `
        <h2>🎉 Cake Order Received!</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Layers:</strong> ${layers}</p>
        <p><strong>Budget:</strong> UGX ${budget}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Needed Date:</strong> ${neededDate}</p>
        <br>
        <p>Thank you for your order! 🎂 We'll be in touch soon.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "🎉 Order submitted! Confirmation sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Error processing order. Try again later." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
