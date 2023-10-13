import {IEventHandlers} from 'Controls/_popup/interface/IPopup';

export interface IEventHandlersOptions {
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
}
