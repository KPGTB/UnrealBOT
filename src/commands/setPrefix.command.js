const {RichEmbed} = require("discord.js")
const {footer} = require(__dirname + "/../config/config.js")

module.exports = {
    name: "setprefix",
    description: "Ustawia prefix bota",
    args: 1,
    usage: "setPrefix <prefix>",
    aliases: ["sp"],

    run(msg,args) {
        const {channel, guild, client} = msg

        const embed = new RichEmbed()
        .setTitle("Zmieniono prefix!")
        .setColor(0xFF0000)
        .setDescription("")
        .addField("Stary prefix", client.settings.get(guild.id).prefix, true)
        .addField("Nowy prefix", args[0], true)
        .setThumbnail(client.user.avatarURL)
        .setFooter(footer)
  
        channel.send(embed)

        client.settings.get(guild.id).prefix = args[0]
        client.saveConfig(guild.id)
    }
}