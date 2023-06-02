/**
 * @kaizen_zone 8bfb04d1-3e35-47c6-bb1e-3659dd068450
 */
import { constants } from 'Env/Env';
import {render, unmountComponentAtNode} from 'react-dom';
import { cloneElement } from 'react';

const position: string = `display: inline;
   top: 0;
   left: -9999px;
   position: absolute;
   white-space: nowrap;
   //Вроде самый безопасный способ вынести элемент на отдельный слой
   backface-visibility: hidden;`;

/**
 * Модуль, в котором реализована функция <b>getWidth(element)</b>.
 * Высчитывает ширину переданного элемента в пикселях.
 *
 * @remark
 * <h2>Параметры функции</h2>
 * * {HTMLElement} element Переданный HTML-элемент
 *
 * <h2>Возвращает</h2>
 * * {Number} Ширина переданного текста в пикселях.
 *
 * @example
 * <pre class="brush: js">
 *     import {getWidth} from 'Controls/sizeUtils';
 *      getTextWidth(fakeElement);
 * </pre>
 *
 * @class Controls/_utils/sizeUtils/getWidth
 * @public
 */

export function getWidth(element: HTMLElement | string): number {
    const measurer = document.createElement('div');
    measurer.setAttribute('style', position);

    if (typeof element === 'string') {
        measurer.innerHTML = element;
    } else if (element instanceof Array) {
        if (element[0].key) {
            render(element, measurer);
        } else {
            const copyElement = [cloneElement(element[0], {key: Math.random()})];
            render(copyElement, measurer);
        }
    } else {
        measurer.appendChild(element);
    }
    document.body.appendChild(measurer);

    // clientWidth width returns integer, but real width is fractional
    const width = measurer.getBoundingClientRect().width;

    // Откладываем удаление элемента, чтобы не пересчитвывать лишний раз DOM и быстрее отобразить страницу
    setTimeout(() => {
        if (constants.isBrowserPlatform) {
            unmountComponentAtNode(measurer);
            document.body.removeChild(measurer);
        }
    });
    return width;
}
