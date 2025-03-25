import fetch from 'node-fetch';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const delay = 2000;
const baseURL = 'https://discord.com/api/v9';

let deletedMessagesCount = 0;
function incrementCounter() {
  deletedMessagesCount++;
  return deletedMessagesCount;
}

function logMessage(message) {
  const timestamp = new Date().toLocaleString();
  const log = `[${timestamp}] ${message}\n`;
  fs.appendFileSync('log.txt', log, 'utf-8');
  console.log(log.trim());
}

async function getFriends() {
  try {
    const response = await fetch(`${baseURL}/users/@me/relationships`, {
      headers: {
        'Authorization': config.token,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.filter(friend => friend.type === 1);
  } catch (error) {
    logMessage(`Arkadaş listesi alınamadı: ${error.message}`);
    return [];
  }
}

async function getGuilds() {
  const response = await fetch(`${baseURL}/users/@me/guilds`, {
    headers: {
      'Authorization': config.token,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
}

async function getGuildChannels(guildId) {
  const response = await fetch(`${baseURL}/guilds/${guildId}/channels`, {
    headers: {
      'Authorization': config.token,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
}

async function getDMChannel(userId) {
  const response = await fetch(`${baseURL}/users/@me/channels`, {
    method: 'POST',
    headers: {
      'Authorization': config.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient_id: userId
    })
  });
  return await response.json();
}

async function getMessages(channelId, before = null) {
  let url = `${baseURL}/channels/${channelId}/messages?limit=100`;
  if (before) url += `&before=${before}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': config.token,
      'Content-Type': 'application/json'
    }
  });
  return await response.json();
}

async function deleteMessage(channelId, messageId) {
  await fetch(`${baseURL}/channels/${channelId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': config.token
    }
  });
}

async function clearChannelMessages(channelId, userName) {
  let lastMessageId = null;
  
  while (true) {
    const messages = await getMessages(channelId, lastMessageId);
    
    if (!Array.isArray(messages) || messages.length === 0) break;
    
    const userMessages = messages.filter(msg => msg.author.id === config.userId);
    
    if (userMessages.length === 0) break;
    
    for (const message of userMessages) {
      try {
        await deleteMessage(channelId, message.id);
        const count = incrementCounter();
        logMessage(`${userName} - Silinen mesaj: ${count}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        logMessage(`Mesaj silme hatası: ${error.message}`);
      }
    }
    
    lastMessageId = messages[messages.length - 1].id;
  }
}

async function clearMessages() {
  try {
    const friends = await getFriends();
    
    if (!Array.isArray(friends)) {
      logMessage("Arkadaş listesi alınamadı, DM'ler atlanıyor...");
    } else {
      logMessage(`${friends.length} arkadaş bulundu.`);
      
      for (const friend of friends) {
        try {
          if (!friend.user) continue;
          
          const dmChannel = await getDMChannel(friend.user.id);
          if (!dmChannel || !dmChannel.id) {
            logMessage(`${friend.user.username} ile DM kanalı açılamadı, geçiliyor...`);
            continue;
          }
          
          logMessage(`${friend.user.username} ile olan mesajlar siliniyor...`);
          await clearChannelMessages(dmChannel.id, friend.user.username);
          logMessage(`${friend.user.username} ile olan tüm mesajlar silindi.`);
        } catch (error) {
          logMessage(`DM silme hatası (${friend.user?.username || 'Bilinmeyen'}): ${error.message}`);
        }
      }
    }

    const guilds = await getGuilds();
    logMessage(`${guilds.length} sunucu bulundu.`);
    
    for (const guild of guilds) {
      try {
        const channels = await getGuildChannels(guild.id);
        logMessage(`${guild.name} sunucusunda mesajlar siliniyor...`);
        
        for (const channel of channels) {
          if (channel.type === 0) {
            try {
              await clearChannelMessages(channel.id, `${guild.name}/#${channel.name}`);
              logMessage(`${guild.name}/#${channel.name} kanalındaki mesajlar silindi.`);
            } catch (error) {
              logMessage(`Kanal silme hatası (${channel.name}): ${error.message}`);
            }
          }
        }
        
        logMessage(`${guild.name} sunucusundaki tüm mesajlar silindi.`);
      } catch (error) {
        logMessage(`Sunucu silme hatası (${guild.name}): ${error.message}`);
      }
    }
    
    logMessage('Tüm mesajlar silindi!');
    process.exit(0);
    
  } catch (error) {
    logMessage(`Genel hata: ${error.message}`);
    process.exit(1);
  }
}

logMessage('Program başlatıldı!');
clearMessages();
