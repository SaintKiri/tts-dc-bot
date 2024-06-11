const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Display info about the server.'),
  async execute({ interaction }) {
    // interaction.guild = object representing the Server in which the command was run
    return interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    );
  },
};
