const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus} = require('@discordjs/voice');
const {createReadStream} = require('node:fs');
const {join} = require('node:path');
// const client = require('../app.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('join')
	.setDescription('Let me IN!!!!'),
	async execute(interaction) {
		const authorVoiceChannel = interaction.member?.voice.channel;
		if (!authorVoiceChannel) {
			return interaction.reply('You need to be in a voice channel to use this command.');
		}

		console.log('Establishing connection');
		const connection = joinVoiceChannel({
			channelId: authorVoiceChannel.id,
			guildId: authorVoiceChannel.guild.id,
			adapterCreator: authorVoiceChannel.guild.voiceAdapterCreator,
		});

		console.log('waiting for love');
		try {
			await entersState(connection, VoiceConnectionStatus.Ready, 10_000);
			console.log('come around');

			connection.on(VoiceConnectionStatus.Ready, () => {
				console.log('Voice connection ready!');
			});

			const player = createAudioPlayer();
			const resource = createAudioResource(join(__dirname, 'monday-left-me-broken.mp3'));

			player.play(resource);
			connection.subscribe(player);

			player.on(AudioPlayerStatus.Playing, () => {
				console.log('Playing audio!');
			});

			return interaction.reply(`Joined: ${authorVoiceChannel.name}`);
		} catch (error) {
			console.error(error);
			return interaction.reply('Error joining voice channel!');
		}
	},
};
