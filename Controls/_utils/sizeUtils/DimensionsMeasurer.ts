import { Logger } from 'UI/Utils';
import { constants, detection } from 'Env/Env';

export const DEFAULT_ZOOM_VALUE = 1;

const ELEMENT_DIMENSIONS = [
    'clientHeight',
    'clientLeft',
    'clientTop',
    'clientWidth',
    'scrollLeft',
    'scrollTop',
    'offsetHeight',
    'offsetLeft',
    'offsetTop',
    'offsetWidth',
    'scrollWidth',
    'scrollHeight',
];
const VISUAL_VIEWPORT_FIELDS = [
    'offsetLeft',
    'offsetTop',
    'pageLeft',
    'pageTop',
    'width',
    'height',
];
const WINDOW_DIMENSIONS_FIELDS = [
    'innerHeight',
    'innerWidth',
    'scrollX',
    'scrollY',
    'pageXOffset',
    'pageYOffset',
];
const SCALABLE_DIMENSIONS_VALUES = ['height', 'width', 'top', 'bottom', 'right', 'left', 'x', 'y'];

interface IWindowDimensions {
    innerHeight: number;
    innerWidth: number;
    scrollX: number;
    scrollY: number;
    pageXOffset: number;
    pageYOffset: number;
}

interface IVisualViewportDimensions {
    offsetLeft: number;
    offsetTop: number;
    pageLeft: number;
    pageTop: number;
    width: number;
    height: number;
}

interface IElementDimensions {
    clientHeight: number;
    clientLeft: number;
    clientTop: number;
    clientWidth: number;
    scrollLeft: number;
    scrollTop: number;
    offsetHeight: number;
    offsetLeft: number;
    offsetTop: number;
    offsetWidth: number;
    scrollWidth: number;
    scrollHeight: number;
}

interface IMouseCoords {
    x: number;
    y: number;
}

const ZOOM_CLASS = 'controls-Zoom';

/**
 * Модуль для измерения размеров элементов
 * @private
 */
class DimensionsMeasurer {
    private _zoomCache: Map<HTMLElement, number> = new Map<HTMLElement, number>(); // Иначе на любой чих меряется DOM.
    /**
     * Расчет getBoundingClientRect с учетом зума
     * Значения приводятся к координатной сетке body
     * Нужно для получаения координат элементов, которые нужны для позиционирования элементов в body(пример - popup)
     * @param {HTMLElement} element
     */
    getBoundingClientRect(element: HTMLElement): DOMRect {
        return this._getBoundingClientRect(element, true);
    }

    /**
     * Расчет getBoundingClientRect с учетом зума
     * Значения не скалируются к основной координатной сетке в body,
     * а возвращаются с учетом локального значения zoom на элементе
     * @param {HTMLElement} element
     */
    getRelativeBoundingClientRect(element: HTMLElement): DOMRect {
        return this._getBoundingClientRect(element, false);
    }

    /**
     * Расчет размеров и оффсетов элемента с учетом зума
     * Значения приводятся к координатной сетке body
     * Нужно для получаения размеров и смещений элемента,
     * которые нужны для позиционирования элементов в body(пример - popup)
     * @param {HTMLElement} element
     * @param {number} calculatedZoomValue предрасчитанное значение зума для расчетов
     */
    getElementDimensions(element: HTMLElement, calculatedZoomValue?: number): IElementDimensions {
        return this._getElementDimensions(element, true, calculatedZoomValue);
    }

    /**
     * Расчет размеров и оффсетов элемента с учетом зума
     * Значения не скалируются к основной координатной сетке в body,
     * а возвращаются с учетом локального значения zoom на элементе
     * @param {HTMLElement} element
     * @param {number} calculatedZoomValue предрасчитанное значение зума для расчетов
     */
    getRelativeElementDimensions(
        element: HTMLElement,
        calculatedZoomValue?: number
    ): IElementDimensions {
        return this._getElementDimensions(element, false, calculatedZoomValue);
    }

