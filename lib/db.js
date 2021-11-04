const app = require("./fireabase/index");
const { getFirestore } = require("firebase-admin/firestore");

const firestore = getFirestore(app);

const setPollChannel = (guildId, channelId) => {
  return firestore.collection("guilds").doc(guildId).set({
    pollChannel: channelId,
  }, { merge: true });
};
module.exports.setPollChannel = setPollChannel;

const setPollInterval = (guildId, interval) => {
  return firestore.collection("guilds").doc(guildId).set({
    pollInterval: interval,
  }, { merge: true });
};
module.exports.setPollInterval = setPollInterval;

const setSubscriberRole = (guildId, roleId) => {
  return firestore.collection("guilds").doc(guildId).set({
    subscriberRole: roleId,
  }, { merge: true });
};
module.exports.setSubscriberRole = setSubscriberRole;

const getGuildInfo = (guildId) => {
  return firestore.collection("guilds").doc(guildId).get().then(doc => doc.data());
};
module.exports.getGuildInfo = getGuildInfo;

const getPollsByGuildAndExpiration = (guildId, expiresOn) => {
  return firestore.collection("guilds").doc(guildId).collection("polls").where("expiresOn", "<=", expiresOn).get();
};
module.exports.getPollsByGuildAndExpiration = getPollsByGuildAndExpiration;

const getPollsByGuild = (guildId) => {
  return firestore.collection("guilds").doc(guildId).collection("polls").get();
};
module.exports.getPollsByGuild = getPollsByGuild;

const createPoll = async (guildId, { expiresOn, messageId }) => {
  return firestore.collection("guilds").doc(guildId).collection("polls").doc(messageId).set({ expiresOn, messageId });
};
module.exports.createPoll = createPoll;

const deletePoll = async (guildId, pollId) => {
  return firestore.collection("guilds").doc(guildId).collection("polls").doc(pollId).delete();
};
module.exports.deletePoll = deletePoll;
