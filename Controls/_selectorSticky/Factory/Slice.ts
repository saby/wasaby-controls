import { factory as CollectionFactory, RecordSet } from 'Types/collection';
import {
    ListSlice,
    IListState,
    type IListLoadResult,
    type IListDataFactoryArguments,
} from 'Controls/dataFactory';
import { TKey, Direction } from 'Controls/interface';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';

interface ISelectorSliceState extends IListState {
    expanderButtonVisible: boolean;
    allowPin?: boolean;
    maxHistoryVisibleItems: number;
    expandedButton: boolean;
    allowAdaptive?: boolean;
    isRoot: boolean;
}

interface ISelectorDataFactoryArguments extends IListDataFactoryArguments {
    emptyKey: TKey | TKey[];
    allowPin?: boolean;
    historyRoot: TKey;
    maxHistoryVisibleItems: number;
    allowAdaptive?: boolean;
}

const DO_NOT_SAVE_TO_HISTORY_PROP = 'doNotSaveToHistory';

export default class SelectorSlice extends ListSlice<IListState> {
    private _emptyKey: ISelectorDataFactoryArguments['emptyKey'];
    private _historyRoot: ISelectorDataFactoryArguments['historyRoot'];
    private _items: ISelectorDataFactoryArguments['items'];
    state: ISelectorSliceState;

    toggleExpanded(): void {
        if (this.state.expandedButton) {
            super.setItems(this._getItemsCollapsed(this._items, this.state));
        } else {
            const items = this._items.clone(true);
            super.setItems(items);
        }
        this.setState({ expandedButton: !this.state.expandedButton });
    }

    protected _initState(
        loadResult: IListLoadResult,
        initConfig: ISelectorDataFactoryArguments
    ): ISelectorSliceState {
        this._emptyKey =
            initConfig.emptyKey instanceof Array ? initConfig.emptyKey : [initConfig.emptyKey];
        this._historyRoot = initConfig.historyRoot;
        this._items = loadResult.items?.clone(true);
        // TODO в триггерах перейти на expandedItems
        const expandedItems = initConfig.expandedItems
            ? initConfig.expandedItems
            : initConfig.openedSubMenuKey
            ? this._getExpandedItemsByOpenedKey(loadResult.items, initConfig)
            : [];

        const initState = super._initState(loadResult, initConfig);
        this._setBreadcrumbsPathIfNeed(initState, initState.items);
        const state: ISelectorSliceState = {
            ...initState,
            allowPin: initConfig.allowPin,
            maxHistoryVisibleItems: initConfig.maxHistoryVisibleItems,
            expanderButtonVisible: false,
            expandedButton: false,
            expandedItems,
            allowAdaptive: initConfig.allowAdaptive,
            isRoot: this._getIsRoot(initState),
        };
        this._setExpanderButtonState(state.items, state);
        return state;
    }

    protected async _beforeApplyState(nextStateProp: ISelectorSliceState): Promise<IListState> {
        const currentSelectedEmptyKey = this._emptyKey.find((emptyKey) =>
            this.state.selectedKeys.includes(emptyKey)
        );
        const nextSelectedEmptyKey = this._emptyKey.find((emptyKey) =>
            nextStateProp.selectedKeys.includes(emptyKey)
        );

        if (nextSelectedEmptyKey) {
            nextStateProp.markedKey = nextSelectedEmptyKey;
        } else if (currentSelectedEmptyKey && !nextSelectedEmptyKey) {
            nextStateProp.markedKey = undefined;
        }
        if (nextStateProp.root) {
            nextStateProp.expanderButtonVisible = false;
        }
        if (nextStateProp.root !== this.state.root && nextStateProp.parentProperty) {
            nextStateProp.searchValue = '';

            this._setBreadcrumbsPathIfNeed(nextStateProp);
            nextStateProp.isRoot = this._getIsRoot(nextStateProp);
        }
        if (nextStateProp.searchValue) {
            nextStateProp.expandedItems = [null];
        } else if (!nextStateProp.searchValue && this.state.searchValue) {
            nextStateProp.expandedItems = [];
        }
        return super._beforeApplyState(nextStateProp);
    }

    setItems(items: RecordSet, root?: TKey) {
        this._items = items.clone(true);
        if (!this.state.root) {
            this._setExpanderButtonState(items, this.state);
        }
        if (
            this.state.breadCrumbsItems?.length &&
            items.getMetaData() !== this.state.items?.getMetaData()
        ) {
            this._setBreadcrumbsPathIfNeed(this.state, items);
        }
        super.setItems(items, root);
    }

