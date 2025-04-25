import { disableAll, showLoad, allowAll, hideLoad } from './style.js';

const baseUrl = "https://python.seromula.com/api/otakudesu/"

async function getData(data) {
    showLoad();
    disableAll();
    try {
        const response = await fetch(baseUrl + data);
        const results = await response.json();
        allowAll();
        hideLoad();
        return results;
    } catch(err) {
        console.log(err);
    }
}

export { getData };
