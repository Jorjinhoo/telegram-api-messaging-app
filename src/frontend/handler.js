let selectedFolders = [];
let allAccFolders = [];

//load folders
const loadAccFolders = async () => {
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


  //send messages
  const startSendMessages = async () => {
    let messageText = document.getElementById('message-text-input').value;

    if (allAccFolders.length > 0 && selectedFolders.length > 0 && messageText) {
      await window.electron.sendMessages(allAccFolders, selectedFolders, messageText);
    } else if(allAccFolders.length < 1){
      console.error('На аккаунте не обнаружено папок!!!');
      addMessageBanner('На аккаунте не обнаружено папок!!!', 'red');
    } else if(selectedFolders.length < 1){
      console.error('Нужно выбрать хотя бы 1 папку!!!');
      addMessageBanner('Нужно выбрать хотя бы 1 папку!!!', 'red');
    } else if(!messageText){
      console.error('Нужно ввести текст сообщения!!!');
      addMessageBanner('Нужно ввести текст сообщения!!!', 'red');
    }
  }

  //login
  const doLogin = async () => {
    let apiId = document.getElementById('input-api-id').value.toString();
    let apiHash = document.getElementById('input-api-hash').value;
    let apiTel = document.getElementById('input-api-tel').value.toString();
    let code = document.getElementById('input-api-code').value.toString();

    try{
      if(apiId && apiHash && apiTel){
        const isAuth = await window.electron.userAuth(apiId, apiHash, apiTel, code ? code : '');

        if(code)location.reload();

        if(isAuth)addMessageBanner(`Account: ${apiTel} has been added`, 'green');
  
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
    }catch(e){
      if(e.error_message == 'PHONE_CODE_INVALID'){
        addMessageBanner('Enter the code and submit the form again');
      }else{
        addMessageBanner(`An error occurred during authorization: ${e}`);
      }
    }
  }

  //select account
  const selectAcc = async (accTel) => {
    await window.electron.setApiConfig(accTel);
    await updateDropDownBttn(accTel);
    await loadAccFolders();
    toggleList('tg-acc-list', 'open');
  }

  //remove account
  const removeAccount = async (accountTel) => {
    window.electron.removeAccount(accountTel, 'authData/configs', 'config');
    window.electron.removeAccount(accountTel, 'authData/salt', 'authSalt' );
    location.reload();
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