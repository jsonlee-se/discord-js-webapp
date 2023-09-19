// at the top of your file
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, channel_id } = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

function sendMessage(message, title, url, description, thumbnail, image, color, footer, fields) {

    const channel = client.channels.cache.get(channel_id);

    if (message !== '') {
        channel.send(message);
    }

    if (title !== '') {
        fields = parseFields(fields);
        
        const embed = createEmbed(title, url, description, thumbnail, image, color, footer, fields);
        channel.send({ embeds: [embed] });
    }
}

function convertColor(color) {
    return Number("0x" + color.substring(1));
}

function createEmbed(title, url, description, thumbnail, image, color, footer, fields) {
    const exampleEmbed = new EmbedBuilder()
        exampleEmbed.setTitle(title);

        if (color !== '') {
            exampleEmbed.setColor(convertColor(color));
        }

        if (url !== '') {
            exampleEmbed.setURL(url);
        }
    
        if (description !== '') {
            exampleEmbed.setDescription(description);
        }
    
        if (thumbnail !== '') {
            exampleEmbed.setThumbnail(thumbnail);
        }
    
        if (image !== '') {
            exampleEmbed.setImage(image);
        }
    
        exampleEmbed.setTimestamp();
    
        if (footer !== '') {
            exampleEmbed.setFooter({ text: footer, iconURL: thumbnail });
        }

        
        if (fields.length > 0) {
            exampleEmbed.addFields(fields);
        }
        
    return exampleEmbed;
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

function parseFields(fields) {
    const data = JSON.parse(fields);
    // replace '' values with '\u200b' (empty space)
    // to prevent addfields from throwing an error
    for (let i = 0; i < data.length; i++) {
        if (data[i].name === '') {
            data[i].name = '\u200b';
        }
        if (data[i].value === '') {
            data[i].value = '\u200b';
        }
    }
    return data;
}

module.exports = { sendMessage, editEmbed, getChannelMessages };