    protected _nodeDataLoaded(
        items: RecordSet,
        key: TKey,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        const newItems = loadSync('Controls/Utils/History/PrepareMenuItems:getItemsWithHistory')?.(
            nextState.items,
            nextState.historyId,
            nextState.source,
            this._getHistoryConfig(nextState)
        );
        this._setExpanderButtonState(newItems, nextState, false);
        nextState.items.assign(newItems);
        return super._nodeDataLoaded(items, key, direction, nextState);
    }

    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: ISelectorSliceState
    ): Partial<ISelectorSliceState> | Promise<Partial<IListState>> {
        if (nextState.root) {
            this._setBreadcrumbsPathIfNeed(nextState, items);
        }
        if (nextState.historyId) {
            return Promise.resolve(
                loadAsync('Controls/Utils/History/PrepareMenuItems').then(
                    ({ getItemsWithHistory }) => {
                        return getItemsWithHistory(
                            items,
                            nextState.historyId,
                            nextState.source,
                            this._getHistoryConfig(nextState)
                        );
                    }
                )
            ).then((newItems) => {
                this._setExpanderButtonState(newItems, nextState, false);
                items.assign(newItems);
                return nextState;
            });
        } else {
            return super._dataLoaded(items, direction, nextState);
        }
    }

    private _setBreadcrumbsPathIfNeed(state: ISelectorSliceState, items = state.items) {
        if (state.parentProperty) {
            // Для случаев, когда метод бл не поддерживает работу с иерархией формируем крошки сами, например, меню регламентов
            const path = items.getMetaData()?.path;
            let hasRootInBreadCrumbs = false;
            path?.forEach((breadCrumbsItem: Model) => {
                if (breadCrumbsItem.getKey() === state.root) {
                    hasRootInBreadCrumbs = true;
                }
            });
            const backButtonItems = [];
            if (
                (!state.root && (path?.getCount?.() || path?.length)) ||
                (!hasRootInBreadCrumbs && state.root)
            ) {
                let parentItem = items?.getRecordById(state.root as string);
                while (parentItem) {
                    backButtonItems.unshift(parentItem);
                    parentItem = items?.getRecordById(parentItem.get(state.parentProperty));
                }
                const pathRecordSet = new RecordSet({
                    adapter: items.getAdapter(),
                    keyProperty: items.getKeyProperty(),
                    model: items.getModel(),
                });
                if (backButtonItems) {
                    pathRecordSet.append(backButtonItems);
                }
                items.setMetaData({
                    ...items.getMetaData(),
                    path: pathRecordSet,
                });
                state.breadCrumbsItems = backButtonItems.length ? backButtonItems : null;
                state.backButtonCaption = backButtonItems.length
                    ? backButtonItems[0].get(state.displayProperty || 'title')
                    : '';
                items.assign(items);
            }
        }
    }

    private _getExpandedItemsByOpenedKey(
        items: RecordSet,
        config: ISelectorDataFactoryArguments
    ): TKey[] {
        const expandedItems: TKey[] = [];
        if (config.parentProperty && items) {
            let key = config.openedSubMenuKey;
            while (key !== config.root && key) {
                expandedItems.push(key);
                const item = items.getRecordById(key);
                key = item?.get(config.parentProperty);
            }
        }
        return expandedItems;
    }

    private _getIsRoot({ breadCrumbsItems, root, parentProperty }: ISelectorSliceState) {
        let rootKey = root;
        if (breadCrumbsItems?.length && parentProperty) {
            rootKey = breadCrumbsItems[0].get(parentProperty);
        }
        return root === rootKey;
    }

    private _setExpanderButtonState(
        items: RecordSet,
        state: ISelectorSliceState,
        needUpdateState: boolean = true
    ) {
        if (!state.allowAdaptive) {
            const expanderButtonVisible = this._getExpanderButtonVisible(items, state);
            if (expanderButtonVisible && !state.expandedButton) {
                items.assign(this._getItemsCollapsed(items, state));
            }
            if (needUpdateState !== false) {
                state.items = items;
            }
            state.expanderButtonVisible = expanderButtonVisible;
        }
    }

    private _getExpanderButtonVisible(items: RecordSet, state: ISelectorSliceState): boolean {
        if (!state.searchValue && state.allowPin && !state.root) {
            const currentRootItemsCount =
                this._getCurrentRootItemsIndices(items, state)?.length || items.getCount();
            return currentRootItemsCount > state.maxHistoryVisibleItems + 1;
        }
        return false;
    }

    private _getItemsCollapsed(
        items: RecordSet,
        config: {
            parentProperty?: ISelectorSliceState['parentProperty'];
            root: ISelectorSliceState['root'];
            maxHistoryVisibleItems: ISelectorSliceState['maxHistoryVisibleItems'];
            expandedItems: ISelectorSliceState['expandedItems'];
            historyId?: ISelectorSliceState['historyId'];
        }
    ): RecordSet {
        const currentRootItemsIndices = this._getCurrentRootItemsIndices(items, config);
        currentRootItemsIndices?.splice(config.maxHistoryVisibleItems);
        const fixedIndices = items.getIndicesByValue(DO_NOT_SAVE_TO_HISTORY_PROP, true);
        return factory(items)
            .filter((item, index) => {
                const parent = config.historyId
                    ? '' + item.get(config.parentProperty as string)
                    : item.get(config.parentProperty as string);
                return (
                    fixedIndices.includes(index) ||
                    !currentRootItemsIndices ||
                    currentRootItemsIndices.includes(index) ||
                    (config.expandedItems &&
                        config.parentProperty &&
                        config.expandedItems?.includes(parent))
                );
            })
            .value(CollectionFactory.recordSet, {
                adapter: items.getAdapter(),
                keyProperty: items.getKeyProperty(),
                format: items.getFormat(),
                model: items.getModel(),
            });
    }

    private _getCurrentRootItemsIndices(
        items: RecordSet,
        {
            parentProperty,
            root,
        }: {
            parentProperty?: ISelectorSliceState['parentProperty'];
            root: ISelectorSliceState['root'];
        }
    ): number[] | void {
        if (parentProperty) {
            return items.getIndicesByValue(parentProperty, root);
        }
    }

    private _getHistoryConfig(nextState: IListState) {
        return {
            parentProperty: nextState.parentProperty,
            nodeProperty: nextState.nodeProperty,
            keyProperty: nextState.source?.getOriginal
                ? nextState.source?.getOriginal()?.getKeyProperty()
                : nextState.source?.getKeyProperty(),
            root: this._historyRoot,
            unpinIfNotExist: false,
        };
    }
}
