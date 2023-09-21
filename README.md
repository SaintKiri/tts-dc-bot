# tts-dc-bot
Text-to-Speech Discord Bot

## Motivation
Several of my friends on discord is rather shy and don't really use their mic; they can only type to communicate with those of us that uses a mic. This introduce an unnecessary cognitive overhead for those that uses a mic (since we would be alt+tabbing back and forth for most of the time just to check the chat).  
I have also realized that my JavaScript skill is quite rusty. This is a good opportunity to get some experience. 

## (npm) packages
- discord.js (`npm install discord.js`)
- dotenv (`npm install dotenv`)
- @discordjs/voice (`npm install @discordjs/voice libsodium-wrappers`)
- @discordjs/opus (`npm install @discordjs/opus`)

## Notes
[discord.js guide](https://discordjs.guide)  
Run the bot with `npm start`  
All credential of the bot will be stored in the `.env` file. DO NOT SHARE!  

## TODO
1. Localize `server.js` and `user.js`
2. Bot should be able to join the channel after playing the `元神` command
