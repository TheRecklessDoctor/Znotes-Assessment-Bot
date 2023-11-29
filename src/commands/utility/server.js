const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
            .setName("server")
            .setDescription("Provides details about the server"),
    async execute(interaction) {
        await interaction.reply(`The bot is used on ${interaction.guild.name} which has ${interaction.guild.memberCount} members.`);
    },
};