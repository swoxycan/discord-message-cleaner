const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

// data.txt okuma kısmını kaldırıp, config'den alıyoruz
client.login(config.token);

client.on('ready', async () => {
    console.log('Bot hazır!');
    
    // Tüm DM kanallarını al
    const dmChannels = client.channels.cache.filter(channel => channel.type === 'dm');
    
    // Her DM kanalı için
    for (const [_, channel] of dmChannels) {
        try {
            // Son 100 mesajı al
            const messages = await channel.messages.fetch({ limit: 100 });
            
            // Sadece botun sahibinin mesajlarını filtrele
            const userMessages = messages.filter(msg => msg.author.id === client.user.id);
            
            // Mesajları sil
            for (const [_, message] of userMessages) {
                await message.delete();
                // Rate limit'e takılmamak için kısa bir bekleme
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            console.log(`${channel.recipient.tag} ile olan DM'deki mesajlar silindi.`);
        } catch (error) {
            console.error(`Hata: ${error.message}`);
        }
    }
    
    console.log('Tüm DM mesajları silindi!');
    // İşlem bitince botu kapat
    client.destroy();
}); 