const NEW_INPUT_JS_SELECTOR = 'js-controls-Field';

export function getInput(target: HTMLElement): HTMLElement | null {
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return target;
    }

    if (target.closest) {
        const platformCompositeInput =
            target.closest('.controls-ComboBox') || target.closest('.controls-Lookup');

        if (platformCompositeInput) {
            return platformCompositeInput as HTMLElement;
        }

        if (
            typeof target.className === 'string' &&
            target.className.indexOf(NEW_INPUT_JS_SELECTOR) !== -1
        ) {
            return target;
        }

        return target.closest(`.${NEW_INPUT_JS_SELECTOR}`) || null;
    }
    return null;
}
