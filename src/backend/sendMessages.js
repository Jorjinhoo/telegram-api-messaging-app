// const api = require('./api');


// const sendMessages = async (allAccFolders, selectedFoldersList, messageText) => {
  
//     for (const peer of allAccFolders.include_peers) {

//       const selectedFolder = selectedFoldersList.find(folder => folder.title === peer.title);

//        if (selectedFolder) {
//         try {
//           const chatsResp = await api.call('messages.sendMessage', {
//             peer: {
//               _: peer._,
//               channel_id: peer.channel_id,
//               access_hash: peer.access_hash
//             },
//             message: messageText,
//             random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
//           });
//         } catch (error) {
//           console.error('Ошибка при отправке сообщения:', error);
//         }
//       }
//     }
//   }

// mudule.exports = sendMessages;