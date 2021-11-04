const fs = require("fs");
const Collection = require('@discordjs/collection');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.DISCORD_BOT_TOKEN;

const commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.set(command.data.name, command);
}

const rest = new REST({ version: '9' }).setToken(token);

module.exports = {
  commands,
  
  deployCommands: (clientId, guildId) => rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands.map(cmd => cmd.data.toJSON()) })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)
};
