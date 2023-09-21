const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, generateDependencyReport } = require('@discordjs/voice');

// Show dependencies
// console.log(generateDependencyReport());

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Let the bot join the user\'s current channel'),
	async execute(interaction) {

	},
};
