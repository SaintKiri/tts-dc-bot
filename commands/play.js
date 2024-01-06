const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');

// Show dependencies
// console.log(generateDependencyReport());

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music')
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("searches for a song")
				.addStringOption(option =>
					option.setName("searchterms")
						.setDescription("search keywords")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("play a song from url")
				.addStringOption(option =>
					option.setName("url")
						.setDescription("url of the song")
						.setRequired(true)
				)
		),
	async execute(interaction) {
	},
};
