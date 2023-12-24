const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus,generateDependencyReport } = require('@discordjs/voice');
// const client = require('../app.js');

// Show dependencies
// console.log(generateDependencyReport());


module.exports = {
	data: new SlashCommandBuilder()
	.setName('join')
	.setDescription('Let me IN!!!!'),
	async execute(interaction) {
		console.log('Executing `join` command');

		const authorVoiceChannel = interaction.member?.voice.channel;
		if (!authorVoiceChannel) {
			return interaction.reply('You need to be in a voice channel to use this command.');
		}
		console.log(authorVoiceChannel.id);

		console.log('Establishing connection');
		const connection = joinVoiceChannel({
			channelID: authorVoiceChannel.id,
			guildID: authorVoiceChannel.guild.id,
			adapterCreator: authorVoiceChannel.guild.voiceAdapterCreator, // TODO: need a voiceAdapterCreator
		});
		console.log('waiting for love');
		await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
		console.log('come around');
		console.log('After entersState');
		connection.on(VoiceConnectionStatus.Ready, () => {
			console.log('Voice connection ready!');
		});

		const player = createAudioPlayer();

		const resource = createAudioResource('../monday-left-me-broken.mp3');

		player.play(resource);
		connection.subscribe(player);

		return interaction.reply(`Joined: ${authorVoiceChannel.name}`);
	},
};
