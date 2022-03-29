const express = require("express");
const speakeasy = require("speakeasy");
const bodyParser = require('body-parser');
require('dotenv').config();
const pool = require("./db");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//register endpoint
app.post("/users/register", async (req, res) => {

  const { username, email, password, profile_picture } = req.body

  try {

    var num = '1234567890'
    var OTP = ''
    for (let i = 0; i < 6; i++) {
      OTP += num[Math.floor(Math.random() * 10)]
    }

    const newUser = await pool.query('INSERT INTO users (username, email, password, otp, profile_picture) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, email, password, OTP, profile_picture]);
    res.json({ message: "User has been registered", UserID: newUser.rows[0].id, OTP: newUser.rows[0].otp })


  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});





//login endpoint
app.post("/users/login", async (req, res) => {

  const { userId, otp } = req.body;

  try {

    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const userOtp = user.rows[0].otp

    if (otp === userOtp) {
      res.json({ message: "User is logged in" })
    } else {
      res.json({ message: "Incorrect OTP" })
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message })
  };
})






app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}...`);
});