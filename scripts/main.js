// GALLERY VIEW ARROWS
const kioskImgs = document.getElementById('kiosk-images');
const galleryView = document.querySelector('.gallery-view');
const projectImg = galleryView.querySelector('img');
const sources = galleryView.querySelectorAll(' source');
const leftArrow = document.getElementById('nav-left');
const rightArrow = document.getElementById('nav-right');
const getThumbnails = kioskImgs ? Array.from(kioskImgs.querySelectorAll('a')) : [];
const fullGallery = [];

getThumbnails.forEach((link, index) => {
    const img = link.querySelector('img');
    fullGallery.push({
        src: img.src,
        alt: img.alt,
        index: index
    });
});

let curr = 0;

function navigate(arrowDirection) {
    if (arrowDirection === 'left') {
        curr = (curr - 1 + fullGallery.length) % fullGallery.length;
    } else if (arrowDirection === 'right') {
        curr = (curr + 1) % fullGallery.length;
    }

    const newImg = fullGallery[curr];

    projectImg.src = newImg.src;
    projectImg.alt = newImg.alt;

    sources.forEach(source => {
        source.srcset = newImg.src;
    });
}

leftArrow.addEventListener('click', () => navigate('left'));
rightArrow.addEventListener('click', () => navigate('right'));

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
        const view = this.getAttribute('view');

        this.innerHTML = '';
        this.innerHTML += `
            <div class="project-card">
                <h3>${title}</h3>
                <picture>
                    <source srcset="${image}" alt="${title} screenshot">
                    <img src="${image}" alt="${title} screenshot">
                </picture>
                <p>${desc}</p>
                <a href="${url}" target="_blank" rel="noopener">${view}</a>
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
document.addEventListener('DOMContentLoaded', () => {
    checkLocalStorage();
    const localBtn = document.getElementById('local-btn');
    if (localBtn) {
        localBtn.addEventListener('click', loadLocal);
    }

    const remoteBtn = document.getElementById('remote-btn');
    if (remoteBtn) {
        remoteBtn.addEventListener('click', loadRemote);
    }
});

const projectsGrid = document.getElementById('projects-grid');
const STORED_DATA = 'localProjects';
const projectsArray = {
    "projects": [
        {
            "title": "Buzzfeed-Esque Website",
            "image": "images/buzzfeed.jpeg",
            "desc": "Created a Super Mario themed Buzzfeed-esque website with mini games for users to play with!",
            "url": "https://alexisvvega.github.io/Team11/",
            "view": "VIEW CASE STUDY"
        }, 
        {
            "title": "Restaurant Inventory App",
            "image": "images/inventory-app.png",
            "desc": "Designed a restaurant inventory app according to the client's needs in order to streamline stock management.",
            "url": "https://www.figma.com/design/6u79RDZZ91HpRfZrB9mDjr/Inventory-App?t=P1vIidXYgWqmguIo-1",
            "view": "VIEW CASE STUDY"
        },
        {
            "title": "Marathon Pace Tracker",
            "image": "images/pace.png",
            "desc": "Designed a motivational marathon pace tracker for runners to ensure they meet their personal goals.",
            "url": "#",
            "view": "COMING SOON!"
        }
    ]
};

const projectsJSON = JSON.stringify(projectsArray);

async function checkLocalStorage() {
    if (localStorage.getItem(STORED_DATA) == null) {
        localStorage.setItem(STORED_DATA, projectsJSON);
        console.log('Local JSON data stored.');
    }
}

async function loadLocal() {
    projectsGrid.innerHTML = '';
    const loadData = localStorage.getItem(STORED_DATA);

    if (loadData) {
        const dataParsed = JSON.parse(loadData);
        const projectsData = dataParsed.projects;

        projectsData.forEach(project => {
            const card = document.createElement('project-card');

            card.setAttribute('title', project.title);
            card.setAttribute('image', project.image);
            card.setAttribute('desc', project.desc);
            card.setAttribute('url', project.url);
            card.setAttribute('view', project.view);

            const listItem = document.createElement('li');
            listItem.appendChild(card);

            projectsGrid.appendChild(listItem);
        });
    }
}

async function loadRemote() {
    const url = ('https://my-json-server.typicode.com/angeleend/cse134b-hw5/projects')

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
            card.setAttribute('view', project.view);

            const listItem = document.createElement('li');
            listItem.appendChild(card);

            projectsGrid.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

let name = document.getElementById('name');
let email = document.getElementById('email');
let message = document.getElementById('message');
let form = document.getElementById('contact-form');
let error = document.getElementById('error');
let info = document.getElementById('info');
let formErrorsInput = document.getElementById('form-errors');

let form_errors = [];
let validTimeout;

// NAME VALIDATION
name.addEventListener('input', function() {
    clearTimeout(validTimeout);
    error.textContent = '';
    info.textContent = '';

    if (name.validity.patternMismatch) {
        addError('name', 'patternMismatch');

        let errorMessage = 'No special characters please! Only enter letters, spaces, periods, apostrophes, and hyphens for your name.';
        name.setCustomValidity(errorMessage);
        error.textContent = name.validationMessage;

        validTimeout = setTimeout(() => {
            error.textContent = '';
        }, 4000);

    } else if (name.checkValidity() == false) {
        addError('name', 'lengthError');

        let errorMessage = 'Your name must be between 3 and 100 characters long.';
        name.setCustomValidity(errorMessage);
        error.textContent = name.validationMessage;

        validTimeout = setTimeout(() => {
            error.textContent = '';
        }, 4000);

    } else {
        info.textContent = 'Your name looks great!';

        validTimeout = setTimeout(() => {
            info.textContent = '';
        }, 4000);
    }

    name.setCustomValidity('');
});

// EMAIL VALIDATION
email.addEventListener('input', function() {
    clearTimeout(validTimeout);
    error.textContent = '';
    info.textContent = '';

    if (email.checkValidity() == false) {
        addError('email', 'lengthError');

        let errorMessage = 'Your email address seems to be too short to be a valid email, please ensure it is correct.';
        email.setCustomValidity(errorMessage);
        error.textContent = email.validationMessage;

        validTimeout = setTimeout(() => {
            error.textContent = '';
        }, 4000);

    } else {
        info.textContent = 'Your email looks great!';

        validTimeout = setTimeout(() => {
            info.textContent = '';
        }, 4000);
    }

    email.setCustomValidity('');
});

// MESSAGE VALIDATION
message.addEventListener('input', charsLeft);

function charsLeft() {
    clearTimeout(validTimeout);
    error.textContent = '';
    info.textContent = '';

    let charsRemaining = message.maxLength - message.value.length;

    if (charsRemaining == 0)  {
        message.style.backgroundColor = 'var(--error-message)';
        message.style.color = 'var(--primary)';
        message.style.fontWeight = '500';
        addError('message', 'lengthError');

        let errorMessage = 'You have reached the maximum character limit for the message field.';
        message.setCustomValidity(errorMessage);
        error.textContent = message.validationMessage;
        
        validTimeout = setTimeout(() => {
            error.textContent = '';
        }, 4000);

    } else if (charsRemaining < 10) {
        message.style.backgroundColor = 'var(--error-message)';
        message.style.color = 'var(--primary)';
        message.style.fontWeight = '500';

        addError('message', 'lengthError');

        let errorMessage = `Your message is getting close to the maximum character limit. You have ${charsRemaining} characters remaining.`;
        message.setCustomValidity(errorMessage);
        error.textContent = message.validationMessage;

        validTimeout = setTimeout(() => {
            error.textContent = '';
        }, 4000);

    } else {
        message.style.fontWeight = '400';
        info.textContent = `${charsRemaining} characters remaining`;

        validTimeout = setTimeout(() => {
            info.textContent = '';
        }, 4000);
    }

    message.setCustomValidity('');
}

// USER ERRORS
form.addEventListener('submit', function(event) {
    if (form_errors.length > 0) {
        formErrorsInput.value = JSON.stringify(form_errors);
    }
});

function addError(fieldName, errorType) {
    const fieldError = {
        field: fieldName,
        error: errorType
    };

    form_errors.push(fieldError);
}

// VIEW TRANSITION API
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
