/**
 * @kaizen_zone 75e61337-2408-4b9e-b6c7-556929cedca1
 */
import { IBasePopupOptions, IOpener } from 'Controls/_popup/interface/IBaseOpener';
import { IResizeDirection } from 'Controls/_popup/interface/IDialog';
import { Control } from 'UI/Base';
import { IBackgroundStyleOptions } from 'Controls/interface';
import { IAdaptivePopupOptions } from 'Controls/_popup/interface/IAdaptivePopup';
import { IPopupWidthOptions } from 'Controls/_popup/interface/IPopupWidth';

export type TActionOnScroll = 'close' | 'track' | 'none';
interface ITargetPosition {
    x: number;
    y: number;
}
export type TTarget = HTMLElement | EventTarget | ITargetPosition | Control<{}>;

export interface IStickyPopupPosition {
    targetPoint?: IStickyPosition;
    direction?: IStickyPosition;
    offset?: IStickyPositionOffset;
}

export interface IStickyPopupOptions
    extends IBasePopupOptions,
        IBackgroundStyleOptions,
        IAdaptivePopupOptions,
        IPopupWidthOptions {
    stickyPosition?: IStickyPopupPosition;
    minWidth?: number;
    width?: number;
    maxWidth?: number;
    minHeight?: number;
    height?: number;
    maxHeight?: number;

    target?: TTarget;
    trackTarget?: boolean;
    actionOnScroll?: TActionOnScroll;
    targetPoint?: IStickyPosition;
    direction?: IStickyPosition;
    offset?: IStickyPositionOffset;
    fittingMode?: string | IStickyPosition;
    resizeDirection?: IResizeDirection;
    disableAnimation?: boolean;
    closeOnOutsideDndEnd?: boolean;
    openOnDnd?: boolean;
    fixPosition?: boolean;
    preventOverlapsClassNames?: string[];
}

export interface IStickyPosition {
    vertical?: 'top' | 'bottom' | 'center' | string;
    horizontal?: 'left' | 'right' | 'center' | string;
}

export interface IStickyPositionOffset {
    vertical?: number;
    horizontal?: number;
}

/**
 * Интерфейс для методов {@link /doc/platform/developmentapl/interface-development/controls/openers/sticky/ прилипающих блоков}.
 * @public
 * @interface Controls/_popup/interface/IStickyOpener
 * @implements Controls/_popup/interface/IPopupWidth
 */
export interface IStickyOpener extends IOpener {
    readonly '[Controls/_popup/interface/IStickyOpener]': boolean;
}

/**
 * @typedef {Object} Controls/_popup/interface/IStickyOpener/TActionOnScroll
 * @variant close Прилипающий блок закрывается.
 * @variant track  Прилипающий блок движется вместе со своей точкой позиционирования.
 * @variant none Прилипающий блок остается на месте расположения, вне зависимости от движения точки позиционирования.
 */

