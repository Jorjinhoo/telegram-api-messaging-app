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

loadAccFolders(false);


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
    await window.electron.sendMessages(allAccFolders, selectedFolders, messageText);
  }