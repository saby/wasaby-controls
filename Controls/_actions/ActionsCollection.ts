/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Model, ObservableMixin } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { mixin } from 'Types/util';
import { IBaseAction } from './BaseAction';
import { IAction } from './IAction';
import { ISelectionObject, TKey } from 'Controls/interface';
import { isEqual } from 'Types/object';
import { showType } from 'Controls/toolbars';
import { Logger } from 'UI/Utils';
import { ILoadDataResult } from 'Controls/dataSource';
import { Query } from 'Types/source';

/**
 * @public
 */
interface IPrefetchResult {
    key: string | number;
    prefetchResult: ILoadDataResult;
}

const MIN_ACTIONS_FOR_MENU = 6;

interface IActionsCollectionOptions {
    actions: IAction[];
    prefetch: Record<string, IPrefetchResult>;
    isAdaptive?: boolean;
}

const BASE_ACTION_MODULE = 'Controls/actions:BaseAction';

export default class ActionsCollection extends mixin<ObservableMixin>(
    ObservableMixin
) {
    protected _actions: IBaseAction[];
    protected _toolbarItems: IAction[] = [];
    protected _options: IActionsCollectionOptions;
    protected _childItems: Record<string | number, RecordSet> = {};

    constructor(options: IActionsCollectionOptions) {
        super();
        ObservableMixin.call(this, options);
        this._options = options;
        this._initActionsAndUpdateConfig();
    }

    filterChanged(filter: object): void {
        this._callChangeAction('filterChanged', [filter]);
    }

    private _initActions(options: IActionsCollectionOptions): void {
        this._childItems = {};
        this._actions = this._createActions(options.actions);
    }

    update(options: IActionsCollectionOptions): void {
        if (this._options.actions !== options.actions) {
            this._options = options;
            this._destroyCurrentActions();
            this._initActionsAndUpdateConfig();
        }
    }

    private _notifyConfigChanged(): void {
        this._notify('toolbarConfigChanged', this.getToolbarItems());
    }

    getAction(item: Model<IAction>): IBaseAction {
        return this.getActionById(item.getKey());
    }

    notifyActionsUpdateContext(newContext): void {
        this._actions.forEach((action) => {
            action.updateContext(newContext);
        });
    }

    getExecuteAction(item: Model<IAction>): IBaseAction {
        const itemByLoadedItems = this.getActionByItem(item);
        if (itemByLoadedItems) {
            return itemByLoadedItems;
        } else {
            const RS = item.getOwner();
            let root = item.get('parent');
            let action = this.getActionById(root);
            let parent = RS.getRecordById(root);
            while (!action && parent) {
                parent = RS.getRecordById(root);
                if (parent) {
                    root = parent.get('parent');
                    action = this.getActionById(root);
                }
            }
            return action;
        }
    }

    getActionByItem(item: Model<IAction>): IBaseAction {
        const action = this.getActionById(item.getKey());
        if (action) {
            return action;
        } else {
            const parentKey = item.get('parent');
            const parentRS = Object.values(this._childItems).find((childs) => {
                return childs.getRecordById(parentKey);
            });
            const parentItem = parentRS?.getRecordById(parentKey);
            if (!parentItem) {
                return this.getActionById(parentKey);
            } else {
                return this.getActionByItem(parentItem);
            }
        }
    }

    getActionByParentItemKey(parentKey: TKey) {
        const action = this.getActionById(parentKey);
        if (action) {
            return action;
        } else {
            const parentRS = Object.values(this._childItems).find((childs) => {
                return childs.getRecordById(parentKey);
            });
            const parentItem = parentRS?.getRecordById(parentKey);
            if (!parentItem) {
                return this.getActionById(parentKey);
            } else {
                return this.getActionByItem(parentItem);
            }
        }
    }

    addChildItems(id: string, items: RecordSet): void {
        this._childItems[id] = items;
    }

    getActionById(id: unknown): IBaseAction {
        return this._actions.find((action) => {
            return action.id === id;
        });
    }

    collectionChange(items: RecordSet, selection: ISelectionObject): void {
        this._callChangeAction('onCollectionChanged', [items, selection]);
    }

    selectionChange(items: RecordSet, selection: ISelectionObject): void {
        this._callChangeAction('onSelectionChanged', [items, selection]);
    }

    private _callChangeAction(
        methodName: string,
        changedArgs: unknown[]
    ): void {
        this._actions.forEach((action) => {
            if (action[methodName]) {
                action[methodName].apply(action, changedArgs);
            }
        });
    }

    private _isAllActionsFrequent(rootItems: IAction[]): boolean {
        return rootItems.every((item) => {
            return item.showType !== showType.MENU;
        });
    }

    getToolbarItems(): IAction[] {
        const visibleItems = this._toolbarItems.filter((toolbarItem) => {
            return toolbarItem.visible;
        });
        const rootItems = visibleItems.filter((item) => {
            return item.parent === null;
        });
        if (this._options.isAdaptive) {
            return visibleItems.map((visibleItem) => {
                visibleItem.showType = showType.MENU;
                return visibleItem;
            });
        } else if (
            rootItems.length <= MIN_ACTIONS_FOR_MENU ||
            this._isAllActionsFrequent(rootItems)
        ) {
            return visibleItems.map((visibleItem) => {
                visibleItem.showType = showType.TOOLBAR;
                return visibleItem;
            });
        }
        return visibleItems;
    }

    getMenuItems(): IAction[] {
        return this.getToolbarItems();
    }

    getChildren(parent: TKey, query: Query): Promise<RecordSet> {
        const staticChildren = this._getStaticChildren(parent);
        if (staticChildren.length) {
            return Promise.resolve(
                new RecordSet({
                    keyProperty: 'id',
                    rawData: staticChildren,
                })
            );
        } else {
            const action = this.getActionByParentItemKey(parent);
            return Promise.resolve(action.getChildren(parent, query));
        }
    }

    protected _getToolbarItemsByActions(actions: IBaseAction[]): IAction[] {
        return actions
            .map((action) => {
                return action.getState();
            })
            .sort((operationFirst, operationSecond) => {
                return operationFirst.order - operationSecond.order;
            });
    }

    protected _getStaticChildren(parent: TKey): IAction[] {
        const items = this.getMenuItems();
        const childItems = items.filter((item) => {
            return item.parent === parent;
        });
        if (childItems.length) {
            let childNextLevel = [];
            // Рекурсивно вызываем эту функцию для всех дочерних элементов
            childItems.forEach((item) => {
                const nextChildren = this._getStaticChildren(items, item.id);
                if (nextChildren.length) {
                    childNextLevel = childNextLevel.concat(nextChildren);
                }
            });
            return childItems.concat(childNextLevel);
        }
        return childItems;
    }

    private _updateToolbarItems(): void {
        this._toolbarItems = this._getToolbarItemsByActions(this._actions);
    }

    private _itemChanged(): void {
        this._updateToolbarItems();
        this._notifyConfigChanged();
    }

    setActions(actions: IAction[]): void {
        if (!isEqual(actions, this._options.actions)) {
            this._options.actions = actions;
            this._initActionsAndUpdateConfig();
        }
    }

    destroy(): void {
        this._destroyCurrentActions();
    }

    private _destroyCurrentActions(): void {
        if (this._actions) {
            this._actions.forEach((action) => {
                action.destroy();
            });
        }
    }

    private _initActionsAndUpdateConfig(
        options: IActionsCollectionOptions = this._options
    ): void {
        this._initActions(options);
        this._updateToolbarItems();
        this._notifyConfigChanged();
    }

    private _createAction(actionOptions: IAction): IBaseAction {
        const actionName = actionOptions.actionName || BASE_ACTION_MODULE;
        if (!isLoaded(actionName)) {
            Logger.error(`ActionsCollection::Во время создания коллекции произошла ошибка.
                                   Action ${actionName} не был загружен до создания коллекции`);
        } else {
            const action = loadSync(actionName);
            const actionClass = new action({
                ...actionOptions,
                filterController: this._options.filterController,
                operationsController: this._options.operationsController,
                context: this._options.prefetch,
                sourceController: this._options.sourceController,
                prefetchResult:
                    this._options.prefetch?.[actionOptions.prefetchResultId],
            });
            actionClass.subscribe('itemChanged', this._itemChanged.bind(this));
            return actionClass;
        }
    }

    private _createActions(actions: IAction[]): IBaseAction[] {
        return actions.map((action) => {
            return this._createAction(action);
        });
    }
}
