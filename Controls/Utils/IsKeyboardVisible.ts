import { constants, detection } from 'Env/Env';

let initialHeight = 0;
let oldVisualViewPortSize = {
    width: 0,
    height: 0,
};

function visualViewportResizeHandler() {
    if (
        window.visualViewport?.height !== oldVisualViewPortSize.height &&
        window.visualViewport?.width !== oldVisualViewPortSize.width
    ) {
        oldVisualViewPortSize.height = window.visualViewport?.height || 0;
        oldVisualViewPortSize.width = window.visualViewport?.width || 0;
        initialHeight = window.visualViewport.height;
    }
}

// Подписывается на изменения visualViewport
export function initKeyboardVisible(): void {
    if (constants.isBrowserPlatform && detection.isMobilePlatform && window?.visualViewport) {
        oldVisualViewPortSize = {
            width: window.visualViewport?.width,
            height: window.visualViewport?.height,
        };
        initialHeight = window.visualViewport.height;
        window.visualViewport.addEventListener('resize', visualViewportResizeHandler);
    }
}

// отписывается от изменений visualViewport
export function clearKeyboardVisible(): void {
    if (window?.visualViewport) {
        window.visualViewport.removeEventListener('resize', visualViewportResizeHandler);
    }
}

/**
 * Метод определяет открыта клавиатура или нет.
 * Определение осуществляется за счет события изменения visualViewport, а также текущего активного элемента.
 */
export function isKeyboardVisible(): boolean {
    if (detection.isMobilePlatform && constants.isBrowserPlatform && document.activeElement) {
        const isInput = document.activeElement.tagName === 'INPUT';
        const isTextArea = document.activeElement.tagName === 'TEXTAREA';
        const isContentEditable = document.activeElement.getAttribute('contenteditable') === 'true';

        if (isInput || isTextArea || isContentEditable) {
            return true;
        }
        if (window?.visualViewport) {
            return window.visualViewport.height < initialHeight;
        }
    }
    return false;
}

if (constants.isBrowserPlatform) {
    initKeyboardVisible();
    window.addEventListener('beforeunload', () => {
        clearKeyboardVisible();
    });
}
