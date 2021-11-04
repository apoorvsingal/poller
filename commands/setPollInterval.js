const { SlashCommandBuilder } = require('@discordjs/builders');
const { setPollInterval } = require('../lib/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setpollinterval")
		.setDescription("Sets the poll interval to the specified time limit")
    .addStringOption(option => 
      option
        .setName("interval")
        .setDescription("The interval for which a poll remains active")
        .setRequired(true)
    ),
	async execute(interaction) {
    const r = interaction.deferReply();
    const pollInterval = interaction.options.getString("interval");

    let spreaded = pollInterval.replace(/\s+/g, "").split(":").map(v => Number(v));

    for(let n of spreaded){
      if(!(n >= 0)){ // also checks for NaN
        await r;
        await interaction.editReply(`"${pollInterval}" is not a valid interval. Intervals must in the format dd:hh:mm.`);
        return;
      }
    }
    if(spreaded.length == 1){
      spreaded = [0, 0, spreaded[0]];
    } else if(spreaded.length == 2){
      spreaded = [0, spreaded[0], spreaded[1]];
    } else if(spreaded.length != 3){
      await r;
      await interaction.editReply(`"${pollInterval}"" is not a valid interval. Intervals must in the format dd:hh:mm.`);
      return;
    }

    const [days = 0, hours = 0, minutes = 0] = spreaded;
    const unixTimestampOffset = minutes*60*1000 + hours*60*60*1000 + days*24*60*60*1000;

    await setPollInterval(interaction.guildId, unixTimestampOffset);
    await r;
		await interaction.editReply(`Poll interval set to ${days} days, ${hours} hours, ${minutes} minutes.\nPlease note that there is an error factor of ±5 minutes for poll expirations.`);
	}
};
