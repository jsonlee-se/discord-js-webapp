// at the top of your file
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, channel_id } = require('../config.json');

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

module.exports = { sendMessage, sendEmbed, editEmbed };