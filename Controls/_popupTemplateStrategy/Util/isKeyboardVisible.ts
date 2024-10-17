import { constants } from 'Env/Env';

function isKeyboardVisible() {
    if (constants.isBrowserPlatform && document.activeElement) {
        const isInput = document.activeElement.tagName === 'INPUT';
        const isTextArea = document.activeElement.tagName === 'TEXTAREA';
        const isContentEditable = document.activeElement.getAttribute('contenteditable') === 'true';

        if (isInput || isTextArea || isContentEditable) {
            return true;
        }
    }
    return false;
}

export { isKeyboardVisible };
