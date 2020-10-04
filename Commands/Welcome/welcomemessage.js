const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const welcomeMessages = new Keyv(process.env.welcomeMessages);
const toggleWelcomeMsg = new Keyv(process.env.toggleWelcomeMsg);
const logChannels = new Keyv(process.env.logChannels);

module.exports = {
  name: 'welcomemessage',
  description: `Sets a custom welcome message to be displayed when someone joins the server.`,
  usage: 'welcomemessage [message]',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomemessage [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const welcomeChName = await welcomeChannels.get(`welcomechannel_${message.guild.id}`);
    const welcomeChannel = await message.guild.channels.cache.find((ch) => ch.name === `${welcomeChName}`);
    if (!welcomeChannel) {
      let msg = await message.channel.send(`You need to set a channel for welcome messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const msg = args.join(' ');
    await welcomeMessages.set(`welcomemessage_${message.guild.id}`, msg);
    await toggleWelcomeMsg.set(`togglewelcomemsg_${message.guild.id}`, 1);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) message.channel.send(`Welcome message successfully changed to ${'`' + msg + '`'}`);
    else log.send(`Welcome message successfully changed to ${'`' + msg + '`'}`);
    message.react('✔️');
  }
}