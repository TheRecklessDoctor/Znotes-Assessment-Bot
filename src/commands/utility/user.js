const {SlashCommandBuilder} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
            .setName("user")
            .setDescription("provides command user details"),
    async execute(interaction){
        await interaction.reply(`The command was run by ${interaction.user.username} who joined at ${interaction.member.joinedAt}.`);
    },
};