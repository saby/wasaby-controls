/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_operations/Panel/Panel';
import { error as loadDataError } from 'Controls/dataSource';

/**
 * Контрол, предназначенный для операций над множеством записей списка.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/actions/operations/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_operations.less переменные тем оформления}
 *
 * @class Controls/_operations/Panel
 * @extends UI/Base:Control
 * @mixes Controls/toolbars:IToolbarSource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface:IHierarchy
 * @implements Controls/_interface/ISelectionCountModeOptions
 *
 * @public
 * @demo Controls-demo/OperationsPanelNew/Base/Index
 * @demo Controls-demo/OperationsPanelNew/PanelWithList/Default/Index
 */

export default class Panel extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _hidePanel: boolean = false;

    _beforeMount(): void {
        this._errorCallback = this._errorCallback.bind(this);
    }

    _errorCallback(viewConfig: object, error): void {
        this._hidePanel = true;
        loadDataError.process({ error });
    }
}

/**
 * @name Controls/_operations/Panel#rightTemplate
 * @cfg {String|TemplateFunction} Шаблон, отображаемый в правой части панели массового выбора.
 * @demo Controls-demo/OperationsPanelNew/RightTemplate/Index
 * @example
 * <pre class="brush: html">
 * <Controls.operations:Panel>
 *     <ws:rightTemplate>
 *         <Controls.buttons:Button
 *             caption="Доп. операции"
 *             on:click="_onClickAddBlock()"
 *             iconSize="s"
 *             icon="icon-Settings"
 *             viewMode="link"
 *             fontColorStyle="link"
 *     </ws:rightTemplate>
 * </Controls.operations:Panel>
 * </pre>
 */

/*
 * @name Controls/_operations/Panel#rightTemplate
 * @cfg {Function} Template displayed on the right side of the panel.
 * @example
 * <pre>
 * <!-- WML -->
 *    <Controls.operations:Panel rightTemplate="wml!MyModule/OperationsPanelRightTemplate" />
 * </pre>
 */

/**
 * @name Controls/_operations/Panel#popupFooterTemplate
 * @cfg {String|TemplateFunction} Шаблон футера дополнительного меню тулбара.
 * @demo Controls-demo/OperationsPanelNew/PopupFooterTemplate/Index
 */

/**
 * @name Controls/_operations/Panel#operationsPanelOpened
 * @event Происходит после появления панели массовых операций на экране.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 */

/**
 * @name Controls/_operations/Panel#itemClick
 * @event Происходит при клике на элемент.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому произвели клик.
 * @param {Object} nativeEvent Объект нативного события браузера
 * @param {Controls/interface:ISelectionObject} selection Объект, который содержит идентификаторы отмеченных и исключённых записей.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.operations:Panel on:itemClick="onPanelItemClick()" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * onPanelItemClick: function(e, item) {
 *    var itemId = item.get('id');
 *    switch (itemId) {
 *       case 'remove':
 *          this._removeItems();
 *          break;
 *       case 'move':
 *          this._moveItems();
 *          break;
 *    }
 * }
 * </pre>
 */

/*
 * @event Occurs when an item was clicked.
 * @name Controls/_operations/Panel#itemClick
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Record} item Clicked item.
 * @param {Event} originalEvent Descriptor of the original event.
 * @example
 * TMPL:
 * <pre>
 *    <Controls.operations:Panel on:itemClick="onPanelItemClick()" />
 * </pre>
 * JS:
 * <pre>
 *    onPanelItemClick: function(e, item) {
 *       var itemId = item.get('id');
 *       switch (itemId) {
 *          case 'remove':
 *             this._removeItems();
 *             break;
 *          case 'move':
 *             this._moveItems();
 *             break;
 *    }
 * </pre>
 */

/**
 * @typedef {String} SelectionViewMode
 * @variant null Кпопка скрыта.
 * @variant all Кнопка "Показать отмеченные".
 * @variant selected Кнопка "Показать все".
 * @variant partial Кнопка с возможностью выбора количества отмечаемых записей.
 */

/**
 * @name Controls/_operations/Panel#selectionViewMode
 * @cfg {SelectionViewMode} Задает отображение кнопки "Показать отмеченные" в меню мультивыбора.
 * @demo Controls-demo/OperationsPanelNew/SelectionViewMode/Index
 * @default null
 * @remark Вызываемый списочный метод нужно перевести на использование функции ShowMarked, о которой подробнее можно прочитать {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/list-iterator/show-marked/ здесь}.
 * @example
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions> {
 *    _selectionViewMode: 'all',
 *    ...
 * }
 * </pre>
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.operationsPanel:OperationsPanel bind:selectionViewMode="_selectionViewMode"/>
 * </pre>
 */

/**
 * @typedef {Object} ISelectedCountConfig
 * @property {Types/_source/IRpc} rpc источник данных, поддерживающий RPC
 * @property {String} command Имя вызываемого метода
 * @property {Object} data Параметры вызываемого метода
 */

/**
 * @name Controls/_operations/Panel#selectedCountConfig
 * @cfg {ISelectedCountConfig} Конфигурация для получения счётчика отмеченных записей.
 * Для подсчёта счётчика будет вызван метод, указанный в поле command.
 * В метод будут переданы параметры из поля data, а так же filter c полем selection.
 * Если в data передан filter, то в filter будет добавлено поле selection.
 * В качестве результата работы метода ожидается Record c полем count, в котором должен лежать счётчик в виде числа.
 * @demo Controls-demo/operations/SelectedCountConfig/Index
 * @default undefined
 * @example
 * <pre class="brush: html">
 * // TypeScript
 * import {SbisService} from 'Types/source';
 *
 * private _filter: object = null;
 * private _selectedCountConfig: object = null;
 *
 * _beforeMount():void {
 *    this._filter = {};
 *    this._selectedCountConfig = this._getSelectedCountConfig();
 * }
 *
 * private _getSelectedCountConfig() {
 *    return {
 *       rpc: new SbisService({
 *          endpoint: 'Employee'
 *       }),
 *       command: 'employeeCount',
 *       data: {
 *          filter: this._filter
 *       }
 *    }
 * }
 * </pre>
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.operations:Panel selectedCountConfig="{{_selectedCountConfig}}"/>
 * </pre>
 */

/**
 * @name Controls/_operations/Panel#contrastBackground
 * @cfg {Boolean} Определяет контрастность контрола по отношению к его окружению.
 * @demo Controls-demo/OperationsPanelNew/PanelWithList/ContrastBackground/Index
 * @default false
 */
