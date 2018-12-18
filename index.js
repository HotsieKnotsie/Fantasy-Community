const discord = require("discord.js");
const config = require("./config.json");

const bot = new discord.Client();
bot.commands = new discord.Collection();

bot.on("ready", async () => {

    bot.user.setActivity('on Play.fantasyServer.eu 1.9x', { type: 'PLAYING' });
    console.log(`${bot.user.username} is online!`);

});

bot.on("guildMemberRemove", member => {

    const channel = member.guild.channels.find("name", "join-leave");

    if (!channel) return;


    var joinembed = new discord.RichEmbed()
        .setColor("#ff0000")
        .addField(`Goodbye!`, "Sadly someone left the Discord server!")
        .addField("We need to say goodbye to.", `➸ ${member.user.username}, we hope that we will see u in the future back!`)
        .setFooter(`© Fantasy`)
        .setTimestamp();

    channel.send(joinembed);

});

bot.on("guildMemberAdd", member => {

    const channel = member.guild.channels.find("name", "join-leave");

    if (!channel) return;

    var leaveembed = new discord.RichEmbed()
        .setColor("#7cfc00")
        .setTitle(`**Welkom!**`)
        .addField("Er is zojuist een nieuwe gebruiker aangekomen!", `➸ Welkom ${member.user}, we wish you a great time int this Discord server!`)
        .addField("For important information:", `➸ Read ${"<#474197840327868427>"}!`)
        .setFooter(`© Fantasy`)
        .setTimestamp();

    channel.send(leaveembed);

});

bot.on("message", async message => {

    // Als bot bericht stuurt stuur dan return
    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var prefix = config.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    var arguments = messageArray.slice(1);

    var modrole = config.modrole;

    var msg = message.content.toLowerCase();

    if (command === `${prefix}kick`) {

        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));
        if (!kUser) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Kan gebruiker niet vinden.`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        let kReason = arguments.join(" ").slice(22);
        if (kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Je kunt die gebruiker niet kicken.`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));

        let kickEmbed = new discord.RichEmbed()
        .setTitle("Iemand heeft zijn stoute schoenen gedragen!!!")
        .setColor("ff0000")
        .setFooter(`Speler gekickt`, `${kUser.user.displayAvatarURL}`)
        .setTimestamp()
        .addField("_ _", `**Uitvoerder:** ${message.author.username}\n**Doelwit**: ${kUser.user.username}\n**Reden:** ${kReason}\n**Actie:** KICK`);

        let kickChannel = message.guild.channels.find("name", "mod-logs");
        if (!kickChannel) return message.channel.send("Kan het channel niet vinden");
        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);

        return;
    }

    if (command === `${prefix}ban`) {

        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(arguments[0]));
        if (!bUser) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Kan gebruiker niet vinden.`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        let bReason = arguments.join(" ").slice(22);
        if (bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Je kunt die gebruiker niet bannen.`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));

        let banEmbed = new discord.RichEmbed()
        .setTitle("Iemand heeft zijn stoute schoenen gedragen!!!")
        .setColor("ff0000")
        .setFooter(`Speler gebant`, `${bUser.user.displayAvatarURL}`)
        .setTimestamp()
        .addField("_ _", `**Uitvoerder:** ${message.author.username}\n**Doelwit**: ${bUser.user.username}\n**Reden:** ${bReason}\n**Actie:** BAN`);
        
        let banChannel = message.guild.channels.find("name", "mod-logs");
        if (!banChannel) return message.channel.send("Kan het channel niet vinden");
        message.guild.member(bUser).ban(bReason);
        banChannel.send(banEmbed);

        return;
    }
    
    if (command === `${prefix}mute`) {
        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(arguments[0]);
        if(!toMute) return message.channel.sendMessage(({
            embed: {
                color: 0xec4040,
                description: `Kan gebruiker niet vinden`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        let mReason = arguments.join(" ").slice(22);
        
        var role = message.guild.roles.find("name", "Mute");
        
        if(toMute.roles.has(role.id)) return message.channel.sendMessage(({
            embed: {
                color: 0xec4040,
                description: `Deze gebruiker is al gemuted.`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));

        let muteChannel = message.guild.channels.find("name", "mod-logs");
        if (!muteChannel) return message.channel.send("Kan het channel niet vinden");

        let muteEmbed = new discord.RichEmbed()
        .setTitle("Iemand heeft zijn stoute schoenen gedragen!!!")
        .setColor("ff0000")
        .setFooter(`Speler gemute`, `${toMute.user.displayAvatarURL}`)
        .setTimestamp()
        .addField("_ _", `**Uitvoerder:** ${message.author.username}\n**Doelwit**: ${toMute.user.username}\n**Reden:** ${mReason}\n**Actie:** MUTE`);
        
        await toMute.addRole(role);
        muteChannel.send(muteEmbed); 

        return;
    }

    if (command === `${prefix}unmute`) {
        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        
        let tounMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(arguments[0]);
        if(!tounMute) return message.channel.sendMessage(({
            embed: {
                color: 0xec4040,
                description: `Kan gebruiker niet vinden.`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        let unmReason = arguments.join(" ").slice(22);
        
        var role = message.guild.roles.find("name", "Mute");

        let unmuteChannel = message.guild.channels.find("name", "mod-logs");
        if (!unmuteChannel) return message.channel.send("Kan het channel niet vinden");

        let unmuteEmbed = new discord.RichEmbed()
        .setTitle("Iemand heeft zich weer gedragen!!!")
        .setColor("7cfc00")
        .setFooter(`Speler geunmute`, `${tounMute.user.displayAvatarURL}`)
        .setTimestamp()
        .addField("_ _", `**Uitvoerder:** ${message.author.username}\n**Doelwit**: ${tounMute.user.username}\n**Reden:** ${unmReason}\n**Actie:** UNMUTE`);
        
        await tounMute.removeRole(role);
        unmuteChannel.send(unmuteEmbed); 

        return;
    }

    if (command === `${prefix}clear`) {
        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        if (!arguments[0]) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `**Gebruik **!clear <getal minimaal 2>`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        message.channel.bulkDelete(arguments[0]).then(() => {
            message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `${arguments[0]} berichten verwijderd.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        }); 
    }

    if (command === `${prefix}say`) {
        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        if (arguments.length == 0) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Gebruik **!say <message>**`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        message.delete();
        const sayMessage = arguments.join(" ");
        message.channel.send(sayMessage);
        message.delete("!say");
    }

    if (command === `${prefix}message`) {
        if (!message.member.roles.some(r => [`${modrole}`].includes(r.name)))
            return message.channel.send(({
                embed: {
                    color: 0xec4040,
                    description: `Je kunt dit niet.`
                }
            })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        if (arguments.length == 0) return message.channel.send(({
            embed: {
                color: 0xec4040,
                description: `Gebruik **!message <message>**`
            }
        })).then(msg => { msg.delete(3000) }).then(message.delete(3000));
        message.delete();
        const messageMessage = arguments.join(" ");

        let messageembed = new discord.RichEmbed()
            .setDescription(messageMessage)
            .setColor("#ff8100");

        message.channel.send(messageembed);
        message.delete("!message");
    }
    
});

bot.login("NTI0MjQ0NjI3NDM2NDcwMjcz.DvlQdg.m5v0K3jbrUW3dIaU8ak0dYadHCM");