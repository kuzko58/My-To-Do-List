// jshint esversion:6

const completeButtons = document.querySelectorAll('.complete-button');
const deleteButtons = document.querySelectorAll('.delete-button');
const mainHeader = document.querySelector('.main-header');
const mainList = document.querySelector('.main-list');
const addItemBox = document.querySelector('.add-item-box');

/** ************************** List Update Form *********************** * */

completeButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const itemId = button.name;
    const itemStatus = !button.classList.contains('ticked');
    document.getElementById(button.name).action = `/update/item/${itemId}/${itemStatus}`;
    document.getElementById(button.name).submit();
  });
});

deleteButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const itemId = button.name;
    document.getElementById(button.name).action = `/delete/item/${itemId}`;
    document.getElementById(button.name).submit();
  });
});

/** ************************** CSS Utility *********************** * */

mainList.addEventListener('scroll', () => {
  if (mainList.scrollTop) {
    mainHeader.classList.add('bottom-shadow');
    addItemBox.classList.add('top-shadow');
  } else {
    mainHeader.classList.remove('bottom-shadow');
    addItemBox.classList.remove('top-shadow');
  }
});

window.addEventListener('load', () => {
  const listItem = document.querySelectorAll('.list-item');
  listItem[listItem.length - 1].style.borderBottom = 'none';
});
