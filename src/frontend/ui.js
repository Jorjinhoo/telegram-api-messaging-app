
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