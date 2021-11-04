const { SlashCommandBuilder } = require('@discordjs/builders');
const { setPollChannel } = require('../lib/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setpollchannel")
		.setDescription("Sets the poll channel to be specified channel")
    .addChannelOption(option => 
      option
        .setName("channel")
        .setDescription("The channel to set the poll channel to")
        .setRequired(true)
    ),
	async execute(interaction) {
    const r = interaction.deferReply();
    const pollChannel = interaction.options.getChannel("channel");

    await setPollChannel(interaction.guildId, pollChannel.id);
    await r;
		await interaction.editReply(`Polls channel set to <#${pollChannel.id}>.`);
	}
};
