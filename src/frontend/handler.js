let selectedFolders = [];
let allAccFolders = [];

//load folders
let loadFoldersBttnPressed = false;

const loadAccFolders = async () => {
  if (loadFoldersBttnPressed) {return;}

  selectedFolders = [];

  loadFoldersBttnPressed = true;

  let refreshIcon = document.getElementById('refresh-icon');
  refreshIcon.classList.add('spin-animation');

  try{
    let folderList = document.getElementById('folders-list');
    if(folderList){
        while (folderList.firstChild) {
            folderList.removeChild(folderList.firstChild);
        }
    }
  
    let accFolders = await window.electron.getAccFolders();
    allAccFolders = accFolders;
    accFolders.forEach(element => {
        addListItem(element.title, element.title, 'folders-list', 'folder');
    });
    
    setTimeout(function () {
      refreshIcon.classList.toggle('spin-animation');
      loadFoldersBttnPressed = false;
    }, 1000);

  }catch(e){
    if(e.error_message == 'CONNECTION_API_ID_INVALID'){
      addItem('absent-folders', 'SELECT ACC', 'folders-list', 'li');
      addMessageBanner('Account selection is required!!!', 'red');
    }else if(e.error_message == 'AUTH_KEY_UNREGISTERED'){
      addItem('absent-folders', 'FOLDERS NOT FOUND', 'folders-list', 'li');
      addMessageBanner('Не выполнен вход в аккаунт!!! Удалите аккаунт и заново выполните вход', 'red')
    }else{
      addItem('absent-folders', 'FOLDERS NOT FOUND', 'folders-list', 'li');
    }

    setTimeout(function () {
      refreshIcon.classList.toggle('spin-animation');
      loadFoldersBttnPressed = false;
    }, 1000);
  }
}

//update dropDown button
const updateDropDownBttn = async (accTel) => {
    const userName = await window.electron.addUserName();
    if(userName){
      document.getElementById("drop-down-button").innerHTML = userName
    }else{
      addMessageBanner(`Ошибка при загрузке ника аккаунта: ${accTel}`, 'red');
      document.getElementById("drop-down-button").innerHTML = accTel;
    }
}

