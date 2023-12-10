
const addItem = (id, textContent, fatherElementId, onClick = false, funcArg = false, className = false, tag = 'div') => {

  let div = window.document.createElement(tag);
  div.id = id;
  div.textContent = textContent;
  if(onClick && funcArg){ div.onclick = () => onClick(funcArg) }
  else if(onClick){ div.onclick = () => onClick() }
  
  if(className){ div.className = className }

  window.document.querySelector(`#${fatherElementId}`).appendChild(div);
}

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

// active class
function addActiveClass(elementId, toggleClass) {
  document.getElementById(elementId).classList.toggle(toggleClass);
}

function removeActiveClass(elementId, removeClass) {
  document.getElementById(elementId).classList.remove(removeClass);;
}

function toggleList(fElementId, sElementId, activeClass) {
  let tgAccList = document.getElementById(fElementId);

  let isAccSwitchListOpen = tgAccList.classList.contains(activeClass);

  isAccSwitchListOpen ? removeActiveClass(fElementId, activeClass) : addActiveClass(fElementId, activeClass);
  isAccSwitchListOpen ? removeActiveClass(sElementId, activeClass) : addActiveClass(sElementId, activeClass);
}