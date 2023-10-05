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
        console.log(`Message sent: ${message}`);
    }

    if (title !== '') {
        fields = parseFields(fields);

        const embed = createEmbed(title, url, description, thumbnail, image, color, footer, fields);
        channel.send({ embeds: [embed] });
        console.log(`Embed sent: ${title} \n`);
    }
}

function convertColor(color) {
    return Number("0x" + color.substring(1));
}

function createEmbed(title, url, description, thumbnail, image, color, footer, fields) {
    const embed = new EmbedBuilder()
        embed.setTitle(title);

        if (color !== '') {
            embed.setColor(convertColor(color));
        }

        if (url !== '') {
            embed.setURL(url);
        }
    
        if (description !== '') {
            embed.setDescription(description);
        }
    
        if (thumbnail !== '') {
            embed.setThumbnail(thumbnail);
        }
    
        if (image !== '') {
            embed.setImage(image);
        }
    
        embed.setTimestamp();
    
        if (footer !== '') {
            embed.setFooter({ text: footer, iconURL: thumbnail });
        }

        
        if (fields.length > 0) {
            embed.addFields(fields);
        }
        
    return embed;
}

// TODO: implement correctly
function editEmbed(content, title, url, description, thumbnail, image, color, footer, fields, messageId) {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    if (title !== '') {
        fields = parseFields(fields);

        const newEmbed = createEmbed(title, url, description, thumbnail, image, color, footer, fields);
        
        const message = channel.messages.fetch(messageId)
        .then(message => message.edit({ embeds: [newEmbed] }));
    }
}

async function getChannelMessages() {
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