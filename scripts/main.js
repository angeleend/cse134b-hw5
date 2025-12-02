// PROJECT-CARD CUSTOM ELEMENT
class ProjectCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const title = this.getAttribute('title');
        const image = this.getAttribute('image');
        const desc = this.getAttribute('desc');
        const url = this.getAttribute('url');
        const published = this.getAttribute('published');

        this.innerHTML = '';
        this.innerHTML += `
            <div class="project-card">
                <h3>${title}</h3>
                <picture>
                    <source srcset="${image}" alt="${title} screenshot">
                    <img src="${image}" alt="${title} screenshot">
                </picture>
                <p>${desc}</p>
                <button>
                    <a href="${url}" target="_blank" rel="noopener">${published}</a>
                </button>
            </div>
        `;

        this.querySelector('.project-card').addEventListener('click', () => this.bubbleUp()); 
    }

    bubbleUp() {
        console.log('bubbles');
    }
}

console.log('Custom elements defined: ProjectCard');
customElements.define('project-card', ProjectCard);

//JSON LOADING
const remoteBtn = document.getElementById('remote-btn');
if (remoteBtn) {
    remoteBtn.addEventListener('click', loadRemoteJSON);
}

async function loadRemoteJSON() {
    const url = ('https://my-json-server.typicode.com/angeleend/cse134b-hw5/projects')
    const projectsGrid = document.getElementById('projects-grid');

    projectsGrid.innerHTML = '';
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projectsData = await response.json();
        console.log('Fetched remote JSON data:', projectsData);

        projectsData.forEach(project => {
            const card = document.createElement('project-card');

            card.setAttribute('title', project.title);
            card.setAttribute('image', project.image);
            card.setAttribute('desc', project.desc);
            card.setAttribute('url', project.url);
            card.setAttribute('published', project.published);

            const listItem = document.createElement('li');
            listItem.appendChild(card);

            projectsGrid.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

// THEME TOGGLE
let dialog = document.getElementById('mode-dialog');
let toggle = document.getElementById('mode-toggle');
let light = document.getElementById('light-mode');
let dark = document.getElementById('dark-mode');
let cancel = document.getElementById('cancel-dialog');
let body = document.body;

toggle.style.display = 'block';
document.addEventListener('DOMContentLoaded', defaultMode);

function applyMode(mode) {
    if (mode == 'dark')  {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
}

function defaultMode() {
    let localMode = localStorage.getItem('theme');
    applyMode(localMode);
}

toggle.addEventListener('click', () => dialog.showModal());

light.addEventListener('click', () => {
    applyMode('light');
    dialog.close();
});

dark.addEventListener('click', () => {
    applyMode('dark');
    dialog.close();
});  

cancel.addEventListener('click', () => dialog.close());

// VIEW TRANSITION API
const kioskImgs = document.getElementById('kiosk-images');
const galleryView = document.querySelector('.gallery-view');
const projectImg = galleryView.querySelector('img');
const sources = galleryView.querySelectorAll(' source');

kioskImgs.addEventListener('click', updateView);

function updateView(event) {
    event.preventDefault();

    const clickedImg = event.target.closest('img');

    const newAlt = clickedImg.alt;
    const imgName = clickedImg.src.match(/([^/]+)\.png$/)[1];
    const newSrc = `images/${imgName.replace(/-s$/, '')}`;

    const displayNewImg = () => {
        projectImg.src = `${newSrc}-m.png`;
        projectImg.alt = newAlt;

        sources[0].srcset = `${newSrc}.png`; 
        sources[1].srcset = `${newSrc}.png`; 
        sources[2].srcset = `${newSrc}.png`;

    if (!document.startViewTransition) {
        displayNewImg();
        return;
    }
}
    document.startViewTransition(() => displayNewImg());
}