//select folder
const selectItem = (itemType, itemId) => {
    let selectedItem = document.getElementById(itemId);
  
    if (selectedItem) {
      selectedItem.classList.toggle('active');
  
      if (itemType === 'folder') {
        if (selectedItem.classList.contains('active')) {
          selectedFolders.push(itemId);
          console.log(selectedFolders);
        } else {
          const index = selectedFolders.indexOf(itemId);
          if (index !== -1) {
            selectedFolders.splice(index, 1);
            console.log(selectedFolders);
          }
        }
      }
    }
  }

  //send messages status
  const updateSendStatus = (folder, peer) => {
    for (let i = 0; i < folder.include_peers.length; i++) {
      if(folder.include_peers[i].channel_id === peer.channel_id){
        console.log(`folder: ${folder.title}, peer: ${i + 1}, lenght: ${folder.include_peers.length}`);
        let isStatus = document.getElementById('sand-messages-status');
        if(isStatus)isStatus.remove();
        addItem(
          'sand-messages-status', 
          `EXECUTING:   FOLDER: ${folder.title}   CHAT: ${i + 1}/${folder.include_peers.length}`,
          'send-mess-stat-container'
          );
      }
    }
  }

  //send messages
  let startButtonPressed = false;

  const startSendMessages = async () => {

    startButtonPressed = !startButtonPressed;

    addActiveClass('start-bttn-spinner', 'loader');

    let messageText = document.getElementById('message-text-input').value;
    let delay = document.getElementById('delay-input').value;

    let result;

    if (allAccFolders.length > 0 && selectedFolders.length > 0 && messageText && delay) {
      delay = delay * 1000;
      result = await window.electron.sendMessages(allAccFolders, selectedFolders, messageText, delay, updateSendStatus);
    } else if(allAccFolders.length < 1){
      console.error('На аккаунте не обнаружено папок!!!');
      addMessageBanner('На аккаунте не обнаружено папок!!!', 'red');
    } else if(selectedFolders.length < 1){
      console.error('Нужно выбрать хотя бы 1 папку!!!');
      addMessageBanner('Нужно выбрать хотя бы 1 папку!!!', 'red');
    } else if(!messageText){
      console.error('Нужно ввести текст сообщения!!!');
      addMessageBanner('Нужно ввести текст сообщения!!!', 'red');
    } else if(!delay){
      console.error('Нужно ввести задержку!!!');
      addMessageBanner('Нужно ввести задержку для отпраки сообщений!!!', 'red');
    }

    setTimeout(async function () {
      removeActiveClass('start-bttn-spinner', 'loader');
      startButtonPressed = false;
      if(result == 'good'){
        addMessageBanner('The messages have been successfully sent', 'green')
      }else if (result == 'stop') {
        addMessageBanner('The process of sending is stopped', 'green')
      }else if (result.error.error_message && result.error.error_message === 'CHANNEL_PRIVATE' && result.channel_id ){
        // let channelName = await window.electron.getChannelName(result.channel_id, result.access_hash);
        addMessageBanner(`An error occurred during sending: 
                          ${result.error.error_message} 
                          channelID: 
                          ${result.channel_id}
                          Try to recreate current folder or remove private channels`, 
                          'red');
      }else if(result.error_message){
        addMessageBanner(`An error occurred during sending: ${result.error_message}`, 'red');
      }else{
        addMessageBanner(`An error occurred during sending: ${result}`, 'red');
      }
    }, 1000);
  }

  
  //add account
  let loginButtonPressed = false;

  const doLogin = async () => {
    if (loginButtonPressed) {return;}

    loginButtonPressed = true;
    addActiveClass('submit-bttn-spinner', 'loader');

    let apiId = document.getElementById('input-api-id').value.toString();
    let apiHash = document.getElementById('input-api-hash').value;
    let apiTel = document.getElementById('input-api-tel').value.toString();
    let code = document.getElementById('input-api-code').value.toString();

    try{
      if(apiId && apiHash && apiTel){
        const isAuth = await window.electron.userAuth(apiId, apiHash, apiTel, code ? code : '');
    
        if(code && isAuth === true){
          addMessageBanner(`Account: ${apiTel} has been added`, 'green');
          location.reload(); 
        }

        if(isAuth.error_message){
          switch(isAuth.error_message){
            case 'PHONE_CODE_INVALID':
              addMessageBanner('Enter the code and submit the form again');
              break
            case 'API_ID_INVALID':
              addMessageBanner(`INVALID DATA!!!`, 'red');
              break
            case 'CONNECTION_API_ID_INVALID':
              addMessageBanner('TRY AGAIN', 'red');
              break
            case 'SESSION_PASSWORD_NEEDED':
              addMessageBanner('THIS ACCOUNT WITH 2FA AUTHENTICATION!!!', 'red');
              break
    
            default:
              addMessageBanner(`An error occurred during authorization: ${isAuth.error_message}`);
          }
        }else{
          addMessageBanner(`An error occurred during authorization: ${isAuth}`);
        }
  
      } else if(!apiId){
        console.error('Enter api Id!!!');
        addMessageBanner('Enter api Id!!!', 'red');
      } else if(!apiHash){
        console.error('Enter api Hash!!!');
        addMessageBanner('Enter api Hash!!!', 'red');
      } else if(!apiTel){
        console.error('Enter mobile number!!!');
        addMessageBanner('Enter mobile number!!!', 'red');
      }

      setTimeout(function () {
        removeActiveClass('submit-bttn-spinner', 'loader');
        loginButtonPressed = false;
      }, 1000);

    }catch(e){
      addMessageBanner(`An error occurred during authorization: ${e}`);
       
      setTimeout(function () {
        removeActiveClass('submit-bttn-spinner', 'loader');
        loginButtonPressed = false;
      }, 1000);
    }
  }

  //select account
  const selectAcc = async (accTel) => {
    try{
      await window.electron.setApiConfig(accTel);
      await updateDropDownBttn(accTel);
      await loadAccFolders();
      toggleList('tg-acc-list', 'drop-down-button', 'open');
    }catch(e){
      console.log(`Account select error: ${e}`);
      addMessageBanner(`Account select error: ${e}`, 'red');      
    }
  }

  //remove account
  const removeAccount = async (accountTel) => {
    try{
      window.electron.removeAccount(accountTel, 'authData/configs', 'config');
      window.electron.removeAccount(accountTel, 'authData/salt', 'authSalt' );
      location.reload();
      addMessageBanner(`ACCOUNT: ${accountTel} HAS BEEN REMOVED`, 'green');
    }catch(e){
      console.log(e);
      addMessageBanner(`THERE WAS AN ERROR DELETING YOUR ACCOUNT: ${e}`)
    }
  }

  //load accounts
  const loadAccounts = () => {
    let accounts = window.electron.getAllLoginAcc();
    let tgAccList = document.getElementById('tg-acc-list');

    if(accounts.length >= 1){
      while (tgAccList.firstChild) {
        tgAccList.removeChild(tgAccList.firstChild);
      }
    }

    accounts.forEach(account => {
      addItem(account, account, 'tg-acc-list', selectAcc, account, "tg-acc-list-item");
      addItem(account, 'REMOVE', 'tg-acc-list', removeAccount, account, 'remove-acc-button');
    })
  }

  document.addEventListener("DOMContentLoaded", function() {
    loadAccounts();
  });