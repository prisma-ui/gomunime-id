import { generateData, generateAbout, generateGenres, generateInfo, generateStream, generateGenresM, generateSearch, generateComplete } from './module.js';
import { getData } from './controls.js';

const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const loader = document.querySelector(".load");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.getElementById("search-btn");

/* hashchange */
window.addEventListener("hashchange", () => {
    const url = new URL(window.location.href);
    loadHash(url);
});

const loadHash = (url) => {
    const dataType = getDataFromHash(url.hash);
    if (["info", "stream"].includes(dataType)) {
        loadContent(dataType, getData(`${dataType === "stream" ? "view" : dataType}/?data=${getParamFromHash(url.hash)}`));
    } else if (dataType === "genres_m") {
        const param = getParamFromHash(url.hash);
        loadContent(dataType, getData(`genres/${param}`), param);
    } else if(!dataType || ["home", "ongoing"].includes(dataType) || !window.location.hash) {
        const hash = !dataType ? "home" : dataType;
        loadContent(hash, getData(hash));
    } else if (dataType === "complete") {
        loadContent(dataType, getData("complete"));
    }
}

/* load content */
function loadContent(dataType, data, x=null) {
    removeChildAll();
    if (["home", "ongoing"].includes(dataType)) {
        generateData(data, dataType);
    } else if(dataType === "complete") {
        generateComplete(data);
    } else if (dataType === "about") {
        generateAbout();
    } else if (dataType === "genres") {
        generateGenres(data, dataType);
    } else if (dataType === "genres_m") {
        generateGenresM(data, x);
    } else if (dataType === "info") {
        generateInfo(data);
    } else if (dataType === "stream") {
        generateStream(data);
    } else if (dataType === "search") {
        generateSearch(data, x);
    }
    setActiveNavLink(dataType);
}

/* remove child elements */
function removeChildAll() {
    const absoluteItem = document.querySelectorAll(".data-anime, .genres, .genres_m, .search");
    absoluteItem.forEach(abs => {
        abs.style.position = "absolute";
    });
    const elements = document.querySelectorAll(".content .slider .title, .content .data-anime .anime, .content .about .text-about, .content .genres div, .content .info div, .content .stream div, .content .genres_m div, .content .genres_m h2, .content .search div, .content .search h2, .content .btn-next, .content .btn-next-genre");
    elements.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

/* set active nav link */
function setActiveNavLink(dataType) {
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${dataType}`) {
            link.classList.add("active");
        }
    });
}

/* get data type from hash */
function getDataFromHash(hash) {
    const regex = hash.match(/(\w+)/i);
    return dataMap[regex !== null ? "#" + regex[0] : ""];
}

/* get param from hash */
function getParamFromHash(hash) {
    const param = hash.match(/\w+\?data=(.*)/i);
    return param ? param[1] : null;
}

/* show load animation */
function showLoad() {
    document.body.classList.add("loader-open");
    loader.style.visibility = "visible";
    document.querySelector("footer").style.marginTop = "100vh";
}

/* hide load animation */
function hideLoad() {
    document.body.classList.remove("loader-open");
    loader.style.visibility = "hidden";
    document.querySelector("footer").style.marginTop = "100px";
}

/* search button click */
searchBtn.addEventListener("click", () => {
    const value = searchInput.value.trim();
    if (value) {
        loadContent("search", getData(`search/?keyword=${value}`), value);
        window.location.hash = `#search?data=${value}`;
    }
});

/* search input enter key */
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const value = searchInput.value.trim();
        if (value) {
            loadContent("search", getData(`search/?keyword=${value}`), value);
            window.location.hash = `#search?data=${value}`;
        }
    }
});

/* data map */
const dataMap = {
    "#home": "home",
    "#ongoing": "ongoing",
    "#complete": "complete",
    "#genres": "genres",
    "#genres_m": "genres_m",
    "#about": "about",
    "#info": "info",
    "#stream": "stream",
    "#search": "search"
};

/* initial content load */
document.addEventListener("DOMContentLoaded", () => {
    if(!window.location.hash) {
        loadContent("home", getData("home"));
    } else {
        const url = new URL(window.location.href);
        loadHash(url);
    }
});

export { showLoad, hideLoad };
