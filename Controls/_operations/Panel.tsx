import { useState, useCallback, forwardRef, FunctionComponent, Component } from 'react';
import { IControlOptions } from 'UI/Base';
import { default as Async } from 'Controls/Container/Async';
import { error as LoadDataError } from 'Controls/dataSource';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls/interface';
import { TJsxProps } from 'UICore/Jsx';

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

export interface IOperationsPanelProps extends IControlOptions, TJsxProps {
    source?: Memory;
    items?: RecordSet;
    menuBackgroundStyle: string;
    closeButtonVisible?: boolean;
    menuIcon: string;
    keyProperty: string;
    selectedKeys: TKey[];
    iconSize: string;
    excludedKeys: TKey[];
    itemTemplate?: FunctionComponent | Component;
    operationsPanelOpenedCallback: () => void;
    selectionViewMode?: string;
    isAllSelected?: boolean;
    selectedKeysCount?: number | null;
    itemTemplateProperty?: string;
    parentProperty?: string;
    listParentProperty?: string;
    listMarkedKey?: TKey;
    root: TKey;
    fontColorStyle?: string;
    expanded?: boolean;
}
function OperationsPanel(
    props: IOperationsPanelProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const [hasPanel, setHasPanel] = useState(true);
    const errorCallback = useCallback((error: Error) => {
        setHasPanel(false);
        LoadDataError.process({ error });
    }, []);
    return hasPanel ? (
        <Async
            {...props.attrs}
            forwardedRef={ref}
            templateName={'Controls/operationsPanel:OperationsPanel'}
            errorCallback={errorCallback}
            templateOptions={props}
        />
    ) : null;
}

export default forwardRef(OperationsPanel);
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

/**
 * @name Controls/_operations/Panel#expandedChanged
 * @event Происходит при клике на крестик в панели
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.operations:Panel on:expandedChanged="_expandedChanged()" />
 * </pre>
 * <pre class="brush: js">
 * protected _expandedChanged(): void {
 *   this._operationsPanelExpanded = false;
 * }
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
