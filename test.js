import { REST, Routes } from 'discord.js';

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

const rest = new REST({ version: '9' }).setToken('token');

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands('CLIENT_ID'), { body: commands });

    console.log('succesfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}