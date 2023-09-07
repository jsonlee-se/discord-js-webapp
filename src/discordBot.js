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

function sendEmbed() {
    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    // inside a command, event listener, etc.
    const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    channel.send({ embeds: [exampleEmbed] });
}

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