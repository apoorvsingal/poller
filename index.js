require("dotenv").config();

const { Client, Intents, Permissions  } = require('discord.js');
const { commands, deployCommands } = require("./commands");
const { listen } = require("./lib/listener");

const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);
	if (!command) return;

  if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) 
    return interaction.reply("You don't have the permission to use this command.");

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
	}
});

client.once('ready', async () => {
  await client.guilds.fetch();
  await deployCommands(client.user.id, client.guilds.cache.at(0).id);
  listen(client);

  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);