/**
 * @typedef {Object} Controls/_popup/interface/IStickyOpener/PopupOptions
 * @description Конфигурация прилипающего блока.
 * @property {Boolean} autofocus Установится ли фокус на шаблон попапа после его открытия.
 * @property {Controls/_popup/interface/IStickyOpener/TActionOnScroll.typedef} actionOnScroll Реакция прилипающего блока на скролл родительской области.
 * @property {Boolean} modal Будет ли открываемый прилипающий блок блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде прилипающего блока.
 * @property {Boolean} closeOnOutsideClick Возможность закрытия прилипающего блока по клику вне.
 * @property {function|String} template Шаблон прилипающего блока.
 * @property {function|String} templateOptions Опции для контрола, переданного в {@link template}.
 * @property {Controls/popup:IStickyPosition} targetPoint Точка позиционирования прилипающего блока относительно вызывающего элемента.
 * @property {Controls/_popup/interface/IStickyOpener/Direction.typedef} direction Выравнивание прилипающего блока относительно точки позиционирования.
 * @property {Controls/_popup/interface/IStickyOpener/Offset.typedef} offset Отступы от точки позиционирования до прилипающего блока.
 * @property {Number} minWidth Минимальная ширина прилипающего блока.
 * @property {Number} maxWidth Максимальная ширина прилипающего блока.
 * @property {Number} minHeight Минимальная высота прилипающего блока.
 * @property {Number} maxHeight Максимальная высота прилипающего блока.
 * @property {Number} height Текущая высота прилипающего блока.
 * * @property {Controls/_popup/interface/IPopupWidth/TPopupWidth.typedef} width Текущая ширина прилипающего блока.
 * @property {Node|Control} target Элемент (DOM-элемент или контрол), относительно которого позиционируется прилипающий блок.
 * @property {Node} opener Логический инициатор открытия прилипающего блока (см. {@link /doc/platform/developmentapl/interface-development/ui-library/focus/activate-control/#control-opener Определение понятия "опенер контрола"}).
 * @property {Controls/_popup/interface/IStickyOpener/FittingMode.typedef} fittingMode Поведение блока, в случае, если он не помещается на экране с заданным позиционированием.
 * @property {Controls/_popup/interface/IBasePopupOptions/EventHandlers.typedef} eventHandlers Функции обратного вызова на события прилипающего блока.
 * @property {Boolean} closeOnOutsideDndEnd Определяет возможность закрытия окна при завершении dragnDrop'а за пределами окна.
 * @property {Boolean} openOnDnd Определяет возможность открытия окна при наличии dragnDrop'а за пределами окна.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#closeOnOutsideDndEnd
 * @cfg {Boolean} Определяет возможность закрытия окна при завершении dragnDrop'а за пределами окна.
 * @default true
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#restrictiveContainer
 * @cfg {String} Опция задает контейнер (через селектор), внутри которого будет позиционироваться блок. Блок не может спозиционироваться за пределами restrictiveContainer.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#minWidth
 * @cfg {Number} Минимальная ширина прилипающего блока.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#maxWidth
 * @cfg {Number} Максимальная ширина прилипающего блока.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#minHeight
 * @cfg {Number} Минимальная высота прилипающего блока.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#maxHeight
 * @cfg {Number} Максимальная высота прилипающего блока.
 */
/**
 * @name Controls/_popup/interface/IStickyOpener#height
 * @cfg {Number} Текущая высота прилипающего блока.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#target
 * @cfg {Node|Control} Элемент, относительно которого позиционируется прилипающий блок.
 * @variant DOM-элемент
 * @variant Контрол
 * @variant Точка позиционирования {x: number, y: number}. Используется когда DOM-элемент/Контрол могут быть
 * удалены из DOM-дерева.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#trackTarget
 * @cfg {Boolean} Определяет необходимость отслеживания таргета.
 * @default false
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#actionOnScroll
 * @cfg {Controls/_popup/interface/IStickyOpener/TActionOnScroll.typedef} Определяет реакцию прилипающего блока на скролл родительской области.
 * @default none
 * @demo Controls-demo/Popup/Sticky/ActionOnScroll/Index
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#targetPoint
 * @cfg {Controls/_popup/interface/IStickyOpener/Direction.typedef} Точка позиционирования прилипающего блока относительно вызывающего элемента.
 */

/*
 * @name Controls/_popup/interface/IStickyOpener#targetPoint
 * @cfg {Controls/_popup/interface/IStickyOpener/Direction.typedef} Point positioning of the target relative to sticky.
 */

/**
 * @typedef {Object} Controls/_popup/interface/IStickyOpener/Direction
 * @description Свойства объекта, который передается в опцию {@link direction}.
 * @property {Controls/_popup/interface/IStickyOpener/Vertical.typedef} vertical Конфигурация вертикального выравнивания.
 * @property {Controls/_popup/interface/IStickyOpener/Horizontal.typedef} horizontal Конфигурация горизонтального выравнивания.
 */

