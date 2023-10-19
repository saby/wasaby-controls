/**
 * @kaizen_zone 49e4d90e-38bb-4029-bdfb-9dd08e44fa83
 */
import { TemplateFunction } from 'UI/Base';
import { IBasePopupOptions } from 'Controls/popup';

type TSlidingPanelPosition = 'top' | 'bottom';

type TDesktopMode = 'dialog' | 'stack' | 'sticky';

export interface ISlidingPanelPopupOptions extends IBasePopupOptions {
    slidingPanelOptions: ISlidingPanelOptions;
    className?: string;
    dialogOptions: IDialogOptions;
    modal?: boolean;
    position?: TSlidingPanelPosition;
    content?: TemplateFunction;
    desktopMode?: TDesktopMode;
    isAdaptive?: boolean;
}

export interface ISlidingPanelOptions {
    restrictiveContainer?: string;
    maxHeight?: number;
    minHeight?: number;
    position?: TSlidingPanelPosition;
    height?: number;
    desktopMode?: TDesktopMode;
    autoHeight?: boolean;
    heightList?: number[];
    userMoveLocked?: boolean;
    isMobileMode?: boolean;
    shouldSwipeOnContent?: boolean;
}

export interface IDialogOptions {
    minHeight?: number;
    maxHeight?: number;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    height?: number;
}

/**
 * Интерфейс для опций окна-шторки.
 * @public
 * @implements Controls/popup:IBaseOpener
 */
export interface ISlidingPanel {
    readonly '[Controls/_popup/interface/ISlidingPanel]': boolean;
}

/**
 * @name Controls/_popup/interface/ISlidingPanel#desktopMode
 * @cfg {String} Определяет какого вида окно откроется на настольном компьютере и планшете.
 * @variant stack (Стековая панель)
 * @variant dialog (Диалоговое окно)
 * @variant sticky (Всплывающее окно)
 * @default stack
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#isAdaptive
 * @cfg {boolean} Определяет должна ли шторка адаптировать способ открытия в зависимости от того вызывается отрытие на мобильном устройстве или нет.
 * @variant true На мобильном устройстве открывается шторка, на остальных открывается stack/dialog/sticky в зависимости от desktopMode
 * @variant false Всегда открывается шторка
 * @default true
 * @example
 * <pre class="brush: js">
 * import {SlidingPanelOpener} from 'Controls/popup';
 *
 * this._slidingPanel = new SlidingPanelOpener({
 *    isAdaptive: false
 * });
 *
 * _openSlidingPanel() {
 *     this._slidingPanel.open(config);
 * }
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#slidingPanelOptions
 * @cfg {Controls/_popup/interface/ISlidingPanel/SlidingPanelOptions.typedef} Конфигурация окна на мобильном устройстве.
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#dialogOptions
 * @cfg {Controls/_popup/interface/ISlidingPanel/DialogOptions.typedef} Конфигурация окна на настольном компьютере и планшете.
 */

/**
 * @typedef {Object} Controls/_popup/interface/ISlidingPanel/DialogOptions
 * @description Настройки окна на настольном компьютере и планшете.
 * Подробнее:
 * Для desktopMode "dialog" {@link Controls/_popup/interface/IDialogOpener здесь}
 * Для desktopMode "stack" {@link Controls/_popup/interface/IStackOpener здесь}
 * @property {Number} minHeight Минимальная высота окна, px.
 * @property {Number} maxHeight Максимальная высота окна, px.
 * @property {Number} height Текущая высота окна.
 * @property {Number} maxWidth Максимальная ширина окна.
 * @property {Number} minWidth Минимальная ширина окна.
 * @property {Number} width Текущая ширина окна.
 */

