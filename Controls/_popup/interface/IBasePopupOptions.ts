/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import {
    IEventHandlers,
    IPopupItemInfo,
} from 'Controls/_popup/interface/IPopup';
import { ILoadingIndicatorOptions } from 'Controls/_LoadingIndicator/interface/ILoadingIndicator';
import { List } from 'Types/collection';
import { IDataLoader } from 'Controls/_popup/interface/IBaseOpener';

export enum InitializingWay {
    remote = 'remote',
    delayedRemote = 'delayedRemote',
}

/**
 * Интерфейс базовых опций окна.
 * @interface Controls/_popup/interface/IBasePopupOptions
 * @public
 */

export interface IBasePopupOptions {
    shouldNotUpdatePosition?: boolean;
    /**
     * @cfg Определяет, навесится ли на попап 'display: none' в случае если окно перекрыто другим окном.
     * @remark 'display: none' навешивается для оптимизации работы с несколькими попами.
     */
    shouldNotHideOverlayedPopup?: boolean;
    /**
     * @cfg {Boolean} Определяет, открывать ли попап только после маунта контролов находящихся внутри
     * @default false
     */
    asyncShow?: boolean;
    id?: string;
    content?: Control<IControlOptions, unknown> | TemplateFunction;
    /**
     * @cfg Имена классов, которые будут применены к корневой ноде окна.
     */
    className?: string;
    /**
     * @cfg Опция принимает строку, в которой содержится имя открываемого шаблона.
     * @remark Шаблон задается строкой для того чтобы загружаться лениво при открытии окна.
     * @see templateOptions
     */
    template?: Control<IControlOptions, unknown> | TemplateFunction | string;
    pageId?: string;
    /**
     * @cfg Определяет способ открытия при работе с предзагруженными данными.
     * Внимание: опция работает только в паре с опцией {@link dataLoaders}
     * @variant delayedRemote Диалог открывается сразу, предзагруженные данные после окончания запроса придут в опцию prefetchData шаблона окна.
     * @variant remote Диалог откроется только по окончании запроса. Данные придут в _beforeMount шаблона в опции prefetchData
     * @default delayedRemote
     * @demo Controls-demo/Popup/Loader/Index
     */
    initializingWay?: InitializingWay;
    /**
     * @cfg Определяет возможность закрытия окна по клику вне.
     * @default false
     */
    closeOnOutsideClick?: boolean;
    /**
     * @cfg Опции для контрола, переданного в {@link template}.
     * @see template
     */
    templateOptions?: object;
    /**
     * @cfg Логический инициатор открытия окна. Читайте подробнее {@link /doc/platform/developmentapl/interface-development/ui-library/focus/activate-control/#control-opener здесь}.
     */
    opener?: Control<IControlOptions, unknown> | null;
    /**
     * @cfg Определяет, установится ли фокус на шаблон окна после его открытия.
     * @default true
     */
    autofocus?: boolean;
    /**
     * @cfg Определяет, будет ли окно открываться выше всех окон на странице.
     */
    topPopup?: boolean;
    /**
     * @cfg Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
     * @default false
     */
    modal?: boolean;
    /**
     * @cfg Автоматически закрывать окно через 5 секунд после открытия.
     * @default false
     */
    autoClose?: boolean;
    /**
     * @cfg Определяет, будет ли закрываться окно при клике по оверлею.
     * @remark Актуально только при включенной опции {@link modal modal}
     * @default false
     * @see modal
     */
    closeOnOverlayClick?: boolean;
    /**
     * @cfg Определяет опции попапа в адаптивном режиме.
     * @remark Принимает в себя те же опции, что и попап в десктоп-режиме.
     */
    adaptiveOptions?: IAdaptiveOptions;

    /**
     * @typedef {Object} EventHandlers
     * @description Функции обратного вызова позволяют подписаться на события всплывающего окна.
     * @property {Function} onOpen Функция обратного вызова, которая вызывается при открытии всплывающего окна.
     * Пример декларативной подписки на событие доступен {@link /doc/platform/developmentapl/interface-development/controls/openers/#event-open-window здесь}.
     * @property {Function} onClose Функция обратного вызова, которая вызывается при закрытии всплывающего окна.
     * Пример декларативной подписки на событие доступен {@link /doc/platform/developmentapl/interface-development/controls/openers/#event-close-window здесь}.
     * @property {Function} onResult Функция обратного вызова, которая вызывается в событии sendResult в шаблоне всплывающего окна.
     * Пример декларативной подписки на событие доступен {@link /doc/platform/developmentapl/interface-development/controls/openers/#event-result здесь}.
     */

