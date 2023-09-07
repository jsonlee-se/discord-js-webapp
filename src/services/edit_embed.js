const embed_id = "1149389626977562744"

const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token, channel_id } = require('../../config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// const exampleEmbed = new EmbedBuilder()
//     .setTitle('Edited title');

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    const channel = client.channels.cache.get(channel_id);
    console.log(`Channel: ${channel.name}`);

    //get the message by id
    const message = channel.messages.fetch(embed_id)
        // .then(message => message.edit({ embeds: [exampleEmbed] }));
        .then(message => console.log(message.embeds[0].title + "\n" +
        message.embeds[0].description));
    
});

client.login(token);