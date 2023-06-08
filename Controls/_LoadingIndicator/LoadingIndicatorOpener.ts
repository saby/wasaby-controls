/**
 * @kaizen_zone e357abc8-f95f-41f1-8865-200e7196c6df
 */
/**
 * Хэлпер для открытия глобального индикатора загрузки
 *
 * @example
 * <pre class="brush: js">
 *    import {IndicatorOpener} from 'Controls/LoadingIndicator';
 *
 *    function showIndicator() {
 *       const config = {
 *           ...
 *       };
 *       this.id = IndicatorOpener.show(this.config);
 *    }
 *
 *    function hideIndicator() {
 *       IndicatorOpener.hide(this.id);
 *    }
 * </pre>
 *
 * @remark
 * Метод show возвращает id, который нужно передавать в метод hide для закрытия определенного индикатора.
 *
 * @module Controls/LoadingIndicator/IndicatorOpener
 * @public
 */

import ILoadingIndicator, { ILoadingIndicatorOptions } from './interface/ILoadingIndicator';

const GLOBAL_INDICATOR_ZINDEX: number = 10000;

/*
 * show indicator (bypassing requests of indicator showing stack)
 */
/**
 * Отображает индикатор загрузки.
 * @name Controls/LoadingIndicator/IndicatorOpener#show
 * @function
 * @param {Controls/LoadingIndicator/IndicatorOpener/config.typedef} config Объект с параметрами. Если не задан, по умолчанию используется значение аналогичного параметра контрола.
 * @param {Promise} waitPromise Promise, к которому привязывается отображение индикатора. Индикатор скроется после завершения Promise.
 * @returns {String} Возвращает id индикатора загрузки. Используется в методе {@link hide} для закрытия индикатора.
 * @demo Controls-demo/LoadingIndicator/WaitPromise/Index
 * @see hide
 */

/**
 * @typedef {Object} Controls/LoadingIndicator/IndicatorOpener/config
 * @description Объект с параметрами. Если не задан, по умолчанию используется значение аналогичного параметра контрола.
 * @property {Controls/LoadingIndicator/interface/ILoadingIndicator/isGlobal} isGlobal Определяет, показать индикатор над всей страницей или только над собственным контентом.
 * @property {Controls/LoadingIndicator/interface/ILoadingIndicator/message} message Текст сообщения индикатора.
 * @property {Controls/LoadingIndicator/interface/ILoadingIndicator/Scroll} scroll Добавляет градиент фону индикатора.
 * @property {Controls/LoadingIndicator/interface/ILoadingIndicator/small} small Размер индикатора.
 * @property {Controls/LoadingIndicator/interface/ILoadingIndicator/overlay} overlay Настройки оверлея индикатора.
 * @property {Controls/LoadingIndicator/interface/ILoadingIndicator/delay} delay Задержка перед началом показа индикатора.
 */
function show(config: ILoadingIndicatorOptions = {}, waitPromise?: Promise<unknown>): string {
    config.zIndex = GLOBAL_INDICATOR_ZINDEX;
    return this.mainIndicator?.show(config, waitPromise);
}
/*
 * hide indicator (bypassing requests of indicator showing stack)
 */
/**
 * Скрывает индикатор загрузки.
 * @function
 * @name Controls/LoadingIndicator/IndicatorOpener#hide
 * @param {string} id Идентификатор индикатора загрузки.
 * @see show
 */
function hide(id: string): void {
    if (id) {
        this.mainIndicator?.hide(id);
    }
}

export default {
    _setIndicator(indicator: ILoadingIndicator): void {
        this.mainIndicator = indicator;
    },
    show,
    hide,
};
