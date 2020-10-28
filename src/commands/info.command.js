const { RichEmbed } = require("discord.js")
const {footer} = require(__dirname + "/../config/config.js")

module.exports = {

    name: "info",
    description: "Informacje o bocie",
    usage: "info",
    aliases: ["bot", "prefix"],

    run(msg) {
        const {channel, guild, client} = msg
        const prefix = client.settings.get(guild.id).prefix

        const embed = new RichEmbed()
        .setTitle("Informacje o bocie")
        .setColor(0xFF0000)
        .setDescription("UnrealBOT to innowacyjny, wielofunkcyjny bot.")
        .addField("Autor", "KPG-TB", true)
        .addField("Wersja", "1.0.0", true)
        .addField("Prefix", prefix, true)
        .setThumbnail(client.user.avatarURL)
        .setFooter(footer)
  
        channel.send(embed)
    }
}