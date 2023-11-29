const fs = require("node:fs")
const path = require("node:path")
const {Client, GatewayIntentBits, Events, Collection} = require("discord.js");
const config = require("../config.json");

// discord client
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});
// access commands in another file
client.commands = new Collection(); 

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) {
    const commandPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js")); //filter out non-js files

    for(const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);

        if("data" in command && "execute" in command) { //ensure each command has both data and execute properties
            client.commands.set(command.data.name, command); //set a new item in the collections with key being command name and value being exported module
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// initial message
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}.`);
});

// handle interaction events for slash commands
client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`Error! No command named ${interaction.commandName} is specified`);
        return;
    }

    // execute command's "execute" method
    try {
        await command.execute(interaction);
    }catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }

});


// use the bot token to login to the bot 
client.login(config["BOT_TOKEN"]);

