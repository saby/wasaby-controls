/**
 * Утилита для поиска окна-родителя.
 * @param {HTMLElement} element
 * @param {String} parentClassName
 * @returns {String|Boolean}
 */
const findPopupParentId = (
    element: HTMLElement,
    parentClassName: string = '.controls-Popup'
): string | boolean => {
    // svg не считается за HTMLElement, поэтому добавлю дополнительную проверку на Element
    // оставляем поддержку старого значения opener (Интанс контрола)
    let controlContainer;
    if (element && element._container) {
        controlContainer = element._container[0] || element._container;
    } else {
        controlContainer = element;
    }
    if (!controlContainer || !controlContainer.closest) {
        return false;
    }
    const parentPopup = getParentContainer(controlContainer, parentClassName);
    return getPopupKey(parentPopup);
};

/**
 * Метод, который возвращает контейнер родительского окна, если такой есть
 * @param {HTMLElement} controlContainer
 * @param {String} parentClassName
 * @returns {HTMLElement}
 */
const getParentContainer = (
    controlContainer: HTMLElement,
    parentClassName: string
): HTMLElement => {
    const parentContainer = controlContainer.closest(parentClassName) as HTMLElement;
    if (!parentContainer) {
        // На случай, если в цепочке опенеров оказался ws3-попап, рекурсивно ищем wasaby-попап и назначаем его родителем
        const compatibleParentContainer = controlContainer.closest('.controls-FloatArea');
        if (compatibleParentContainer && compatibleParentContainer.wsControl) {
            const compatibleOpener = compatibleParentContainer.wsControl.getOpener();
            if (compatibleOpener) {
                const compatibleContainer = compatibleOpener.getContainer()[0];
                return getParentContainer(compatibleContainer, parentClassName);
            }
        }
    }
    return parentContainer;
};

/**
 * Метод, который возвращает ключ родительского окна, если такой есть.
 * @param {HTMLElement} popupContainer
 * @returns {Boolean|String}
 */
const getPopupKey = (popupContainer: HTMLElement): boolean | string => {
    if (!popupContainer) {
        return false;
    }
    return popupContainer.getAttribute('popupkey');
};

export { findPopupParentId };