    /**
     * Размеры и оффсеты window с учетом zoom
     * @param {HTMLElement} element Элемент относительно значения zoom которого считаются значения размеров window
     */
    getWindowDimensions(element?: HTMLElement): IWindowDimensions {
        const zoom = this.getZoomValue(element as HTMLElement);
        if (zoom !== DEFAULT_ZOOM_VALUE) {
            return this._getScaledElementDimensions<IWindowDimensions>(
                window,
                WINDOW_DIMENSIONS_FIELDS,
                zoom
            );
        } else {
            return window;
        }
    }

    /**
     * Получение координат мышки/тача внутри body по нативному событию, с учетом zoom на body
     */
    getMouseCoordsByMouseEvent(event: MouseEvent | TouchEvent): IMouseCoords {
        return this._getMouseCoordsByMouseEvent(event, true);
    }

    /**
     * Получение координат мышки/тача по нативному событию
     * Координаты возвращаются с учетом zoom элемента
     */
    getRelativeMouseCoordsByMouseEvent(
        event: MouseEvent | TouchEvent,
        zoom?: number
    ): IMouseCoords {
        return this._getMouseCoordsByMouseEvent(event, false, zoom);
    }

    /**
     * Получение координат и размеров visualViewport с учетом zoom
     * @param {HTMLElement} element Элемент относительно значения zoom которого считаются значения размеров visualViewport
     */
    getVisualViewportDimensions(element?: HTMLElement): IVisualViewportDimensions {
        const zoomValue = this.getZoomValue(element);
        const visualViewport = this._getVisualViewport();
        if (zoomValue !== DEFAULT_ZOOM_VALUE) {
            return this._getScaledElementDimensions<IVisualViewportDimensions>(
                visualViewport,
                VISUAL_VIEWPORT_FIELDS,
                zoomValue
            );
        } else {
            return visualViewport;
        }
    }

    /**
     * Получение значения зума для html элемента с учетом того, что zoom может лежать не на одном родительском элементе
     * @param element
     */
    getZoomValue(element?: HTMLElement): number {
        let node = element;
        if (!constants.isBrowserPlatform) {
            return 1;
        }
        if (!(element instanceof HTMLElement)) {
            node = document.body;
        }

        let zoomValue = DEFAULT_ZOOM_VALUE;
        let zoomElement = node.closest(`.${ZOOM_CLASS}`) as HTMLElement;
        if (this._zoomCache.has(zoomElement)) {
            return this._zoomCache.get(zoomElement);
        }
        const baseZoomElement = zoomElement;
        while (zoomElement) {
            const parentZoomValue = window?.getComputedStyle(zoomElement)?.zoom;
            if (parentZoomValue) {
                zoomValue *= parseFloat(parentZoomValue);
            }
            zoomElement = zoomElement?.parentElement?.closest(`.${ZOOM_CLASS}`);
        }

        // Не будем кэшировать элементы без baseZoomElement и элементы попапа, т.к. они часто меняются, из-за чего
        // невозможно отследить актуальность контейнера.
        if (baseZoomElement && baseZoomElement.className.indexOf('controls-Popup') === -1) {
            this._zoomCache.set(baseZoomElement, zoomValue);
        }

        return zoomValue;
    }

    resetCache(): void {
        this._zoomCache.clear();
    }

    /**
     * Скалирует необходимые поля размеров и координат элемента относительно зума
     * @private
     */
    protected _getScaledElementDimensions<T>(
        element: Partial<T>,
        fields: string[],
        zoom: number,
        scaleToBodyZoom?: boolean
    ): T {
        return fields.reduce((accumulator, field) => {
            // Начиная с версии хрома 128 изменилась логика расчетов с zoom
            // https://developer.chrome.com/release-notes/128?hl=ru#standardized_css_zoom_property
            // TODO: https://online.sbis.ru/opendoc.html?guid=59f05782-47b8-480d-929d-dc79344623c4&client=3
            if ((detection.chromeVersion >= 128 || detection.EdgeVersion >= 128) && element !== document.body) {
                accumulator[field] = element[field] / zoom;
            } else {
                accumulator[field] = this._calcScaledValue(element[field], zoom, scaleToBodyZoom);
            }
            return accumulator;
        }, {} as T);
    }

