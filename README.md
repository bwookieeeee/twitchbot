# twitchbot
Auto generates a single use Discord invite when `!discord` is called in Twitch chat.

## Installation
This script requires a Discord bot that you control and a Twitch oauth grant. 

1. Generate an oauth token for twitch [here](https://twitchapps.com/tmi/)
1. Create a Discord bot. Instructions are available [here](https://www.freecodecamp.org/news/create-a-discord-bot-with-python/), you do not need to follow the whole tutorial, stop once you've successfully invited the bot to your server. The only scopes this script requires are `bot` and `Create Instant Invite`. 
1. copy `_settings.json` to `settings.json`
1. Fill out all entries in `settings.json` as such:
    ```json
    {
      "twitch": {
        "username": "your username or username of an account you made for this script",
        "channel": "the channel name to connect to. This is almost always your username",
        "oauth": "your previously generated twitch oauth token, including 'oauth:'"
      },
      "discord": {
        "token": "Your discord bot's oauth2 token. This is not your application token.",
        "targetChannel": "The channel ID you're inviting to. This is typically your general or welcome channel, but it can be whichever channel you want really. You can get this by right clicking on a channel and selecting 'copy ID'. If you do not have this option, you need to enable developer settings in your user profile."
      }
    }
    ```
1. Install the required node dependencies: ```npm i```

## Running
Start the script with `node index.js`. Users in your twitch chat will be able to type `!discord` to get a new invite. All invites are single use, and expire after 24 hours.