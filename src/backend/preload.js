const { contextBridge } = require('electron');
const fs = require('fs');
const { API, setApiConfigData } = require('./api');
const auth = require('./auth');
const path = require('path');


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
        await auth(apiTel, code);

      } catch (e) {
        console.error('Произошла ошибка при записи в файл:', e);
      }
    },
    setApiConfig: async (apiTel) => {
      await setApiConfigData(apiTel);
    },
    getAccFolders: async () => {
        const api = new API();
        let resolvedPeer = await api.call('messages.getDialogFilters', {});
        return resolvedPeer;
    },
    sendMessages: async (allAccFolders, selectedFoldersList, messageText) => {
      const api = new API();
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
                } catch (e) {
                  console.error('Ошибка при отправке сообщения:', e);
                }
              }
            }
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
        }
      });

      return apiTelValues;
    }
});