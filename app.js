
const express= require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/UserRoutes');
const crimeReportRoutes = require('./routes/CrimeReportRoutes');
const searchRoutes = require('./routes/SearchRoutes');
const faqRoutes = require('./routes/FAQRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors()); 

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/report', crimeReportRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/faq', faqRoutes);

mongoose.connect(process.env.MONGO_URI,{

})
.then( ()=> console.log("MongoDB is connected"))
.catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});