
const refs = {
  addPlayerForm: document.querySelector('.addPlayer-form'),
  delete: document.querySelector('.delete'),
  listPlayers: document.querySelector('.players'),
};

refs.addPlayerForm.addEventListener('submit', onAddPlayer);
refs.delete.addEventListener('click', onDelete);

export let players = [];

 function onAddPlayer(e) {
  e.preventDefault();

  const string = e.currentTarget.elements.player.value;

  if (!string) {
    return Notify.failure('Эй, ты чего? Введи хоть что то!');
  }
  players = string.split(',');

  createListPlayers();
  document.getElementById('input').value = '';
}

 function createListPlayers() {
  const markup = players
    .map(element => `<li class="player-p">${element}</li> `)
    .join('');

  refs.listPlayers.insertAdjacentHTML('beforeend', markup);
}

function onDelete() {
  refs.listPlayers.innerHTML = '';
}