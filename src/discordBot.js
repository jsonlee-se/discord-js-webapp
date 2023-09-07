// at the top of your file
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, channel_id } = require('../config.json');
const { parse } = require('dotenv');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

function sendMessage(message) {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    channel.send(message);
}

function sendEmbed(title, url, description, thumbnail, fields, image, color, footer) {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    const exampleEmbed = new EmbedBuilder()
    .setColor(Number(color))
    .setTitle(title)
    .setURL(url)
    .setDescription(description)
    .setThumbnail(thumbnail)
    .setImage(image)
    .setTimestamp()
    .setFooter({ text: footer, iconURL: thumbnail });

    channel.send({ embeds: [exampleEmbed] });
}

// TODO: implement correctly
function editEmbed(message_id) {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    //get the message by id
    const message = channel.messages.fetch(message_id)
        // .then(message => message.edit({ embeds: [exampleEmbed] }));
        .then(message => console.log(message.embeds[0].title + "\n" +
        message.embeds[0].description));
}

function parseColor(hexString) {
    // Remove the "0x" prefix if it exists
    if (hexString.startsWith("0x")) {
        hexString = hexString.slice(2);
    }

    // Ensure the hex string is 6 characters long (RGB format)
    if (hexString.length !== 6) {
        throw new Error("Invalid hex color string");
    }

    // Parse the hex string into RGB components
    const r = parseInt(hexString.slice(0, 2), 16);
    const g = parseInt(hexString.slice(2, 4), 16);
    const b = parseInt(hexString.slice(4, 6), 16);

    // Return the RGB color as an object
    return { r, g, b };
}

module.exports = { sendMessage, sendEmbed, editEmbed };