    /**
     * @cfg {EventHandlers} Функции обратного вызова на события окна.
     * @default {}
     * @remark
     * Необходимо учитывать контекст выполнения функций обратного вызова.
     * @example
     *
     * <pre class="brush: html; highlight: [5]">
     * <!-- userControl.wml -->
     * <Controls.popup:Stack name="stack">
     *    <ws:popupOptions template="Controls-demo/Popup/TestStack" modal="{{true}}" autofocus="{{false}}">
     *       <ws:templateOptions key="111"/>
     *       <ws:eventHandlers onResult="{{_onResultHandler}}" onClose="{{_onCloseHandler}}" />
     *    </ws:popupOptions>
     * </Controls.popup:Stack>
     *
     * <Controls.breadcrumbs:Path name="openStackButton" caption="open stack" on:click="_openStack()"/>
     * </pre>
     *
     * <pre class="brush: js; highlight: [21-23,25-27]">
     * // userControl.js
     * class MyControl extends Control<IControlOptions> {
     *    ...
     *
     *    constructor: function() {
     *       Control.superclass.constructor.apply(this, arguments);
     *       this._onResultHandler = this._onResultHandler.bind(this);
     *       this._onCloseHandler= this._onCloseHandler.bind(this);
     *    }
     *
     *    _openStack() {
     *       var popupOptions = {
     *          autofocus: true,
     *          templateOptions: {
     *             record: this._record
     *          }
     *       }
     *       this._children.stack.open(popupOptions)
     *    }
     *
     *    _onResultHandler(newData) {
     *       this._data = newData;
     *    }
     *
     *    _onCloseHandler() {
     *       this._sendData(this._data);
     *    }
     *    ...
     * };
     * </pre>
     *
     * <pre class="brush: html">
     * <!-- TestStack.wml -->
     * <Controls.breadcrumbs:Path name="sendDataButton" caption="sendData" on:click="_sendData()"/>
     * </pre>
     *
     * <pre class="brush: js">
     * // TestStack.js
     * class MyControl extends Control<IControlOptions>{
     *    ...
     *    _sendData() {
     *       var data = {
     *           record: this._record,
     *           isNewRecord: true
     *       }
     *
     *       // send data to userControl.js
     *       this._notify('sendResult', [data], {bubbling: true});
     *
     *       // close popup
     *       this._notify('close', [], {bubbling: true});
     *    }
     *    ...
     * }
     * </pre>
     */
    eventHandlers?: IEventHandlers;
    isDefaultOpener?: boolean;
    /**
     * @cfg Определяет, будет ли показываться индикатор при открытии окна
     * @default true
     */
    showIndicator?: boolean;
    /**
     * @cfg {Controls/LoadingIndicator/interface/ILoadingIndicator} Определяет конфигурацию индикатора загрузки, показываемого при открытии окна
     */
    indicatorConfig?: ILoadingIndicatorOptions;
    /**
     * @cfg {Array.<Controls/_popup/interface/IBasePopupOptions/DataLoader.typedef>} Задает массив предзагрузчиков данных, необходимых для построения {@link template шаблона}.
     * @deprecated Опция устарела. Воспользуйтесь {@link /doc/js/SabyPage/pageOpener/Opener опенером страницы в окне}.
     * Опция используется для ускорения открытия окна, за счет распараллеливания получения данных и построения верстки.
     * Полученные данные будут переданы в опцию <b>prefetchData</b>.
     * В рамках переходного этапа, для определения наличия предзагрузки данных используйте опцию <b>isPrefetchDataMode</b>. См. примеры.
     * @remark
     * **Обратите внимание: модуль загрузчика данных — синглтон.**
     * **Внимание. Функционал является экспериментальным и не должен использоваться повсеместно.**
     * **Перед использованием проконсультируйтесь с ответственным за функционал.**
     * @example
     *
     * Описание модуля предзагрузки:
     *
     * <pre class="brush: js">
     * // TypeScript
     * import {getStore} from 'Application/Env';
     * import {SbisService} from 'Types/source';
     *
     * const STORE_KEY = 'MyStoreKey';
     *
     * class MyLoader {
     *     init(): void {
     *         // Инициализация, если необходимо, вызывается перед вызовом loadData
     *     }
     *     getState(key) {
     *         return getStore(STORE_KEY).get(key);
     *     }
     *     setState(key, data) {
     *         getStore(STORE_KEY).set(key, data);
     *     }
     *
     *     // Возвращаем закэшированные данные, чтобы не запрашивать еще раз при построении на сервере.
     *     getReceivedData(params) {
     *         return this.getState(this._getKeyByParams(params));
     *     }
     *     _getKeyByParams(params) {
     *         // Нужно получить из параметров уникальное значение для данного набора параметров, чтобы закэшировать ответ.
     *     }
     *     loadData(params, depsData) {
     *         const paramFromDependency = depsData[0].getRow();
     *         return new SbisService({
     *             endpoint: myEndpoint
     *         }).call('myMethod', {
     *             key: params.param1,
     *             rec: paramFromDependency
     *         }).then((result) => {
     *             // Кэшируем результат
     *             this.setState(this._getKeyByParams(params), result);
     *         });
     *     }
     * }
     * // Загрузчик является синглтоном
     * export default new MyLoader();
     * </pre>
     *
     * Описание предзагрузчика при открытии окна:
     *
     * <pre class="brush: js">
     *   class UserControl extends Control {
     *      ...
     *      protected _stack: StackOpener = new StackOpener();
     *      _openStack() {
     *         const popupOptions = {
     *             template: 'MyPopupTemplate',
     *             dataLoaders: [
     *                 [{
     *                      key: 'loaderForDependencies',
     *                      module: 'MyLoaderForDeps'
     *                 }],
     *                 [{
     *                     key: 'myLoaderKey',
     *                     module: 'MyLoader',
     *                     dependencies: ['loaderForDependencies'],
     *                     params: {
     *                         param1: 'data1'
     *                     }
     *                 }]
     *             ],
     *             templateOptions: {
     *                 record: null
     *             }
     *         }
     *         this._stack.open(popupOptions)
     *      }
     *      ...
     *  }
     * </pre>
     *
     * Описание шаблона окна
     *
     * <pre class="brush: js">
     * // TypeScript
     * class MyPopupTemplate extends Control {
     *     ...
     *     _beforeMount(options) {
     *         if (!options.isPrefetchDataMode) {
     *             // Если данные не предзагружаются, значит контрол строится по старой схеме.
     *             // В этом случае в рамках совместимости этот контрол должен запросить данные самостоятельно.
     *             options.source.query({}).then(data => {
     *                 this._preloadData = data;
     *             }
     *         }
     *     }
     *     _beforeUpdate(newOptions) {
     *         if (newOptions.isPrefetchDataMode) {
     *             if (newOptions.prefetchData !== this._options.prefetchData) {
     *                 this._preloadData = newOptions.prefetchData['myLoaderKey'];
     *             }
     *         }
     *     }
     * }
     * </pre>
     * @demo Controls-demo/Popup/Loader/Index
     */
    dataLoaders?: IDataLoader[][];
    restrictiveContainer?: string;

