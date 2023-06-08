import { constants } from 'Env/Env';
import * as ReactDOM from 'react-dom';

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
        ReactDOM.render(element, measurer);
    } else {
        measurer.appendChild(element);
    }
    document.body.appendChild(measurer);

    // clientWidth width returns integer, but real width is fractional
    const width = measurer.getBoundingClientRect().width;

    // Откладываем удаление элемента, чтобы не пересчитвывать лишний раз DOM и быстрее отобразить страницу
    setTimeout(() => {
        if (constants.isBrowserPlatform) {
            document.body.removeChild(measurer);
        }
    });
    return width;
}
