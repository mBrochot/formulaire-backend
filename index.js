require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

/* MAILGUN CONFIGURATION */
const api_key = process.env.MAILGUN_API_KEY; /* VOTRE CLÉ API */
const domain = process.env.MAILGUN_DOMAIN; /* VOTRE DOMAINE SANDBOX */
const mailgun = require("mailgun-js");
const mg = mailgun({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
  res.send("Server is up!");
});

app.post("/", (req, res) => {
  const { firstname, lastname, email, subject, message } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "brochot.mathieu@gmail.com",
    subject: subject,
    text: message,
  };
  console.log(data);

  /* ENVOI DE L'OBJET VIA MAILGUN */
  mg.messages().send(data, (error, body) => {
    if (!error) {
      console.log(body);
      return res.status(200).json(body);
    }
    res.status(401).json(error);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server has just started !");
});
