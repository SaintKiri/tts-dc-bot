const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setNameLocalizations({
      'zh-CN': '用户',
    })
    .setDescription('Provies information about the user.')
    .setNameLocalizations({
      'zh-CN': '提供用户信息',
    }),
  async execute({ interaction }) {
    // interaction.user = object representing the user who ran the command
    // interaction.member = guildmember object counterpart of ^
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
    );
  },
};
