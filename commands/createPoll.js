const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getGuildInfo, createPoll } = require('../lib/db');
const emojis = require('../lib/emojis');
const { resolvePoll } = require("../lib/listener");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("createpoll")
		.setDescription("Creates a new poll")
    .addStringOption(option => 
      option
        .setName("question")
        .setDescription("The poll question")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("options")
        .setDescription("Options for the poll, separated with double semi-colons (;;).")
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option
        .setName("startthread")
        .setDescription("Whether or not to start a thread under the poll")
        .setRequired(false)
    ),
	async execute(interaction) {
    const r = interaction.deferReply();
    
    const pollQuestion = interaction.options.getString("question");
    const pollOptions = interaction.options.getString("options").split(";;");
    const startThread = interaction.options.getBoolean("startthread");

    const { pollChannel, subscriberRole, pollInterval } = await getGuildInfo(interaction.guildId);

    if(!pollChannel){
      await r;
      await interaction.editReply("Please set a poll channel using the setpollchannel command before creating a poll");
      return;
    }

    const [days, hours, minutes] = [Math.floor(pollInterval/(1000*60*60*24)), Math.floor((pollInterval/(1000*60*60))%24), Math.floor((pollInterval/(1000*60))%60)];

    const embed = new MessageEmbed()
      .setTitle(pollQuestion)
      .setDescription(pollOptions.map((option, index) => `${emojis[index]} ${option}`).join("\n"))
      .setFooter(`Expires in ${days ? `${days} days, ` : ""}${hours ? `${hours} hours, ` : ""}${minutes ? `${minutes} minutes` : ""}`)
      .setTimestamp()
      .setColor("AQUA");

		const message = await interaction.guild.channels.cache.get(pollChannel).send({ 
      content: subscriberRole && `<@&${subscriberRole}>`,
      embeds: [embed] 
    });

    const expiresOn = Date.now() + pollInterval;
    const r2 = createPoll(interaction.guildId, { messageId: message.id, expiresOn  });

    for(const index in pollOptions){
      await message.react(emojis[index]);
    }
    if(startThread){
      await message.startThread({ name: pollQuestion, autoArchiveDuration: "MAX" });
    }
    await r2;
    await r;
    
    setTimeout(() => resolvePoll(message, expiresOn, message.id), pollInterval);
    await interaction.editReply("Done!");
	}
};
