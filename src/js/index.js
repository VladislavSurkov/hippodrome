import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  addPlayerForm: document.querySelector('.addPlayer-form'),
  delete: document.querySelector('.delete'),
  startBtn: document.querySelector('.start-btn'),
  listPlayers: document.querySelector('.players'),
  tableBody: document.querySelector('.results-table > tbody'),
  tableWin: document.querySelector('.results-all'),
};

refs.addPlayerForm.addEventListener('submit', onAddPlayer);
refs.delete.addEventListener('click', onDelete);
refs.startBtn.addEventListener('click', startRun);

let players = [];
let raceCounter = 0;
let positionCounter = 0;

function onAddPlayer(e) {
  e.preventDefault();

  const string = e.currentTarget.elements.player.value;

  if (!string) {
    return Notify.failure('Эй, ты чего? Введи хоть что-то!');
  }

  const element = string.split(',');
  players.push(...element);

  refs.delete.disabled = false;
  refs.startBtn.disabled = false;
  createListPlayers();
  document.getElementById('input').value = '';
}

function createListPlayers() {
  refs.listPlayers.innerHTML = '';
  const markup = players
    .map((element, i) => `<li class="player-p">${i + 1} ) ${element}</li> `)
    .join('');

  refs.listPlayers.insertAdjacentHTML('beforeend', markup);
}
function onDelete() {
  refs.delete.disabled = true;
  refs.startBtn.disabled = true;

  refs.listPlayers.innerHTML = '';
  players = [];
}

function startRun() {
  if (players.length <= 1) {
    return Notify.warning('Должно быть как минимум 2 участника!');
  }

  refs.addPlayerForm.target.disabled = true;
  refs.tableWin.innerHTML = '';

  raceCounter += 1;

  const promises = players.map(run);
  Notify.info('Гонка началась!');

  Promise.race(promises).then(({ players, time }) => {
    Notify.success(`Победил ${players}, финишировав за ${time} м.сек`);

    createTableWinner({ players, time, raceCounter });
  });

  Promise.all(promises).then(e => {
    Notify.info('Гонка завершина!');

    positionCounter = 0;
    const ascending = e.sort((a, b) => a.time - b.time);
    ascending.map(createTableAll);
  });
}

function run(players) {
  return new Promise(resolve => {
    const time = getRandomTime(2000, 3000);

    setTimeout(() => {
      resolve({ players, time });
    }, time);
  });
}

function createTableWinner({ players, time, raceCounter }) {
  const tbWin = `<tr><td>${raceCounter}</td><td>${players}</td><td>${time}</td></tr>`;

  refs.tableBody.insertAdjacentHTML('beforeend', tbWin);
}

function createTableAll({ players, time}) {
  positionCounter += 1;
  const tbAll = `<thead><tr><th>Позиция</th><th>Игрок</th><th>Время</th></tr></thead>
<tbody><tr><td>${positionCounter}</td><td>${players}</td><td>${time}</td></tr></tbody>`;

  refs.tableWin.insertAdjacentHTML('beforeend', tbAll);
}

function getRandomTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
