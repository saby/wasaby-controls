import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_operationsPanel/Panel/Panel';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { CrudEntityKey } from 'Types/source';
import { SyntheticEvent } from 'UI/Events';
import { IBrowserSlice } from 'Controls/dataFactory';
import { IActionOptions, IExecuteOptions } from 'Controls/actions';
import { ISelectionObject } from 'Controls/interface';
import { object } from 'Types/util';
import { Logger } from 'UI/Utils';

interface IOperationsPanelWidgetOptions extends IControlOptions {
    operationsController: OperationsController;
    actions: IActionOptions[];
    storeId?: string;
    slice: IBrowserSlice;
}

interface ICounterConfig {
    count: number;
    isAllSelected: boolean;
}

/**
 * Виджет "Панели действий". Реализует UI для организации преобразования данных для нескольких элементов списка.
 * В основе виджета лежит интерфейсный контрол {@link Controls/operations:Panel панель массовых операций}
 *
 * @class Controls-ListEnv/operationsPanel:View
 * @extends Controls-ListEnv/toolbar:Container
 * @mixes Controls/operations:Panel
 * @mixes Controls/interface:IStoreId
 *
 * @public
 *
 * @demo Engine-demo/Controls-widgets/OperationsPanel/Index
 */
export default class OperationsWidget extends Control<IOperationsPanelWidgetOptions> {
    protected _template: TemplateFunction = template;
    protected _operationsController: OperationsController;
    protected _selectedKeys: CrudEntityKey[];
    protected _excludedKeys: CrudEntityKey[];
    protected _counterConfig: ICounterConfig;
    protected _panelExpanded: boolean = false;
    protected _actions: IActionOptions[];
    protected _compatibleMode: boolean = false;

    constructor(options: IOperationsPanelWidgetOptions) {
        super(options);
        this._selectionChanged = this._selectionChanged.bind(this);
        this._counterChanged = this._counterChanged.bind(this);
        this._expandedChanged = this._expandedChanged.bind(this);
        this._listActionsChanged = this._listActionsChanged.bind(this);
        this._operationsPanelOpened = this._operationsPanelOpened.bind(this);
        this._operationsPanelClose = this._operationsPanelClose.bind(this);
        this._listCommandCompatibleExecute = this._listCommandCompatibleExecute.bind(this);

        if (!options.storeId || (options.storeId && options.slice['[ICompatibleSlice]'])) {
            this._compatibleMode = true;
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }

    protected _getActions(actions: IActionOptions[]): IActionOptions[] {
        const resultActions = object.clone(actions);
        return resultActions.map((action) => {
            if (!action.actionName || !action.onExecuteHandler) {
                action.onExecuteHandler = this._listCommandCompatibleExecute;
            }
            action.iconSize = 's';
            return action;
        });
    }

    protected _selectionChanged(e: SyntheticEvent, selection: ISelectionObject): void {
        this._selectedKeys = selection.selected;
        this._excludedKeys = selection.excluded;
        if (
            this._selectedKeys.length > 0 &&
            !this._operationsController.getOperationsPanelVisible()
        ) {
            this._options.slice.openOperationsPanel();
        }
    }

    protected _listActionsChanged(e: SyntheticEvent, actions: IActionOptions[]): void {
        this._actions = this._getActions(actions);
    }

    protected _counterChanged(e: SyntheticEvent, counter: ICounterConfig): void {
        this._counterConfig = counter;
    }

    protected _operationsPanelOpened(): void {
        this._operationsController.setOperationsPanelVisible(true);
        if (!this._options.slice.operationsPanelVisible) {
            this._options.slice.openOperationsPanel();
        }
    }

    protected _operationsPanelClose(): void {
        this._operationsController.setOperationsPanelVisible(false);
        if (this._options.slice.operationsPanelVisible) {
            this._options.slice.closeOperationsPanel();
        }
    }

    protected _listCommandCompatibleExecute(options: IExecuteOptions): void {
        this._notify('actionClick', [options.toolbarItem, options.target, options.selection]);
    }

    protected _beforeMount(options?: IOperationsPanelWidgetOptions): void {
        this._operationsController = options.operationsController;
        this._panelExpanded =
            this._operationsController.getOperationsPanelVisible() ||
            options.slice.operationsPanelVisible;
        this._actions = this._getActions(
            options.slice.listActions ||
                this._operationsController.getListActions() ||
                options.actions
        );
        this._counterConfig = this._operationsController.getCounterConfig();
        if (this._operationsController) {
            this._subscribeToOperationsControllerEvents(this._operationsController);
        }
        const { selected, excluded } = options.operationsController.getSelection();
        this._selectedKeys = selected;
        this._excludedKeys = excluded;
    }

    protected _beforeUpdate(options: IOperationsPanelWidgetOptions): void {
        if (
            options.slice.listActions !== this._options.slice.listActions ||
            this._options.actions !== options.actions
        ) {
            this._actions = this._getActions(
                this._operationsController.getListActions() || options.actions
            );
        }
        if (options.slice !== this._options.slice) {
            this._unsubscribeFromOperationsControllerEvents(this._operationsController);
            this._operationsController = options.operationsController;
            this._subscribeToOperationsControllerEvents(this._operationsController);
            this._counterConfig = this._operationsController.getCounterConfig();
        }
        if (options.actions !== this._options.actions) {
            this._actions = this._getActions(
                options.slice.listActions ||
                    this._operationsController.getListActions() ||
                    options.actions
            );
        }
        this._panelExpanded =
            this._operationsController.getOperationsPanelVisible() ||
            options.slice.operationsPanelVisible;
    }

    protected _selectedTypeChanged(e: SyntheticEvent, selectedType: string): void {
        e.stopImmediatePropagation();
        if (this._operationsController) {
            this._operationsController.selectionTypeChanged(
                selectedType,
                null,
                this._options.storeId
            );
        }
        if (selectedType !== 'all' && selectedType !== 'selected') {
            this._options.slice.executeCommand(selectedType);
        }
    }

    protected _expandedChanged(e: SyntheticEvent, expanded: boolean): void {
        if (expanded !== this._operationsController.getOperationsPanelVisible()) {
            this._operationsController.setOperationsPanelVisible(expanded);
        }
        if (expanded) {
            this._options.slice.openOperationsPanel();
        } else {
            this._options.slice.closeOperationsPanel();
        }
        this._panelExpanded = expanded;
    }

    protected _subscribeToOperationsControllerEvents(controller: OperationsController): void {
        controller.subscribe('selectionChanged', this._selectionChanged);
        controller.subscribe('counterChanged', this._counterChanged);
        controller.subscribe('operationsPanelVisibleChanged', this._expandedChanged);
        controller.subscribe('operationsPanelOpened', this._operationsPanelOpened);
        controller.subscribe('operationsPanelClose', this._operationsPanelClose);
        controller.subscribe('listActionsChanged', this._listActionsChanged);
    }

    protected _unsubscribeFromOperationsControllerEvents(controller: OperationsController): void {
        controller.unsubscribe('selectionChanged', this._selectionChanged);
        controller.unsubscribe('counterChanged', this._counterChanged);
        controller.unsubscribe('operationsPanelVisibleChanged', this._expandedChanged);
        controller.unsubscribe('operationsPanelOpened', this._operationsPanelOpened);
        controller.unsubscribe('operationsPanelClose', this._operationsPanelClose);
        controller.unsubscribe('listActionsChanged', this._listActionsChanged);
    }

    protected _beforeUnmount(): void {
        this._unsubscribeFromOperationsControllerEvents(this._operationsController);
    }
}
