const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('原神')
    .setNameLocalizations({
      'en-US': 'genshinimpact', // All chars needs to be lowercase
      ja: '原神',
    })
    .setDescription('启动！')
    .setDescriptionLocalizations({
      'en-US': 'Launch!',
      ja: '起動',
    }),
  async execute(interaction) {
    const locales = {
      'en-US': 'Launch!',
      ja: '起動',
      'zh-CN': '启动!',
    };

    return interaction.reply(locales[interaction.locale] ?? locales['en-US']);
  },
};
