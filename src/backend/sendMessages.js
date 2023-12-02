const api = require('./api');
const getUserInput = require('./getUserInput');
const getAccFolder = require('./getAccFolder');

const sendMessages = async () => {
    // await auth();
    const accFolder = await getAccFolder();
    const userInput = await getUserInput('Введите текст сообщения: ');
  
    const results = [];
  
    for (const peer of accFolder.include_peers) {
      try {
        const chatsResp = await api.call('messages.sendMessage', {
          peer: {
            _: peer._,
            channel_id: peer.channel_id,
            access_hash: peer.access_hash
          },
          message: userInput,
          random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
        });
  
        results.push(chatsResp);
      } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        results.push({ error: true, errorMessage: error.message });
      }
    }
  
    return results;
  };
  
  module.exports = sendMessages;