const { Collection, RichEmbed } = require("discord.js")
const { readdirSync } = require("fs")
const ascii = require("ascii-table")
const {footer, cmdCooldown} = require(__dirname + "/../config/config.js")

const table = new ascii().setHeading("File", "Command", "Args", "Usage", "Description", "Load Status")
const aliasesTable = new ascii().setHeading("File", "Command", "Aliases")

module.exports = (client) => {
    client.commands = new Collection()
    const cooldown = new Collection()


    const commandFiles = readdirSync(__dirname + "/../commands").filter(file => 
        file.endsWith(".command.js"),
    )

    for (const file of commandFiles) {
        const command = require(__dirname + `/../commands/${file}`)
        
        if(command.name) {
            if(command.description) {
                if(command.args) {
                    if(command.usage) {
                        client.commands.set(command.name, command)
                        table.addRow(file, command.name,command.args,command.usage, command.description, "✅")
                    } else {
                        table.addRow(file, command.name,command.args,"❌", command.description, "❌")
                    }
                } else {
                    if(command.usage) {
                        client.commands.set(command.name, command)
                        table.addRow(file, command.name,"❌",command.usage, command.description, "✅")
                    } else {
                        table.addRow(file, command.name,"❌","❌", command.description, "❌")
                    }
                }
            } else {
                table.addRow(file, command.name, "❌", "❌")
            }
        } else {
            if(command.description) {
                if(command.args) {
                    if(command.usage) {
                        table.addRow(file, "❌",command.args,command.usage, command.description, "❌")
                    } else {
                        table.addRow(file, "❌",command.args,"❌", command.description, "❌")
                    }
                } else {
                    if(command.usage) {
                        table.addRow(file, "❌","❌",command.usage, command.description, "❌")
                    } else {
                        table.addRow(file, "❌","❌","❌", command.description, "❌")
                    }
                }
            } else {
                if(command.args) {
                    if(command.usage) {
                        table.addRow(file, "❌",command.args,command.usage, "❌", "❌")
                    } else {
                        table.addRow(file, "❌",command.args,"❌", "❌", "❌")
                    }
                } else {
                    if(command.usage) {
                        table.addRow(file, "❌","❌",command.usage, "❌", "❌")
                    } else {
                        table.addRow(file, "❌","❌","❌", "❌", "❌")
                    }
                }
            }
        }

        if(command.name) {
            if(command.aliases) {
                aliasesTable.addRow(file, command.name, command.aliases)
            } else {
                aliasesTable.addRow(file, command.name, "❌")
            }
            
        }
    }

    console.log(table.toString())
    console.log(aliasesTable.toString())

    client.on("message", msg => {
  
        const {author, guild, channel} = msg
        if(author.bot || !guild) {
          return
        }
      
        const prefix = client.settings.get(guild.id).prefix

        if(!msg.content.startsWith(prefix)) return
      
        const args = msg.content
                    .slice(prefix.length)
                    .trim()
                    .split(/ +/g)
      
        const cmdName = args.shift().toLowerCase()

        const cmd = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName))

        if(!cmd) return
        if(cmd.args && args.length < cmd.args) {
            const embed = new RichEmbed()
            .setTitle("Error")
            .setColor(0xFF0000)
            .setDescription("Komenda musi zawierać argumenty!")
            .addField("Prawidłowe użycie:", `\``+prefix+cmd.usage+`\``)
            .setFooter(footer)
    
            return channel.send(embed)
        }

        if(!cooldown.has(author.id)) {
            cooldown.set(author.id, 0)
        }

        const now = Date.now()
        const userCooldown = cooldown.get(author.id)
        const cooldownAmmount = cmdCooldown*1000

        if(now<userCooldown) {
            msg.delete()
            const timeToEnd = (userCooldown-now)/1000
            const embed = new RichEmbed()
            .setTitle("Error")
            .setColor(0xFF0000)
            .setDescription("Musisz odczekać przed użyciem komendy jeszcze "+ timeToEnd.toFixed(2) + " sekund")
            .setFooter(footer)
    
            channel.send(embed)

            return
        }
        try {
            msg.delete()
            cooldown.set(author.id, now+cooldownAmmount)
            cmd.run(msg, args)
        } catch(error) {
            msg.delete()
            console.log(error)
            const embed = new RichEmbed()
            .setTitle("Error")
            .setColor(0xFF0000)
            .setDescription("Wystąpił błąd podczas wykonywania komendy. Twórca bota został już o tym poinformowany!")
            .setThumbnail(client.user.avatarURL)
            .setFooter(footer)
    
            channel.send(embed)
        }
      })

    
}