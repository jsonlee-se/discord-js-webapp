const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const { sendMessage, editEmbed, getChannelMessages, parseFields } = require('./discordBot');
const embed_id = "1149389626977562744"

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    // Render the HTML form here
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/get-channel-messages', async (req, res) => {
    try {
        const messages = await getChannelMessages("1147850593956790363");
        res.json(messages);
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

app.post('/send-message', (req, res) => {
    const { content, title, url, description, thumbnail, image, color, footer, fields } = req.body;

    sendMessage(content, title, url, description, thumbnail, image, color, footer, fields);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
