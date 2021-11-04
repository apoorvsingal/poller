const { SlashCommandBuilder } = require('@discordjs/builders');
const { setSubscriberRole } = require('../lib/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setsubscriberrole")
		.setDescription("Sets the subscriber role to the sepcified role")
    .addRoleOption(option => 
      option
        .setName("role")
        .setDescription("The subscriber role to ping every time a new pole is created")
        .setRequired(true)
    ),
	async execute(interaction) {
    const r = interaction.deferReply();
    const subscriberRole = interaction.options.getRole("role");

    await setSubscriberRole(interaction.guildId, subscriberRole.id);
    await r;
		await interaction.editReply(`Poll subscriber role set to <@&${subscriberRole.id}>.`);
	}
};