/**
 * @typedef {String} Controls/_popup/interface/IStickyOpener/Vertical
 * @description Допустимые значения для свойства {@link Controls/_popup/interface/IStickyOpener/Direction.typedef vertical}.
 * @variant top Сверху.
 * @variant bottom Снизу.
 * @variant center По центру.
 */

/**
 * @typedef {String} Controls/_popup/interface/IStickyOpener/Horizontal
 * @description Допустимые значения для свойства {@link Controls/_popup/interface/IStickyOpener/Direction.typedef horizontal}.
 * @variant left Слева.
 * @variant right Справа.
 * @variant center По центру.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#direction
 * @cfg {Controls/_popup/interface/IStickyOpener/Direction.typedef} Выравнивание прилипающего блока относительно точки позиционирования.
 */

/*
 * @name Controls/_popup/interface/IStickyOpener#direction
 * @cfg {Controls/_popup/interface/IStickyOpener/Direction.typedef} Sets the alignment of the popup.
 */

/**
 * @typedef {Object} Controls/_popup/interface/IStickyOpener/Offset
 * @description Свойства объекта, который передается в опцию {@link offset}.
 * @property {Number} vertical Отступ по вертикали. Значение задается в px.
 * @property {Number} horizontal Отступ по горизонтали. Значение задается в px.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#offset
 * @cfg {Controls/_popup/interface/IStickyOpener/Offset.typedef} Конфигурация отступов от точки позиционирования до прилипающего блока.
 */

/*
 * @name Controls/_popup/interface/IStickyOpener#offset
 * @cfg {Controls/_popup/interface/IStickyOpener/Offset.typedef} Sets the offset of the targetPoint.
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#backgroundStyle
 * @cfg {String} Стиль фона прилипающего блока.
 * @demo Controls-demo/dropdown_new/Button/MenuPopupBackground/Index
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#fittingMode
 * @cfg {Controls/_popup/interface/IStickyOpener/FittingMode.typedef} Поведение блока, в случае, если он не помещается на экране с заданным позиционированием.
 */

/**
 * @typedef {Object} Controls/_popup/interface/IStickyOpener/FittingMode
 * @description Свойства объекта, который передается в опцию {@link fittingMode}.
 * @property {Controls/_popup/interface/IStickyOpener/FittingModeValue.typedef} [vertical=adaptive]
 * @property {Controls/_popup/interface/IStickyOpener/FittingModeValue.typedef} [horizontal=adaptive]
 */

/**
 * @typedef {String} Controls/_popup/interface/IStickyOpener/FittingModeValue
 * @description Допустимые значения для свойств {@link Controls/_popup/interface/IStickyOpener/FittingMode.typedef vertical и horizontal}.
 * @variant fixed Координаты точки позиционирования не меняются. Высота и ширина окна меняются так, чтобы его содержимое не выходило за пределы экрана.
 * @variant overflow Координаты точки позиционирования меняются (блок сдвигается относительно целевого элемента настолько, насколько не помещается в области видимости экрана, причем блок, возможно, будет перекрывать целевой элемент.) Если блок имеет размеры больше экрана, то ширина и высота уменьшаются так, чтобы блок поместился.
 * @variant adaptive Координаты точки позиционирования (см. {@link Controls/_popup/interface/IStickyOpener#targetPoint targetPoint}) и выравнивание (см. {@link Controls/_popup/interface/IStickyOpener#direction direction}) меняются на противоположные. Если и в этом случае блок не помещается на экран, выбирается тот способ позиционирования (изначальный или инвертируемый), при котором на экране помещается наибольшая часть контента. Например, если поле ввода с автодополнением находится внизу экрана, то список автодополнения раскроется вверх от поля. Ширина и высота при этом уменьшаются так, чтобы блок поместился на экран.
 * @variant adaptiveOverflow Координаты точки позиционирования (см. {@link Controls/_popup/interface/IStickyOpener#targetPoint targetPoint}) и выравнивание (см. {@link Controls/_popup/interface/IStickyOpener#direction direction}) меняются на противоположные. Если и в этом случае блок не помещается на экран, выбирается тот способ позиционирования (изначальный или инвертируемый), при котором на экране помещается наибольшая часть контента. Например, если поле ввода с автодополнением находится внизу экрана, то список автодополнения раскроется вверх от поля. Ширина и высота при этом не уменьшаются.
 *
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#preventOverlapsClassNames
 * @cfg {String[]} Набор классов элементов, от которых будет отталкиваться окно.
 * @remark Если по изначальной позиции окно пересекает границы элемента, класс которого указан в массиве, оно сдвинется
 * на соотвествующие расстояние вбок.
 * @demo Controls-demo/Popup/Sticky/PreventOverlapsClassNames/Index
 */

