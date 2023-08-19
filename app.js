// Require the necessary discord.js classes
const {Client, Events, GatewayIntentBits} = require('discord.js');
const dotenv = require('dotenv'); // Using dotenv
dotenv.config();

// Create a new client instance
const client = new Client({intents: [GatewayIntentBits.Guilds]});

// Run when client is ready
client.once(Events.ClientReady, c=>{
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in with client token
client.login(process.env.DISCORD_TOKEN);
