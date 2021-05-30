const tmi = require("tmi.js");
const Discord = require("discord.js");
const settings = require("./settings.json");

const twitch = new tmi.client({
  identity: {
    username: settings.twitch.username,
    password: settings.twitch.oauth
  },
  channels: [settings.twitch.channel]
});

let inviteChannel;
const client = new Discord.Client();


twitch.on("message", onMessageHandler);
twitch.on("connected", onConnectedHandler);

// Wait for discord to ready up before connecting to twitch.
client.on("ready", () => {
  twitch.connect();
})

async function onMessageHandler(target, context, msg, self) {
  if (self) return;

  const command = msg.trim();

  if (command === "!discord") {
    try {

      const link = await inviteChannel.createInvite({
        maxAge: 86400,
        maxUses: 1,
        unique: true,
        reason: `Generated from twitch via ${context.username}`
      })
      twitch.say(target, `Here's your discord link! It only has one use and expires after 24 hours. ${link.url}`)
      console.log(`Generated invite ${link.code} for ${context.username}`);
    } catch (e) {
      console.error(e);
      twitch.say(target, "Something went wrong processing your request. Check error logs for more info.")
    }
  }

}


async function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  inviteChannel = await client.channels.fetch(settings.discord.targetChannel);
}

client.login(settings.discord.token);