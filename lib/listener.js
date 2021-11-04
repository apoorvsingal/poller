const { MessageEmbed } = require("discord.js");
const { getPollsByGuildAndExpiration, getGuildInfo, deletePoll } = require("./db");

const resolvePoll = async (message, expiresOn, pollId) => new Promise((resolve, reject) => {
  setTimeout(async () => {
    try {
      const resultsText = `**Results:**\n${message.reactions.cache.map(r => `${r.emoji}: ${r.count-1}`).join("\n")}`;

      if(message.hasThread){
        const thread = message.thread;

        const embed = new MessageEmbed()
          .setTitle("Poll over!")
          .setDescription(resultsText)
          .setTimestamp()
          .setColor("AQUA");

        await thread.send({ embeds: [embed ]});
        await thread.setArchived(true);
      }
      const messageEmbed = message.embeds[0]
        .setDescription(`${message.embeds[0].description}\n\n${resultsText}`)
        .setFooter("Poll expired");

      await message.edit({ embeds: [messageEmbed] });
      await deletePoll(message.guildId, pollId);
      resolve();
    } catch(error){
      reject(error);
    }
  }, Date.now() >= expiresOn ? 0 : expiresOn - Date.now());
});
module.exports.resolvePoll = resolvePoll;

const resolvePollsFor = async (guild) => {
  const [{ pollChannel }, polls] = await Promise.all([
    getGuildInfo(guild.id),
    getPollsByGuildAndExpiration(guild.id, Date.now() + 1000*60*60),
  ]);
  const promises = [];

  for(const poll of polls.docs) {
    const { messageId, expiresOn } = poll.data();
    promises.push(guild.channels.cache.get(pollChannel).messages.fetch(messageId).then(message => resolvePoll(message, expiresOn, poll.id)));
  }
  return Promise.all(promises);
};
module.exports.resolvePollsFor = resolvePollsFor;

module.exports.listen = (client) => {
  for(const guild of client.guilds.cache.values()) {
    resolvePollsFor(guild);
  }
  setInterval(async () => {
    for(const guild of client.guilds.cache.values()) {
      resolvePollsFor(guild);
    }
  }, 1000*60*60);
};