/**
 * Метод для закрытия прилипающего блока.
 * @name Controls/_popup/interface/IStickyOpener#close
 * @function
 * @example
 * <pre class="brush: js">
 * // TypeScript
 * import {StickyOpener} from 'Controls/popup';
 *
 * this._sticky = new StickyOpener();
 *
 * closeSticky() {
 *     this._sticky.close();
 * }
 * </pre>
 * @see open
 * @see destroy
 * @see isOpened
 */

/**
 * Разрушает экземпляр класса.
 * @name Controls/_popup/interface/IStickyOpener#destroy
 * @function
 * @example
 * <pre class="brush: js">
 * // TypeScript
 * import {StickyOpener} from 'Controls/popup';
 *
 * this._sticky = new StickyOpener();
 *
 * _beforeUnmount() {
 *     this._sticky.destroy();
 *     this._sticky = null;
 * }
 * </pre>
 * @see open
 * @see close
 * @see isOpened
 */

/**
 * @name Controls/_popup/interface/IStickyOpener#isOpened
 * @description Возвращает информацию о том, открыт ли прилипающий блок.
 * @function
 * @see open
 * @see close
 * @see destroy
 */

/*
 * Open sticky popup.
 * If you call this method while the window is already opened, it will cause the redrawing of the window.
 * @function Controls/_popup/interface/IStickyOpener#open
 * @param {Controls/_popup/interface/IStickyOpener/PopupOptions.typedef} popupOptions Sticky popup options.
 * @remark {@link /docs/js/Controls/interface/IStickyOptions#popupOptions popupOptions}
 */

/**
 * Метод открытия прилипающего блока.
 * @function Controls/_popup/interface/IStickyOpener#open
 * @param {Controls/_popup/interface/IStickyOpener/PopupOptions.typedef} popupOptions Конфигурация прилипающего блока.
 * @return Promise<void>
 * @remark
 * Для открытия окна без создания {@link Controls/popup:Sticky} в верстке используйте методы класса {@link Controls/popup:StickyOpener}.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.popup:Sticky name="sticky" template="Controls-demo/Popup/TestDialog">
 *    <ws:direction vertical="bottom" horizontal="left"/>
 *    <ws:targetPoint vertical="bottom" horizontal="left"/>
 * </Controls.popup:Sticky>
 *
 * <div name="target">{{_text}}</div>
 *
 * <Controls.buttons:Button name="openStickyButton" caption="open sticky" on:click="_open()"/>
 * <Controls.buttons:Button name="closeStickyButton" caption="close sticky" on:click="_close()"/>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions>{
 *    _open() {
 *       var popupOptions = {
 *          target: this._children.target,
 *          opener: this._children.openStickyButton,
 *          templateOptions: {
 *             record: this._record
 *          }
 *       }
 *       this._children.sticky.open(popupOptions);
 *    }
 *    _close() {
 *       this._children.sticky.close()
 *    }
 * }
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * import {StickyOpener} from 'Controls/popup';
 *
 * this._sticky = new StickyOpener();
 *
 * openSticky() {
 *     this._sticky.open({
 *         template: 'Example/MyStickyTemplate',
 *         opener: this._children.myButton
 *     });
 * }
 * </pre>
 * @return {Promise<string|undefined>}
 * @see close
 * @see closePopup
 */
