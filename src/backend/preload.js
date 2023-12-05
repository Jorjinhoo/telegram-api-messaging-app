const { contextBridge } = require('electron');
const api = require('./api');
// const getAccFolders = require('./getAccFolders');
// const sendMessages = require('./sendMessages');


contextBridge.exposeInMainWorld('electron', {
    getAccFolders: async () => {
        let resolvedPeer = await api.call('messages.getDialogFilters', {});
        return resolvedPeer;
    },
    sendMessages: async (allAccFolders, selectedFoldersList, messageText) => {
      const filteredFolders = allAccFolders.filter(folder => selectedFoldersList.includes(folder.title));
        for (const folder of filteredFolders) {
            for (const peer of folder.include_peers) {
              if(peer._ == 'inputPeerChannel'){
                try {
                  await api.call('messages.sendMessage', {
                    peer: {
                      _: peer._,
                      channel_id: peer.channel_id,
                      access_hash: peer.access_hash
                    },
                    message: messageText,
                    random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
                  });
                } catch (error) {
                  console.error('Ошибка при отправке сообщения:', error);
                }
              }
            }
        }
    }
});

// contextBridge.exposeInMainWorld('electron', {
//     getAccFolders: async () => {
//         let folders = await getAccFolders();
//         return folders;
//     },
//     sendMessages: async (allAccFolders, selectedFoldersList, messageText) => {
//         sendMessages(allAccFolders, selectedFoldersList, messageText);
//     }
// });