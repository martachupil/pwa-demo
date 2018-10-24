const getCard = (card) => `
<div class="col-md-4">
<div class="card" style="width: 18rem;">
  <img class="card-img-top" src="${card.poster}" alt="${card.label}">
  <div class="card-body">
    <h5 class="card-title">${card.label}</h5>
    <p class="card-text">${card.description}</p>
  </div>
</div>
</div>
`;

let todoList = []

const main = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/pwa-demo/service-worker.js', {scope: '/pwa-demo/'})
            .then(reg => console.log('service worker registered: ', reg))
            .catch(err => console.error('failed to register SW: ', err));
    }
    fetch('items.json')
        .then(res => res.json())
        .then(data => {
            todoList = todoList.concat(data);
            renderItemsList(todoList);
        });
};

const renderItemsList = (items) => {
    const html = items.map(item => getCard(item)).join('\n');
    document.querySelector('#items-list').innerHTML = html;
};

document.addEventListener('DOMContentLoaded', () => main());