/**
 * @typedef {Object} Controls/_popup/interface/ISlidingPanel/SlidingPanelOptions
 * @description Настройки окна на мобильном устройстве.
 * @property {Boolean} modal
 * @property {Number} minHeight Минимально допустимая высота окна, px. С такой высотой оно открывается.
 * @property {Number} maxHeight Максимально допустимая высота окна, px.
 * @property {String} position Определяет с какой стороны отображается окно. (Варианты: 'top', 'bottom')
 * @property {Boolean} autoHeight Позволяет окну до начала изменения высоты с помощью свайпа принимать высоту по контенту.
 * @property {Boolean} userMoveLocked Определяет возможность взаимодействия с окном через свайп.
 * Если true, то окно невозмозможно двигать свайпом. Закрыть можно только программно.
 * @property {Number[]} heightList Определяет список высот(якорей), которые может принимать окно при растягивании.
 * Когда пользователь отпускает свайп после растягивания окна принимает высоту ближайшего по значению якоря.
 * Для определения того, к какому якорю сейчас прикреплена шторка в шаблон попапа спускаются опции currentHeight и heightList
 * @property {String} restrictiveContainer Определяет селектор контейнера в рамаках которого будет строиться шторка.
 * Шторка будет вписываться в данный контейнер по ширине, но открываться будет от низа экрана.
 * Пример задания: '.my-super-class'
 * Демо-пример: https://pre-test-wi.sbis.ru/materials/viewdemo/Controls-demo/Popup/SlidingPanel/RestrictiveContainer/Index
 */

/**
 * @typedef {Object} Controls/_popup/interface/ISlidingPanel/PopupOptions
 * @description Конфигурация окна.
 * @property {String} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {String} desktopMode Определяет какого вида окно откроется на настольном компьютере и планшете. (Варианты: 'stack', 'dialog')
 * @property {function|String} template Шаблон всплывающего окна.
 * @property {function|String} templateOptions Опции для контрола, переданного в {@link template}.
 * @property {Controls/_popup/interface/ISlidingPanel/SlidingPanelOptions.typedef} slidingPanelOptions Конфигурация окна на мобильном устройстве
 * @property {Controls/_popup/interface/ISlidingPanel/DialogOptions.typedef} dialogOptions Конфигурация окна на настольном компьютере и планшете
 * @property {Node} opener Логический инициатор открытия всплывающего окна. Читайте подробнее {@link /doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
 * @property {Controls/_popup/interface/IBaseOpener/EventHandlers.typedef} eventHandlers Функции обратного вызова на события окна.
 */

/**
 * Метод для закрытия окна-шторки.
 * @name Controls/_popup/interface/ISlidingPanel#close
 * @function
 * @example
 * <pre class="brush: js">
 * import {SlidingPanelOpener} from 'Controls/popup';
 *
 * this._slidingPanel = new SlidingPanelOpener();
 *
 * closeStack() {
 *     this._slidingPanel.close();
 * }
 * </pre>
 * @see open
 * @see destroy
 * @see isOpened
 */

/**
 * Разрушает экземпляр класса
 * @name Controls/_popup/interface/ISlidingPanel#destroy
 * @function
 * @example
 * <pre class="brush: js">
 * import {SlidingPanelOpener} from 'Controls/popup';
 *
 * this._slidingPanel = new SlidingPanelOpener();
 *
 * _beforeUnmount() {
 *     this._slidingPanel.destroy();
 *     this._slidingPanel = null;
 * }
 * </pre>
 * @see open
 * @see close
 * @see isOpened
 */

/**
 * @name Controls/_popup/interface/ISlidingPanel#isOpened
 * @description Возвращает информацию о том, открыта ли шторка.
 * @function
 * @see open
 * @see close
 * @see destroy
 */

/**
 * Метод для открытия шторки.
 * @function Controls/_popup/interface/ISlidingPanel#open
 * @param {Controls/_popup/interface/ISlidingPanel/PopupOptions.typedef} popupOptions Конфигурация шторки.
 * @example
 * <pre class="brush: js">
 * import {SlidingPanelOpener} from 'Controls/popup';
 *
 * this._slidingPanel = new SlidingPanelOpener();
 *
 * openStack() {
 *     this._slidingPanel.open({
 *         template: 'Example/MyStackTemplate',
 *         opener: this._children.myButton
 *     });
 * }
 * </pre>
 * @see close
 * @see destroy
 * @see isOpened
 */
