const {RichEmbed} = require("discord.js")
const {footer} = require(__dirname + "/../config/config.js")

module.exports = {
    name: "clear",
    description: "Usuwa wiadomości z kanału",
    args: 1,
    usage: "clear <ilosc_wiadomosci>",
    aliases: ["purge", "c"],

    run(msg,args) {
        const {channel} = msg
        const ammount = parseInt(args[0])

        if (!Number.isInteger(ammount)) {
            const embed = new RichEmbed()
            .setTitle("Error")
            .setColor(0xFF0000)
            .setDescription("Liczba wiadomości musi być liczbą!")
            .setFooter(footer)
    
            return channel.send(embed)
        }

        if(ammount<2 || ammount >=100) {
            const embed = new RichEmbed()
            .setTitle("Error")
            .setColor(0xFF0000)
            .setDescription("Ilość wiadomości do usunięcia musi być:")
            .addField("Większa od:", "1", true)
            .addField("Mniejsza od:", "100", true)
            .setFooter(footer)
    
            return channel.send(embed)
        }

        channel.bulkDelete(ammount)
    }
}