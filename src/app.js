const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, channel_id } = require('../config.json');
const express = require('express');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
const port = 3000;

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

function send_message(message) {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    channel.send(message);
}

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Render the HTML form here
    res.sendFile(__dirname + '/index.html');
});

app.post('/send-data', (req, res) => {
    const { message } = req.body;
    console.log(message);

    send_message(message);
    // Redirect the user back to the form page or another page as needed.
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
