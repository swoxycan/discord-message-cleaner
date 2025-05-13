const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.login(config.token);

client.on('ready', async () => {
    console.log('Bot hazır!');
    
    const dmChannels = client.channels.cache.filter(channel => channel.type === 'dm');
    
    for (const [_, channel] of dmChannels) {
        try {
            
            const messages = await channel.messages.fetch({ limit: 100 });
            
            const userMessages = messages.filter(msg => msg.author.id === client.user.id);
            
            for (const [_, message] of userMessages) {
                await message.delete();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            console.log(`${channel.recipient.tag} ile olan DM'deki mesajlar silindi.`);
        } catch (error) {
            console.error(`Hata: ${error.message}`);
        }
    }
    
    console.log('Tüm DM mesajları silindi!');
    client.destroy();
}); 