    /**
     * Получение размеров visualViewport
     * @private
     */
    protected _getVisualViewport(): IVisualViewportDimensions {
        if (window?.visualViewport) {
            return window.visualViewport;
        }
        return {
            offsetLeft: 0,
            offsetTop: 0,
            pageLeft: constants.isBrowserPlatform && window.pageXOffset,
            pageTop: constants.isBrowserPlatform && window.pageYOffset,
            width: constants.isBrowserPlatform && document.body.clientWidth,
            height: constants.isBrowserPlatform && document.body.clientHeight,
        };
    }

    protected _getMouseCoordsByMouseEvent(
        event: MouseEvent | TouchEvent,
        scaleToBodyZoom: boolean,
        zoom?: number
    ): IMouseCoords {
        const eventType = event.type;
        const target = scaleToBodyZoom ? document?.body : event.target;
        const zoomValue = zoom || this.getZoomValue(target);
        if (event.touches || event.changedTouches) {
            let touches = event.touches;
            if (eventType === 'touchend') {
                touches = event.changedTouches;
            }
            return {
                x: touches[0].pageX / zoomValue,
                y: touches[0].pageY / zoomValue,
            };
        } else if (typeof event.pageX === 'number') {
            return {
                x: event.pageX / zoomValue,
                y: event.pageY / zoomValue,
            };
        } else {
            Logger.error('DimensionsMeasurer: Event type must be must be mouse or touch event.');
        }
    }

    /**
     * Получение boundingClientRect с учетом зума
     * @param element
     * @param scaleToBodyZoom
     * @protected
     */
    protected _getBoundingClientRect(element: HTMLElement, scaleToBodyZoom: boolean): DOMRect {
        if (!element) {
            return;
        }
        const defaultDimensions = element.getBoundingClientRect();
        const zoomValue = this.getZoomValue(element);
        if (this._needScaleByZoom(element, zoomValue, scaleToBodyZoom)) {
            return this._getScaledElementDimensions<DOMRect>(
                defaultDimensions,
                SCALABLE_DIMENSIONS_VALUES,
                zoomValue,
                scaleToBodyZoom
            );
        }
        return defaultDimensions;
    }

    /**
     * Получение размеров и смещений элемента с учетом зума
     * @param element
     * @param scaleToBodyZoom
     * @param calculatedZoomValue
     * @protected
     */
    protected _getElementDimensions(
        element: HTMLElement,
        scaleToBodyZoom: boolean,
        calculatedZoomValue?: number
    ): IElementDimensions {
        const zoomValue =
            calculatedZoomValue === undefined ? this.getZoomValue(element) : calculatedZoomValue;

        // Если передали расчитанный зум, то надо скейлить
        const forcedScale = scaleToBodyZoom || calculatedZoomValue !== undefined;
        if (this._needScaleByZoom(element, zoomValue, forcedScale)) {
            return this._getScaledElementDimensions<IElementDimensions>(
                element,
                ELEMENT_DIMENSIONS,
                zoomValue,
                scaleToBodyZoom
            );
        } else {
            return element;
        }
    }

    /**
     * Расчет заскейленного относительно зума значения размера/оффсета элемента
     * Если передан флаг scaleToBodyZoom, то значения приводятся к значению zoom у body
     * @param value
     * @param zoom
     * @param scaleToBodyZoom
     * @private
     */
    private _calcScaledValue(value: number, zoom: number, scaleToBodyZoom: boolean): number {
        let zoomValue = zoom;
        if (scaleToBodyZoom) {
            zoomValue = this._getMainZoom() / zoom;
        }
        return value / zoomValue;
    }

    /**
     * Определяем необходимость скейла размеров элемента относительно зума
     * Всё что выше body должно скейлиться, т.к. zoom на body
     * @param element
     * @param zoomValue
     * @param forcedScale
     * @private
     */
    protected _needScaleByZoom(
        element: HTMLElement,
        zoomValue: number,
        forcedScale: boolean
    ): boolean {
        return (
            forcedScale ||
            (zoomValue !== DEFAULT_ZOOM_VALUE &&
                (element === document.documentElement || !element.closest('body')))
        );
    }

    /**
     * Получение значения zoom, с body
     * Считаем, что это самый верхний элемент на котором может быть zoom
     * @private
     */
    private _getMainZoom(): number {
        return this.getZoomValue(document?.body);
    }
}

export default new DimensionsMeasurer();
