require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));



const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');


app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});


app.listen(port, () => console.log(`Server running on port ${port}`));
