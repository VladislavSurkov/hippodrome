import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  addPlayerForm: document.querySelector('.addPlayer-form'),
  delete: document.querySelector('.delete'),
  startBtn: document.querySelector('.start-btn'),
  listPlayers: document.querySelector('.players'),
  tableBody: document.querySelector('.results-table > tbody'),
  tableWin: document.querySelector('.results-all > tbody'),
  rangeInput: document.querySelector('input[type="range"]'),
  output: document.querySelector('.js-selected-value'),
};

refs.addPlayerForm.addEventListener('submit', onAddPlayer);
refs.delete.addEventListener('click', onDelete);
refs.startBtn.addEventListener('click', startRun);
refs.rangeInput.addEventListener('input', LevelTime);

let players = [];

let raceCounter = 0;
let positionCounter = 0;

let minSec = 1000;
let maxSec = 2000;

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
    const time = getRandomTime(minSec, maxSec);

    setTimeout(() => {
      resolve({ players, time });
    }, time);
  });
}

function createTableWinner({ players, time, raceCounter }) {
  const tbWin = `<tr><td>${raceCounter}</td><td>${players}</td><td>${time}</td></tr>`;

  refs.tableBody.insertAdjacentHTML('beforeend', tbWin);
}

function createTableAll({ players, time }) {
  positionCounter += 1;
  const tbAll = `<tr><td>${positionCounter}</td><td>${players}</td><td>${time}</td></tr>`;

  refs.tableWin.insertAdjacentHTML('beforeend', tbAll);
}

function getRandomTime( minSec, maxSec ) {
  const min = Number.parseInt(minSec);
  const max = Number.parseInt(maxSec);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function LevelTime(e) {
  const lvlEl = e.target.value
  refs.output.textContent = lvlEl;
  const El = lvlEl * (Number(lvlEl) + 1);
  minSec = `${lvlEl}000`
  maxSec = `${El}000`
}
