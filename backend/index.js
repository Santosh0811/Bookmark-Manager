const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db.js');
const port = process.env.PORT;
const cookieParser = require("cookie-parser");

db();
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL_2
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/userAuth', require('./routes/userAuth'));
app.use('/api/siteBookmark', require('./routes/siteBookmark'));
app.use('/api/admin', require('./routes/admin'));

app.listen(port, () => {
    console.log(`Server is running on Port http://localhost:${port}`);
})
