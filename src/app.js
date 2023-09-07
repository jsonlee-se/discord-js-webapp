const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const { sendMessage } = require('./discordBot');
const embed_id = "1149389626977562744"

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Render the HTML form here
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/send-data', (req, res) => {
    const { message } = req.body;
    console.log(message);

    sendMessage(message);
    // Redirect the user back to the form page or another page as needed.
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
