/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { IOpener, IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';
import { IAdaptivePopupOptions } from 'Controls/_popup/interface/IAdaptivePopup';

export interface IStackPopupOptions extends IBasePopupOptions, IAdaptivePopupOptions {
    asyncShow?: boolean;
    maximized?: boolean;
    hasDefaultStackTemplate?: boolean;
    workspaceWidth?: number;
    minimizedWidth?: number;
    minWidth?: number;
    width?: number | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
    maxWidth?: number;
    propStorageId?: string;
    restrictiveContainer?: string;
    stackPosition?: string;
}

/**
 * Интерфейс для опций {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ стековых окон}.
 * @public
 */
export interface IStackOpener extends IOpener {
    readonly '[Controls/_popup/interface/IStackOpener]': boolean;
}

/**
 * Метод открытия {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ стекового окна}.
 * @function Controls/_popup/interface/IStackOpener#open
 * @param {Controls/_popup/interface/IStackOpener/PopupOptions.typedef} popupOptions Конфигурация стекового окна.
 * @remark
 * Для открытия окна без создания {@link Controls/popup:Stack} в верстке используйте методы класса {@link Controls/popup:StackOpener}.
 * @return Promise<void>
 * @example
 * В этом примере показано, как открыть и закрыть стековое окно.
 * <pre class="brush: html">
 * <!-- WML-->
 * <Controls.popup:Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
 *    <ws:templateOptions key="111"/>
 * </Controls.popup:Stack>
 *
 * <Controls.buttons:Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions>{
 *    _openStack() {
 *       var popupOptions = {
 *          autofocus: true
 *       }
 *       this._children.stack.open(popupOptions)
 *    }
 * }
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * import {StackOpener} from 'Controls/popup';
 *
 * this._stack = new StackOpener();
 *
 * openStack() {
 *     this._stack.open({
 *         template: 'Example/MyStackTemplate',
 *         opener: this._children.myButton
 *     });
 * }
 * </pre>
 * @see close
 */

/**
 * Метод закрытия стекового окна.
 * @name Controls/_popup/interface/IStackOpener#close
 * @function
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.popup:Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
 *    <ws:templateOptions key="111"/>
 * </Controls.popup:Stack>
 *
 * <Controls.buttons:Button name="closeStackButton" caption="close stack" on:click="_closeStack()"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions>{
 *    _closeStack() {
 *       this._children.stack.close()
 *    }
 * }
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * import {StackOpener} from 'Controls/popup';
 *
 * this._stack = new StackOpener();
 *
 * closeStack() {
 *     this._stack.close();
 * }
 * </pre>
 * @see open
 * @see destroy
 * @see isOpened
 */

/**
 * @typedef {Object} Controls/_popup/interface/IStackOpener/PopupOptions
 * @description Конфигурация стекового окна.
 * @property {Boolean} [autofocus=true] Установится ли фокус на шаблон попапа после его открытия.
 * @property {Boolean} [modal=false] Будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде стекового окна.
 * @property {Boolean} [closeOnOutsideClick=false] Определяет возможность закрытия стекового окна по клику вне.
 * @property {function|String} template Шаблон стекового окна.
 * @property {function|String} templateOptions Опции для контрола, переданного в {@link template}.
 * @property {Number|Controls/_popup/interface/IStackOpener/BaseSizes.typedef} minWidth Минимально допустимая ширина стекового окна. Значение указывается в px. Так же поддерживается стандартная линейка размеров.
 * @property {Number|Controls/_popup/interface/IStackOpener/BaseSizes.typedef} maxWidth Максимально допустимая ширина стекового окна. Значение указывается в px. Так же поддерживается стандартная линейка размеров.
 * @property {Number|Controls/_popup/interface/IStackOpener/BaseSizes.typedef} width Текущая ширина стекового окна. Значение указывается в px. Так же поддерживается стандартная линейка размеров.
 * @property {Node} opener Логический инициатор открытия стекового окна (см. {@link /doc/platform/developmentapl/interface-development/ui-library/focus/activate-control/#control-opener Определение понятия "опенер контрола"}).
 * @property {Controls/_popup/interface/IBaseOpener/EventHandlers.typedef} eventHandlers Функции обратного вызова на события стекового окна.
 */

/*
 * @typedef {Object} Controls/_popup/interface/IStackOpener/PopupOptions
 * @description Stack popup options.
 * @property {Boolean} [autofocus=true] Determines whether focus is set to the template when popup is opened.
 * @property {Boolean} [modal=false] Determines whether the window is modal.
 * @property {String} className Class names of popup.
 * @property {Boolean} [closeOnOutsideClick=false] Determines whether possibility of closing the popup when clicking past.
 * @property {function|String} template Template inside popup.
 * @property {function|String} templateOptions Template options inside popup.
 * @property {Number} minWidth The minimum width of popup.
 * @property {Number} maxWidth The maximum width of popup.
 * @property {Number} width Width of popup.
 * @property {Node} opener Read more {@link /doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener there}.
 * @property {Controls/_popup/interface/IBaseOpener/EventHandlers.typedef} eventHandlers Callback functions on popup events.
 */

/**
 * @typedef {BaseSizes} Controls/_popup/interface/IStackOpener/BaseSizes
 * @description Стандартная линейка размеров для ширин стековых панелей. Значения устанавливаются согласно заданной теме.
 * Подробнее о значениях переменных для темы {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-22.5100/Controls-default-theme/variables/_popupTemplate.less#L112 online'а}
 * @property {String} a
 * @property {String} b
 * @property {String} c
 * @property {String} d
 * @property {String} e
 * @property {String} f
 * @property {String} g
 */

/**
 * @name Controls/_popup/interface/IStackOpener#minimizedWidth
 * @cfg {Number} Ширина стекового окна в свернутом состоянии. Необходимо для работы механизма
 * сворачивания/разворачивания панели.
 * @demo Controls-demo/Popup/Stack/Index
 * @see minWidth
 * @see maxWidth
 * @see propStorageId
 */

/**
 * @name Controls/_popup/interface/IStackOpener#minWidth
 * @cfg {Number|Controls/_popup/interface/IStackOpener/BaseSizes.typedef} Минимально допустимая ширина стекового окна.
 * Значение указывается в px. Так же поддерживается стандартная линейка размеров.
 * @remark
 * Значение может быть задано как на опциях Controls/popup:Stack, так и на дефолтных опциях шаблона {@link template}.
 * Приоритетнее то, которое задано на Controls/popup:Stack.
 * @demo Controls-demo/Popup/Stack/BaseWidthSizes/Index
 */
/*
 * @name Controls/_popup/interface/IStackOpener#minWidth
 * @cfg {Number} The minimum width of popup.
 */

/**
 * @name Controls/_popup/interface/IStackOpener#width
 * @cfg {Number|Controls/_popup/interface/IStackOpener/BaseSizes.typedef} Текущая ширина стекового окна. Значение
 * указывается в px. Так же поддерживается стандартная линейка размеров.
 * @remark
 * Значение может быть задано как на опциях Controls/popup:Stack, так и на дефолтных опциях шаблона {@link template}.
 * Приоритетнее то, которое задано на Controls/popup:Stack.
 * @demo Controls-demo/Popup/Stack/BaseWidthSizes/Index
 */
/*
 * @name Controls/_popup/interface/IStackOpener#width
 * @cfg {Number} Width of popup.
 */

/**
 * @name Controls/_popup/interface/IStackOpener#maxWidth
 * @cfg {Number|Controls/_popup/interface/IStackOpener/BaseSizes.typedef} Максимально допустимая ширина стекового окна.
 * Значение указывается в px. Так же поддерживается стандартная линейка размеров.
 * @remark
 * Значение может быть задано как на опциях Controls/popup:Stack, так и на дефолтных опциях шаблона {@link template}.
 * Приоритетнее то, которое задано на Controls/popup:Stack.
 * @demo Controls-demo/Popup/Stack/BaseWidthSizes/Index
 */
/*
 * @name Controls/_popup/interface/IStackOpener#maxWidth
 * @cfg {Number} The maximum width of popup.
 */

/**
 * @name Controls/_popup/interface/IStackOpener#fullscreen
 * @cfg {Boolean} Растягивает ширину попапа по ширине экрана.
 */

/**
 * @name Controls/_popup/interface/IStackOpener#propStorageId
 * @cfg {String} Уникальный идентификатор контрола, по которому будет сохраняться конфигурация в хранилище данных.
 * С помощью этой опции включается функционал движения границ.
 * Помимо propStorageId необходимо задать опции {@link Controls/_popup/interface/IStackOpener#width}, {@link Controls/_popup/interface/IStackOpener#minWidth}, {@link Controls/_popup/interface/IStackOpener#maxWidth}.
 */

/**
 * @name Controls/_popup/interface/IStackOpener#restrictiveContainer
 * @cfg {String} Опция задает контейнер (через <b>селектор</b>), внутри которого будет позиционироваться окно. Окно не может спозиционироваться за пределами restrictiveContainer.
 * @remark
 * Алгоритм поиска контейнера, внутри которого будут строиться окна:
 *
 * * Если задана опция restrictiveContainer, то ищем глобальным поиском класс по селектору, заданному в опции.
 * Если ничего не нашли или опция не задана см. следующий шаг.
 * * Если у окна есть родитель, то опрашиваем родителя, в каком контейнере он спозиционировался и выбираем его.
 * * Если родителя нет, то ищем глобальным селектором класс controls-Popup__stack-target-container.
 *
 * Класс controls-Popup__stack-target-container является зарезервированным и должен быть объявлен на странице только 1 раз.
 * Классом должен быть добавлен на контейнер, по которому позиционируются стековые окна по умолчанию.
 * * В качестве контейнера не стоит передавать другое стековое окно, так как подобное поведение не предусмотрено, и может отработать некорректно.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <div class='myRestrictiveContainer'>Контейнер со своими размерами</div>
 * <Controls.buttons:Button caption="open stack" on:click="_openStack()"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * import {StackOpener} from 'Controls/popup';
 * _beforeMount(): void{
 *    this._stackOpener = new StackOpener();
 * }
 * _openStack(): void {
 *    const config = {
 *       template: 'Controls-demo/Popup/TestStack',
 *       closeOnOutsideClick: true,
 *       autofocus: true,
 *       opener: null,
 *       restrictiveContainer: '.myRestrictiveContainer'
 *    };
 *    this._stackOpener.open(config);
 * }
 * </pre>
 * @demo Controls-demo/Popup/Stack/RestrictiveContainer/Index
 */

/**
 * @name Controls/_popup/interface/IStackOpener#hasDefaultStackTemplate
 * @cfg {Boolean} Определяет, используется ли стандартный шаблон стековых окон.
 * @remark
 * Опция повлияет на корректировку координат попапа. В стандартном стековом шаблоне присутствует абсолютно
 * спозиционированная правая панель приложения, что влияет на итоговые расчеты позиции попапа.
 * @default true
 */

/**
 * Разрушает экземпляр класса
 * @name Controls/_popup/PopupHelper/Stack#destroy
 * @function
 * @example
 * <pre class="brush: js">
 * import {StackOpener} from 'Controls/popup';
 *
 * this._stack = new StackOpener();
 *
 * _beforeUnmount() {
 *     this._stack.destroy();
 *     this._stack = null;
 * }
 * </pre>
 * @see open
 * @see close
 * @see isOpened
 */

/**
 * @name Controls/_popup/PopupHelper/Stack#isOpened
 * @description Возвращает информацию о том, открыто ли стековое окно.
 * @function
 * @see open
 * @see close
 * @see destroy
 */