    actionOnScroll?: string; // TODO Перенести на sticky, Удалить из baseOpener
    zIndex?: number; // TODO Compatible
    isCompoundTemplate?: boolean; // TODO Compatible
    _type?: string; // TODO Compatible
    isHelper?: boolean; // TODO удалить после перехода со статических методов на хелперы
    /**
     * Функция, позволяющая высчитать z-index окна вручную.
     * @name Controls/_popup/interface/IBasePopupOptions#zIndexCallback
     * @cfg {Function}
     * @remark
     * На вход принимает параметры:
     *
     * * currentItem — конфигурация текущего окна, для которого высчитывается z-index.
     * * popupList — Список с конфигурацией открытых на данный момент окон.
     *
     * Функция позволяет решить нетривиальные сценарии взаимодействия окон и не должна использоваться повсеместно.
     * Для большинства сценариев должно быть достаточно базового механизма простановки z-index.
     * @example
     * В этом примере открывается окно с подсказкой. Для этого окна z-index выставляется на 1 больше чем у родителя,
     * чтобы не конфликтовать с другими окнами.
     * <pre class="brush: html">
     * // MyTooltip.wml
     * <Controls.popup:Sticky zIndexCallback="_zIndexCallback" />
     * </pre>
     *
     * <pre class="brush: js">
     * // MyTooltip.js
     * class MyControl extends Control<IControlOptions>{
     *     ...
     *     _zIndexCallback(currentItem) {
     *         if (currentItem.parentZIndex) {
     *             return currentItem.parentZIndex + 1;
     *         }
     *     }
     *     ...
     * }
     * </pre>
     * @demo Controls-demo/Popup/Sticky/ZIndexCallback/Index
     */
    zIndexCallback?(
        item: IPopupItemInfo,
        popupList: List<IPopupItemInfo>,
        baseZIndex: number
    ): number;

    /**
     * @cfg {Boolean} Определяет, обновить ли z-index открытого попапа при повторном вызове open.
     * @remark
     * Опцию следует использовать в том случае, если вы хотите переоткрыть попап с новым документом, таким образом,
     * чтобы попап поднялся выше по z-index.
     * @default false
     */
    shouldUpdateZIndex?: boolean;

    /**
     * @cfg {Object} Определяет набор css переменных, полученных из контекста.
     * @see Control/themes:Consumer
     */
    themeVariables?: Record<string, unknown>;

    /**
     * @cfg {String} Определяет классы, полученные из контекста.
     * @see Control/themes:Consumer
     */
    themeClassName?: string;
}

type TAdaptiveViewMode = 'default' | 'sliding' | 'fullscreen';

