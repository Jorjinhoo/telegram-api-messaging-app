const { contextBridge } = require('electron');
const fs = require('fs');
const { API, setApiConfigData } = require('./api');
const auth = require('./auth');
const path = require('path');

let stopSandMessage = false;

contextBridge.exposeInMainWorld('electron', {
    userAuth: async (apiId, apiHash, apiTel, code) => {
      const config = {
        apiTel: {
          apiId: apiId,
          apiHash: apiHash,
          apiTel: apiTel,
          code: code
        }
      };
      try {
        const jsonString = JSON.stringify(config, null, 2);
        const filePath = path.resolve(__dirname, 'authData/configs', `config${apiTel}.json`);

        await fs.writeFile(filePath, jsonString, (err) =>
          err ? console.error(`Ошибка при записи файла: ${err}`) : console.log(`Файл ${filePath} успешно создан и записан.`)
        );

        await setApiConfigData(apiTel);
        const isAuth = await auth(apiTel, code);

        return isAuth;
      } catch(e){
        return e;
      }
    },
    setApiConfig: async (apiTel) => {
      try{
        await setApiConfigData(apiTel);
      }catch(e){
        return e
      }
    },
    getAccFolders: async () => {
        const api = new API();
        let resolvedPeer = await api.call('messages.getDialogFilters', {});
        return resolvedPeer;
    },
    sendMessages: async (allAccFolders, selectedFoldersList, messageText, delay, updateSendStatus) => {
      stopSandMessage = !stopSandMessage;

      const api = new API();

      const filteredFolders = allAccFolders.filter(folder => selectedFoldersList.includes(folder.title));
      try{
        for (const folder of filteredFolders) {
          for (const peer of folder.include_peers){
            if(peer._ == 'inputPeerChannel' && stopSandMessage) {
              updateSendStatus(folder, peer);
              try{
                await api.call('messages.sendMessage', {
                  peer: {
                    _: peer._,
                    channel_id: peer.channel_id,
                    access_hash: peer.access_hash
                  },
                  message: messageText,
                  random_id: Math.ceil(Math.random() * 0xffffff) + Math.ceil(Math.random() * 0xffffff),
                });

                await new Promise(resolve => setTimeout(resolve, delay));
              }catch(e){
                if(e.error_message === 'CHANNEL_PRIVATE'){
                  return { error: e, channel_id: peer.channel_id };
                }else{
                  return e;
                }
              }
            }else if(!stopSandMessage){
              return 'stop';
            }
          }
        }
        stopSandMessage = false;
        return 'good';
      }catch (e) {
        stopSandMessage = false;
        console.error('Ошибка при отправке сообщения:', e);
        return e;
      }
    },
    addUserName: async () => {
      const api = new API();
      try{
        const user = await api.call('users.getFullUser', {
          id: {
            _: 'inputUserSelf',
          },
        });
    
        return user.users[0].first_name;
      }catch(e){
        console.log(e);
        return false;
      }
    },
    getAllLoginAcc: () => {
      const folderPath = path.resolve(__dirname, 'authData/configs');

      const apiTelValues = [];

      fs.readdirSync(folderPath).forEach(file => {
        
        const filePath = path.resolve(folderPath, file);
    
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        try {
            const jsonData = JSON.parse(fileContent);
    
            if (jsonData.apiTel && jsonData.apiTel.apiTel) {
                apiTelValues.push(jsonData.apiTel.apiTel);
            }
        } catch (error) {
            console.error(`Ошибка при чтении файла ${file}: ${error.message}`);
            addMessageBanner(`Ошибка при чтении файла конфига ${file}: ${error.message}`, 'red')
        }
      });

      return apiTelValues;
    },
    removeAccount: (accountTel, folder, filePrefix) => {
      const folderPath = path.resolve(__dirname, folder);

      fs.readdirSync(folderPath).forEach(file => {
        
        const filePath = path.resolve(folderPath, file);
        const removedFilePath = path.resolve(folderPath, `${filePrefix}${accountTel}.json`)
        console.log(filePath);
        console.log(removedFilePath);
        if(filePath == removedFilePath){
          fs.unlink(filePath, (e) => {
            if (e) {
                console.error(`Error deleting file ${filePath}:`, e);
                addMessageBanner(e, 'red');
            } else {
                addMessageBanner(`Account ${accountTel} has been deleted`, 'green');
                console.log(`File ${filePath} has been deleted.`);
            }
        });
        }
      });
    },
});