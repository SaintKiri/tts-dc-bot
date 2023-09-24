const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, joinVoiceChannel, generateDependencyReport } = require('@discordjs/voice');

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
					option
						.setName("url")
						.setDescription("url of the song")
						.setRequired(true)
				)
		),
	async execute(interaction, client) {
		if (!interaction.member) {
			return interaction.reply("Please join a voice channel to use this command");
		}

		const queue = await client.player.createQueue(interaction.guild);

		if (!queue.connection) await queue.connect(interaction.member.voice.channel);

		if (interaction.options.getSubcommand() === "song") {
			let url = interaction.options.getString("url");

			const result = await client.player.search(url, {
				requestedBy: interaction.user,
				searchEngine: QueryType.YOUTUBE_VIDEO,
			});

			if (result.tracks.length === 0) {
				await interaction.reply("no results found");
				return;
			}

			const song = result.tracks[0];
			await queue.addTrack(song);

			let embed = new EmbedBuilder()
				.setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
				.setThumbnail(song.thumbnail)
				.setFooter({ text: `Duration: ${song.duration}` });
		}

		if (!queue.playing) await queue.play();

		await interaction({
			embed: [embed],
		});
	},
};
