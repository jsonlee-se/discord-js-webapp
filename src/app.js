const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const { sendMessage, sendEmbed, editEmbed } = require('./discordBot');
const embed_id = "1149389626977562744"

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    // Render the HTML form here
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/send-data', (req, res) => {
    const { message } = req.body;
    console.log(message);

    sendMessage(message);
    res.redirect('/');
});

app.post('/send-embed', (req, res) => {
    const { title, url, description, thumbnail, image, color, footer } = req.body;
    console.log(title, url, description, thumbnail, image, color, footer);

    // TODO: implement fields correctly
    const fields = null;
    sendEmbed(title, url, description, thumbnail, fields, image, color, footer);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
