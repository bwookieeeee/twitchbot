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
});

async function onMessageHandler(target, context, msg, self) {
  if (self) return;

  if (msg.startsWith("!")) {
    const cmd = msg.trim().substring(1);

    switch (cmd) {
      case "discord":
        await generateInvite(target, context);
        break;
      case "revoke":
        await revokeInvite(target, context);
        break;
    }
  }
}

async function generateInvite(target, context) {
  try {
    const link = await inviteChannel.createInvite({
      maxAge: 86400,
      maxUses: 1,
      reason: `Generated from Twitch via ${context.username}`
    });
    twitch.say(
      target,
      `Here's your Discord link! It only has one use and expires after 24 hours. ${link.url}`
    );
    console.log(`Generated invite ${link.code} for ${context.username}`);
  } catch (e) {
    console.error(e);
    twitch.say(
      target,
      "Something went wrong generating an invite. Check error logs for more info."
    );
  }
}

async function revokeInvite(target, context) {
  if (context.mod || context["user-id"] === context["room-id"]) {
    try {
      inviteChannel.fetchInvites().then((invites) => {
        const key = invites.firstKey();
        const invite = invites.get(key);
        invite.delete(`Revoked by ${context.username}`);
        console.log(`Deleted invite ${key} by ${context.username}`);
        twitch.say(target, `Revoked invite ${key}`);
      });
    } catch (e) {
      console.error(e);
      twitch.say("Could not revoke invite, check logs for more info.");
    }
  } else {
    twitch.say(target, "You are authorized to revoke invites.");
  }
}

async function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  inviteChannel = await client.channels.fetch(settings.discord.targetChannel);
}

client.login(settings.discord.token);
