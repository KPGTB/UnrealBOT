const { Client, RichEmbed } = require("discord.js")
const color = require("chalk")

const {token, footer} = require("./config/config.js")

const client = new Client()

const settingsHandler = require("./handlers/settings.handler")
settingsHandler(client)

const commandHandler = require("./handlers/command.handler")
commandHandler(client)

const log = console.log 

client.on("ready", () => {

  const {settings} = client

  client.guilds.forEach(guild => {
    if (!settings.get(guild.id)) {
      settings.set(guild.id, { prefix: "!" })
    }
      client.saveConfig(guild.id)
  })
  
  log(color.gray("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="))
  log("")
  log(color.black.bgGreen("Bot został pomyślnie włączony!"))
  log(color.black.bgGreen("Zalogowano jako "+color.bgRed.underline(client.user.tag)))
  log(color.black.bgGreen("Aktualnie jest godzina "+color.bgYellow(new Date().toLocaleTimeString()+" ("+new Date().toLocaleDateString()+")")))
  log("")
  log(color.gray("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="))
})


client.on("message", (msg) => {

  const {author, guild, channel} = msg
  if(author.bot || !guild) {
    return
  }
  if(msg.content=="<@!770377382863044688>") {
        const embed = new RichEmbed()
        .setTitle("Informacje o bocie")
        .setColor(0xFF0000)
        .setDescription("UnrealBOT to innowacyjny, wielofunkcyjny bot.")
        .addField("Autor", "KPG-TB", true)
        .addField("Wersja", "1.0.0", true)
        .addField("Prefix", client.settings.get(guild.id).prefix, true)
        .setThumbnail(client.user.avatarURL)
        .setFooter(footer)
  
        channel.send(embed)
        msg.delete()
  }
})
client.login(token)

client.on("debug", () => {})
client.on("warn ", () => {})
client.on("error", () => {})