const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

app.post("/contact", async (req, res) => {

  try {

    const { name, email, subject, message } = req.body;

    // Input validation
    if (!name || !email || !message) {
      return res.status(400).json({ msg: "Name, email, and message are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email address." });
    }

    if (name.length > 100 || message.length > 5000) {
      return res.status(400).json({ msg: "Input too long." });
    }

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: subject ? `[Portfolio] ${subject}` : "[Portfolio] New Message",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      replyTo: email
    });

    res.json({
      msg: "Message sent successfully 🚀"
    });

  } catch (err) {

    console.error("Mail error:", err);

    res.status(500).json({
      msg: "Failed to send message. Please try again later."
    });

  }

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});