const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus} = require('@discordjs/voice');
// const { createReadStream } = require('node:fs'); // might be neede for non-mp3 files, also reference https://discordjs.guide/voice/audio-resources.html#cheat-sheet
const { join } = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('join')
	.setDescription('Let me IN!!!!'),
	async execute(interaction) {
		const authorVoiceChannel = interaction.member?.voice.channel;
		if (!authorVoiceChannel) {
			return interaction.reply('You need to be in a voice channel to use this command.');
		}

		const connection = joinVoiceChannel({
			channelId: authorVoiceChannel.id,
			guildId: authorVoiceChannel.guild.id,
			adapterCreator: authorVoiceChannel.guild.voiceAdapterCreator,
		});

		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 10_000);

			const player = createAudioPlayer();
			const resource = createAudioResource(join(__dirname, 'monday-left-me-broken.mp3'));

			player.play(resource);
			connection.subscribe(player);

			return interaction.reply(`Joined: ${authorVoiceChannel.name}`);
		} catch (error) {
			console.error(error);
			return interaction.reply('Error joining voice channel!');
		}
	},
};
