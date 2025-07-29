# tts-dc-bot

Text-to-Speech Discord Bot
w/ music functionality (via [yt-dlp](https://github.com/yt-dlp/yt-dlp))

## Motivation

Several of my friends on discord is rather shy and don't really use their mic; they can only type to communicate with those of us that uses a mic. This introduce an unnecessary cognitive overhead for those that uses a mic (since we would be switch windows back and forth for most of the time just to check the chat).  
I have also realized that my JavaScript skill is quite rusty. This is a good opportunity to get some experience.

## (npm) packages

Prefix `yarn add ` to the following to install them

- discord.js
- dotenv
- @discordjs/voice
- @discordjs/opus
- libsodium
- axios

### Optional

- mocha

## Notes

**All credential of the bot will be stored in the `.env` file. DO NOT SHARE!**  
[discord.js guide](https://discordjs.guide)  
[discord player documentation](https://discord-player.js.org/docs)  
[yt-dlp](https://github.com/yt-dlp/yt-dlp)  
Run the bot with `npm start`  
Test functions with `npm test`
