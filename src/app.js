const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const { sendMessage, editEmbed, getChannelMessages, parseFields } = require('./discordBot');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/get-channel-messages', async (req, res) => {
    try {
        const messages = await getChannelMessages();
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

app.post('/edit-embed', (req, res) => {
    const { title, url, description, thumbnail, image, color, footer, fields, messageId } = req.body;
    editEmbed('', title, url, description, thumbnail, image, color, footer, fields, messageId);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
