
const addItem = (id, textContent, fatherElementId) => {
  let div = window.document.createElement('div');
  div.id = id;
  div.textContent = textContent;

  window.document.querySelector(`#${fatherElementId}`).appendChild(div);
}

// после авторизации вызываем функции загрузки папок и имени

const addListItem = (itemText, itemId, listId, iconType) => {
  let li = window.document.createElement('li');
  li.className = 'fl-item';
  li.id = itemId;
  li.textContent = itemText;
  li.onclick = () => selectItem('folder', itemId);

  let section = window.document.createElement('section');
  section.className = 'material-symbols-outlined';
  section.textContent = iconType;

  window.document.querySelector(`#${listId}`).appendChild(li);
  window.document.querySelector(`#${itemId}`).appendChild(section);
}

const addMessageBanner = (text, color) => {
  let div = window.document.createElement('div');
  div.className = 'message-banner';
  div.textContent = text;

  window.document.querySelector('.app').appendChild(div);

  setTimeout(function () {
    div.classList.add(color == 'green' ? 'message-active-green' : 'message-active-red');
  }, 0);

  setTimeout(function() {

    div.classList.add('message-hide');

    setTimeout(function() {
      let bannerToRemove = window.document.querySelector('.message-banner');
      if (bannerToRemove) {
        bannerToRemove.parentNode.removeChild(bannerToRemove);
      }
    }, 1000);
  }, 3000);
}

// modal window
function openModal() {
  document.getElementById('login-modal').classList.toggle('open');
}

function closeModal() {
  document.getElementById('login-modal').classList.remove('open');;
}