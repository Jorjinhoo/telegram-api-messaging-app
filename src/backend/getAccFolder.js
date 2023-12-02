const api = require('./api');
const getUserInput = require('./getUserInput');


const getAccFolder = async () => {
  const resolvedPeer = await api.call('messages.getDialogFilters', {});
  console.log(resolvedPeer);

  const userInput = await getUserInput('Введите название папки: ');
  const selectedFolder = resolvedPeer.find(filter => filter.title === userInput);

  if (selectedFolder) {
    console.log('Выбранная папка:', selectedFolder);
    return selectedFolder;
  } else {
    console.log('Папка не найдена');
    userInput = await getUserInput('Введите название папки: ');
    return null;
  }
};

getAccFolder();


module.exports = getAccFolder;




// (async () => {
//   const resolvedPeer = await api.call('messages.getDialogFilters', {});
//   console.log(resolvedPeer);
//   return resolvedPeer;
// })();