/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_actions/Container';
import ActionsCollection from './ActionsCollection';
import { IAction } from './IAction';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ILoadDataResult, NewSourceController as SourceController } from 'Controls/dataSource';
import { Object as EventObject } from 'Env/Event';
import { ISelectionObject, TKey, TKeySelection } from 'Controls/interface';
import MenuSource from './MenuSource';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { ControllerClass as FilterController } from 'Controls/filterOld';
import { isSliceWithSelection, ListSlice } from 'Controls/dataFactory';
import { executeAction, executeActionAsync } from 'Controls/_actions/callActionUtils';

export interface IContainerOptions extends IControlOptions {
    prefetchData: ILoadDataResult[];
    actions: IAction[];
    selectedKeys: TKeySelection;
    excludedKeys: TKeySelection;
    sourceController?: SourceController;
    filterController?: FilterController;
    operationsController?: OperationsController;
    isAdaptive?: boolean;
    slice?: ListSlice;
    changeShowTypeInAdaptive?: boolean;
}

const START_ORDER_NOT_DEFAULT_ACTIONS = 1000;
/**
 * Контейнер для работы с действиями
 * @private
 */
export default class ActionsContainer extends Control<IContainerOptions> {
    protected _template: TemplateFunction = template;
    protected _actionsCollection: ActionsCollection;
    protected _toolbarItems: RecordSet;
    protected _menuSource: MenuSource = null;
    private _sourceController: SourceController;
    private _operationsController: OperationsController = null;
    private _filterController: FilterController = null;

    constructor(cfg: IControlOptions, context?: object) {
        super(cfg, context);
        this._updateActions = this._updateActions.bind(this);
        this._actionsChanged = this._actionsChanged.bind(this);
        this._selectionChanged = this._selectionChanged.bind(this);
        this._filterChanged = this._filterChanged.bind(this);
    }

    protected _actionsChanged(e: SyntheticEvent, actions: IAction[]): void {
        this._actionsCollection.setActions(actions);
    }

    protected _beforeMount(options: IContainerOptions): void {
        this._subscribeControllersChanges(options);
        this._actionsCollection = new ActionsCollection({
            actions: this._prepareActionsOrder(options.actions),
            prefetch: options.prefetchData,
            filterController: this._filterController,
            operationsController: this._operationsController,
            sourceController: this._sourceController,
            isAdaptive: options.isAdaptive,
            changeShowTypeInAdaptive: options.changeShowTypeInAdaptive,
        });
        this._toolbarItems = this._getToolbarItems(this._actionsCollection.getToolbarItems());
        this._actionsCollection.subscribe('toolbarConfigChanged', (event, items) => {
            this._toolbarItems = this._getToolbarItems(items);
            this._menuSource = new MenuSource({
                collection: this._actionsCollection,
            });
        });
        this._menuSource = new MenuSource({
            collection: this._actionsCollection,
        });
    }

    protected _filterChanged(event: SyntheticEvent, filter: object): void {
        this._actionsCollection.filterChanged(filter);
    }

    protected _getToolbarItems(items: IAction[]): RecordSet {
        return new RecordSet({
            keyProperty: 'id',
            rawData: items,
        });
    }

    protected _prepareActionsOrder(actions: IAction[]): IAction[] {
        return actions.slice().map((action) => {
            if (!action.order) {
                return { ...action, order: START_ORDER_NOT_DEFAULT_ACTIONS };
            }

            return {
                ...action,
                order: action.order + START_ORDER_NOT_DEFAULT_ACTIONS,
            };
        });
    }

    protected _selectionChanged(e: SyntheticEvent, selection: ISelectionObject): void {
        this._actionsCollection.selectionChange(this._sourceController.getItems(), selection);
    }

    protected _beforeUpdate(options: IContainerOptions): void {
        this._unsubscribeFromControllers();
        this._subscribeControllersChanges(options);
        if (options.actions !== this._options.actions) {
            this._actionsCollection.update({
                actions: this._prepareActionsOrder(options.actions),
                prefetch: options.prefetchData,
                filterController: this._filterController,
                operationsController: this._operationsController,
                sourceController: this._sourceController,
                isAdaptive: options.isAdaptive,
                changeShowTypeInAdaptive: options.changeShowTypeInAdaptive,
            });
            this._toolbarItems = this._getToolbarItems(this._actionsCollection.getToolbarItems());
        } else if (this._options.prefetchData !== options.prefetchData) {
            this._actionsCollection.notifyActionsUpdateContext(options.prefetchData);
        }
    }

    protected _toolbarItemClick(
        event: SyntheticEvent,
        item: Model,
        clickEvent: SyntheticEvent,
        menuItems,
        root,
        toolbarMenuItemClick: boolean = false
    ): void {
        event.stopPropagation();
        return this._executeAction(item, clickEvent, [item.getKey()], toolbarMenuItemClick);
    }

    protected _executeAction(
        item: Model,
        clickEvent: SyntheticEvent,
        toolbarSelectedKeys: TKey[],
        toolbarMenuItemClick: boolean
    ): boolean {
        const action = this._actionsCollection.getExecuteAction(item);
        const params = {
            action,
            toolbarItem: item,
            clickEvent,
            toolbarSelectedKeys,
            opener: this,
            slice: this._options.slice,
            router: this._options.Router,
            storeId: this._options.storeId,
            toolbarMenuItemClick,
        };

        return isSliceWithSelection(this._options.slice)
            ? executeActionAsync(params)
            : executeAction(params);
    }

    private _subscribeControllersChanges(options: IContainerOptions): void {
        this._filterController = options.filterController;
        this._operationsController = options.operationsController;
        this._sourceController = options.sourceController;
        if (this._filterController) {
            this._filterController.subscribe('filterChanged', this._filterChanged);
        }
        if (this._sourceController) {
            this._sourceController.subscribe('itemsChanged', this._updateActions);
        }
        if (this._operationsController) {
            this._operationsController.subscribe('selectionChanged', this._selectionChanged);
            this._operationsController.subscribe('actionsChanged', this._actionsChanged);
        }
    }

    private _updateActions(event: EventObject, items: RecordSet): void {
        this._actionsCollection.collectionChange(items);
    }

    protected _applyClick(
        e: SyntheticEvent,
        selectedItems: Model[],
        nativeEvent: SyntheticEvent,
        menuItems: RecordSet,
        root: TKey
    ): void {
        e.stopImmediatePropagation();
        const toolbarKeys = selectedItems.map((item) => {
            return item.getKey();
        });
        const itemIndex = menuItems.getIndexByValue('parent', root);
        this._executeAction(menuItems.at(itemIndex), e, toolbarKeys);
    }

    protected _unsubscribeFromControllers(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe('itemsChanged', this._updateActions);
        }
        if (this._operationsController) {
            this._operationsController.unsubscribe('selectionChanged', this._selectionChanged);
            this._operationsController.unsubscribe('actionsChanged', this._actionsChanged);
        }
        if (this._filterController) {
            this._filterController.unsubscribe('filterChanged', this._filterChanged);
        }
    }

    protected _beforeUnmount(): void {
        this._unsubscribeFromControllers();
        this._actionsCollection.destroy();
    }

    static defaultProps: Partial<IContainerOptions> = {
        actions: [],
        changeShowTypeInAdaptive: true,
    };
}
