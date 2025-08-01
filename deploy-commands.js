const { REST, Routes } = require("discord.js");
const dotenv = require("dotenv"); // Using dotenv to get discord bot token
const fs = require("node:fs");
const path = require("node:path");

const commands = [];
// Parse in all commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] the command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

dotenv.config();
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.clientId),
      { body: commands },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
