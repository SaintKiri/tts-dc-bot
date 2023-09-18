const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('元神')
		.setDescription('启动！'),
	async execute(interaction) {
		return interaction.reply('启动!');
	},
};
