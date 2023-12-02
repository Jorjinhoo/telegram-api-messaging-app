const api = require('./src/backend/api');
const auth = require('./src/backend/auth');
const sendMessages = require('./src/backend/sendMessages');
const fs = require('fs');

(async () => {
  const results = await sendMessages();
  console.log('Результаты отправки сообщений:', results);
})();


// (async () => {
//   const resolvedPeer = await api.call('messages.getDialogFilters', {
   
//   });
//   console.log(resolvedPeer);
// })();

// (async () => {
//   // await auth();

//   const chatsResp = await api.call('messages.sendMessage', {
//     peer: {
//       _: 'inputPeerChannel',
//       channel_id: '1640562245',
//       access_hash: '7179286493638749396'
//     },
//     message: 'Hello',
//     random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
//   });

//   // const chat = chatsResp.chats.filter(chat => chat.id === '-1002049005035');

//   console.log(chatsResp);

// })()






// (async () => {
//   const resolvedPeer = await api.call('contacts.resolveUsername', {
//     username: 'Lesha',
//   });
//   console.log(resolvedPeer);

//   const channel = resolvedPeer.chats.find(
//     (chat) => chat.id === resolvedPeer.peer.channel_id
//   );

//   const inputPeer = {
//     _: 'inputPeerChannel',
//     channel_id: channel.id,
//     access_hash: channel.access_hash,
//   };

//   const LIMIT_COUNT = 10;
//   const allMessages = [];

//   const firstHistoryResult = await api.call('messages.getHistory', {
//     peer: inputPeer,
//     limit: LIMIT_COUNT,
//   });

//   const historyCount = firstHistoryResult.count;

//   for (let offset = 0; offset < historyCount; offset += LIMIT_COUNT) {
//     const history = await api.call('messages.getHistory', {
//       peer: inputPeer,
//       add_offset: offset,
//       limit: LIMIT_COUNT,
//     });

//     allMessages.push(...history.messages);
//   }

//   console.log('allMessages:', allMessages);
// })();


// (async () => {
//   await auth();

//   const chatsResp = await api.call('messages.sendMessage', {
//     peer: {
//       _: 'inputPeerUser',
//       user_id: 555791827,
//       access_hash: xxx
//     },
//     message: 'Hello @mtproto_core',
//     random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
//   });

//   // const chat = chatsResp.chats.filter(chat => chat.id === '-1002049005035');

//   console.log(chatsResp);

// })()


