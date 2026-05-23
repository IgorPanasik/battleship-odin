import { DOM } from '../dom.js';

export function getDataUser() {
    let nameOne = DOM.$nameOne.value || 'Player One';
    let nameTwo = DOM.$nameTwo.value || 'Player Two';
    const isBot = DOM.$botSwitch.checked;

    return {
        nameOne,
        nameTwo,
        isBot,
    };
}
