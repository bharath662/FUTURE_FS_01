const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contact", async (req, res) => {
  try {

    const { name, email, subject, message } = req.body;

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

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "bharathmedapatla@gmail.com",
      reply_to: email,
      subject: subject ? `[Portfolio] ${subject}` : "[Portfolio] New Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.json({ msg: "Message sent successfully 🚀" });

  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ msg: "Failed to send message. Please try again later." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});