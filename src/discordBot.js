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
    .setColor(convertColor(color))
    .setTitle(title)
    .setURL(url)
    .setDescription(description)
    .setThumbnail(thumbnail)
    .setImage(image)
    .setTimestamp()
    .setFooter({ text: footer, iconURL: thumbnail });

    channel.send({ embeds: [exampleEmbed] });
}

function convertColor(color) {
    return Number("0x" + color.substring(1));
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

async function getChannelMessages(channel_id) {
    const channel = client.channels.cache.get(channel_id);

    try {
        const messages = await channel.messages.fetch();
        const messages_array = [];
        messages.forEach(message => {
            messages_array.push(message);
        });
        return messages_array;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return []; // Return an empty array in case of an error
    }
}

module.exports = { sendMessage, sendEmbed, editEmbed, getChannelMessages };