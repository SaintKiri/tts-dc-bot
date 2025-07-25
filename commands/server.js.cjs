const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setNameLocalizations({
      'zh-CN': '服务器',
    })
    .setDescription('Display info about the server.')
    .setNameLocalizations({
      'zh-CN': '显示服务器信息',
    }),
  async execute({ interaction }) {
    // interaction.guild = object representing the Server in which the command was run
    return interaction.reply(
      `${interaction.guild.name} has ${interaction.guild.memberCount} members.`,
    );
  },
};
