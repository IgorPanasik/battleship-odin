import { DOM } from '../domElements.js';

export function getDataUser() {
    const nameOne = DOM.$nameOne.value.trim() || 'Player One';
    const nameTwoInput = DOM.$nameTwo.value.trim();
    const isBot = DOM.$botSwitch.checked;

    const nameTwo = isBot
        ? nameTwoInput + ' BOT' || 'Computer'
        : nameTwoInput || 'Player Two';
    return {
        nameOne,
        nameTwo,
        isBot,
    };
}
