// at the top of your file
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, channel_id } = require('../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);

function sendMessage(message, title, url, description, thumbnail, fields, image, color, footer) {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    console.log(title, url, description, thumbnail, image, color, footer);

    if (message !== '') {
        channel.send(message);
    }

    if (title !== '') {
        const embed = createEmbed(title, url, description, thumbnail, fields, image, color, footer);
        channel.send({ embeds: [embed] });
    }
}

function convertColor(color) {
    return Number("0x" + color.substring(1));
}

function createEmbed(title, url, description, thumbnail, fields, image, color, footer) {
    const exampleEmbed = new EmbedBuilder()
        exampleEmbed.setTitle(title);

        if (color !== '') {
            exampleEmbed.setColor(convertColor(color));
        }

        if (url !== '') {
            console.log(url);
            console.log("how am i here");
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

        if (length(fields) > 0) {
            fields.forEach(field => {
                exampleEmbed.addFields(field.name, field.value, field.inline);
            });
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

module.exports = { sendMessage, editEmbed, getChannelMessages };