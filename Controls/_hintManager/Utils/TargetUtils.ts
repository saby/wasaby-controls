/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import {
    TYPE_PREFIX,
    TEXT_PREFIX,
    POPUP_TYPE_PREFIX,
    MIN_TARGET_SIZE
} from 'Controls/_hintManager/Utils/Constants';
import { CONTROLS_CONFIG } from 'Controls/_hintManager/Utils/ControlsConfig';
import rk = require('i18n!Controls');

const idReg = /-type-\w+/g;

/**
 * Функция получает целевой элемент маршрута подсказок по его идентификатору.
 * @param {String} targetId Идентификатор целевого элемента маршрута подсказок.
 * @param {HTMLElement | Document} currentHintArea Область, врутри которой расположены целевые (размеченные) элементы
 *                                                 маршрута.
 * @return {?HTMLElement}
 */
function getTargetById(targetId: string, currentHintArea: HTMLElement | Document): HTMLElement | null {
    const area = targetId.includes(`${TYPE_PREFIX}${POPUP_TYPE_PREFIX}`) ? document : currentHintArea;
    const selector = _getSelectorFromTargetId(targetId);

    let target;
    if (selector.includes(TEXT_PREFIX)) {
        const elements = getElementsArrayByText(selector, area);
        target = elements[0];
    } else {
        target = area.querySelector(selector);
    }

    return isProperTargetSize(target) ? target : null;
}

/**
 * Функция получает массив элементов с одинаковой привязкой к тексту в контенте этих элементов.
 * @param {String} targetSelector Селектор, по которому ведется поиск элементов.
 * @param {HTMLElement | Document} area Область, врутри которой расположены целевые (размеченные) элементы маршрута.
 * @return {Array.<HTMLElement>}
 */
function getElementsArrayByText(targetSelector: string, area: HTMLElement | Document): HTMLElement[] {
    const [ selector, text ] = targetSelector.split(TEXT_PREFIX);
    const elementsCollection = area.querySelectorAll(selector);

    const elementsArr = Array.from(elementsCollection).filter((element: HTMLElement) => {
        return getElementInnerText(element) === text;
    });

    return elementsArr as HTMLElement[];
}

/**
 * Функция получает текст в контенте DOM-элемента, к которому может быть осуществлена привязка.
 * @param {HTMLElement} element DOM-элемент, к которому может быть осуществлена привязка.
 * @return {String}
 */
function getElementInnerText(element: HTMLElement): string {
    const elementInnerTextArr = element.innerText?.split('\n');
    const elementInnerText = elementInnerTextArr?.[0];
    return elementInnerText ? rk(elementInnerText) : '';
}

/**
 * Функция проверяет, превышают ли высота и ширина таргета минимальный размер, при котором таргет обрабатывается в
 * качестве целевого элемента подсказки.
 * @param {?HTMLElement} target DOM-элемент, к которому может быть осуществлена привязка.
 * @return {Boolean}
 */
function isProperTargetSize(target: HTMLElement | null): boolean {
    if (target) {
        return target.offsetWidth > MIN_TARGET_SIZE && target.offsetHeight > MIN_TARGET_SIZE;
    }
    return false;
}

/**
 * Функция получает селектор целевого элемента маршрута подсказок из его идентификатора.
 * @param {String} targetId Идентификатор целевого элемента маршрута подсказок.
 * @return {String}
 * @private
 */
function _getSelectorFromTargetId(targetId: string): string {
    return targetId.replace(idReg, (type: string): string => {
        const controlType = type.split(TYPE_PREFIX)[1];
        const controlConfig = CONTROLS_CONFIG.find((config) => {
            return config.type === controlType;
        });

        // в ws3 controlах можем не найти controlConfig
        return controlConfig ? `.${controlConfig.root}` : type;
    });
}

export {
    getTargetById,
    getElementsArrayByText,
    getElementInnerText,
    isProperTargetSize
};
