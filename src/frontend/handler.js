let selectedFolders = [];
let allAccFolders = [];

const loadAccFolders = async (isRefBttn) => {

    let folderList = document.getElementById('folders-list');
    if(isRefBttn && folderList){
        while (folderList.firstChild) {
            folderList.removeChild(folderList.firstChild);
        }
    }

    let accFolders = await window.electron.getAccFolders();
    allAccFolders = accFolders;
    accFolders.forEach(element => {
        addListItem(element.title, element.title, 'folders-list', 'folder');
    });
}

// loadAccFolders(false);

const addUserName = async () => {
  const userName = await window.electron.addUserName();
  userName ? addItem('tg-acc-name', userName, 'nav') : addMessageBanner('Ошибка при загрузке ника аккаунта!!!', 'red');;
}

// addUserName();


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

  const doLogin = async () => {
    let apiId = document.getElementById('input-api-id').value.toString();
    let apiHash = document.getElementById('input-api-hash').value;
    let apiTel = document.getElementById('input-api-tel').value.toString();
    let code = document.getElementById('input-api-code').value.toString();
    if(apiId && apiHash && apiTel){
      await window.electron.userAuth(apiId, apiHash, apiTel, code ? code : '');
    }
    //obawit banner kak w start messages
  }