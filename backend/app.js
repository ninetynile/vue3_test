const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRouter = require('./routes/product-routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use(cookieParser());

app.use(express.json());

app.use('/api/products', productRouter);

// Connect to MongoDB
mongoose.connect('mongodb+srv://pechdanaisp:jLFCF66rLNxEckoA@cluster0.mv8urii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(5000, () => console.log('Server is running on port 5000')))
  .catch(err => console.log(err));


//jLFCF66rLNxEckoA