/**
 * Интерфейс базовых опций окна в адаптивном режиме.
 * @interface Controls/_popup/interface/IAdaptiveOptions
 * @implements Controls/_popup/interface/IBasePopupOptions
 * @public
 */

interface IAdaptiveOptions extends IBasePopupOptions {
    /**
     * @cfg Определяет способ открытия панели в адаптиве.
     * @variant default поведение по умолчанию для конкретного опенера. Для Stack - fullscreen. Для остальных окон sliding.
     * @variant sliding открывает окно шторкой с возможностью закрыть свайпом корешка шаблона.
     * @variant fullscreen открывает окно на всю высоту экрана с возможностью закрыть по клику на крестик.
     */
    viewMode: TAdaptiveViewMode;
}

/*
 * @name Controls/_popup/interface/IBasePopupOptions#autofocus
 * @cfg {Boolean} Determines whether focus is set to the template when popup is opened.
 * @default true
 */

/*
 * @name Controls/_popup/interface/IBasePopupOptions#modal
 * @cfg {Boolean} Determines whether the window is modal.
 * @default false
 */

/*
 * @name Controls/_popup/interface/IBasePopupOptions#className
 * @cfg {String} Class names of popup.
 */

/*
 * @name Controls/_popup/interface/IBasePopupOptions#closeOnOutsideClick
 * @cfg {Boolean} Determines whether possibility of closing the popup when clicking past.
 * @default false
 */

/*
 * @name Controls/_popup/interface/IBasePopupOptions#template
 * @cfg {String|TemplateFunction} Template inside popup.
 */

/*
 * @name Controls/_popup/interface/IBasePopupOptions#templateOptions
 * @cfg {String|TemplateFunction} Template options inside popup.
 */

/*
 * @name Controls/_popup/interface/IBaseOpener#eventHandlers
 * @cfg {EventHandlers[]} Callback functions on popup events.
 * @variant onClose Callback function is called when popup is closed.
 * @default {}
 * @remark
 * You need to consider the context of callback functions execution. see examples.
 * @example
 * userControl.wml
 * <pre>
 *     <Controls.popup:Stack name="stack">
 *         <ws:popupOptions template="Controls-demo/Popup/TestStack" modal="{{true}}" autofocus="{{false}}">
 *            <ws:templateOptions key="111"/>
 *            <ws:eventHandlers onResult="{{_onResultHandler}}" onClose="{{_onCloseHandler}}" />
 *         </ws:popupOptions>
 *      </Controls.popup:Stack>
 *
 *      <Controls.breadcrumbs:Path name="openStackButton" caption="open stack" on:click="_openStack()"/>
 * </pre>
 * userControl.js
 * <pre>
 *   class MyControl extends Control<IControlOptions>{
 *      ...
 *      constructor: function() {
 *         Control.superclass.constructor.apply(this, arguments);
 *         this._onResultHandler = this._onResultHandler.bind(this);
 *         this._onCloseHandler= this._onCloseHandler.bind(this);
 *      }
 *
 *      _openStack() {
 *         var popupOptions = {
 *             autofocus: true,
 *             templateOptions: {
 *               record: this._record
 *             }
 *         }
 *         this._children.stack.open(popupOptions)
 *      }
 *
 *      _onResultHandler(newData) {
 *         this._data = newData;
 *      }
 *
 *      _onCloseHandler() {
 *         this._sendData(this._data);
 *      }
 *      ...
 *  };
 * </pre>
 * TestStack.wml
 * <pre>
 *     ...
 *     <Controls.breadcrumbs:Path name="sendDataButton" caption="sendData" on:click="_sendData()"/>
 *     ...
 * </pre>
 * TestStack.js
 * <pre>
 *     class MyControl extends Control<IControlOptions>{
 *         ...
 *
 *         _sendData() {
 *            var data = {
 *               record: this._record,
 *               isNewRecord: true
 *            }
 *
 *            // send data to userControl.js
 *            this._notify('sendResult', [data], {bubbling: true});
 *
 *            // close popup
 *            this._notify('close', [], {bubbling: true});
 *         }
 *         ...
 *     );
 * </pre>
 */

/**
 * @typedef {Object} Controls/_popup/interface/IBasePopupOptions/DataLoader
 * @description Описание загрузчика данных.
 * @property {String} module Имя модуля загрузчика, который реализует метод loadData.
 * @property {String} key Имя загрузчика. По умолчанию имя загрузчика берется из поля module.
 * @property {String[]} dependencies Массив ключей загрузчиков, от которых зависит данный.
 * Он будет вызван только после того, как отработают загрузчики из данного списка.
 * Их результаты придут в функцию загрузчика вторым аргументом.
 * Загрузчики из данного списка должны идти по порядку раньше текущего.
 * @property {Object} params Параметры, передающиеся в метод loadData.
 */
