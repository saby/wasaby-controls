/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ListSlice } from 'Controls/dataFactory';
import { RegisterClass } from 'Controls/event';
import type { IMarkerListOptions } from 'Controls/marker';
import * as React from 'react';
import {
    IExpandedItemsOptions,
    IFilterOptions,
    IGroupingOptions,
    IHierarchyOptions,
    IHierarchySearchOptions,
    INavigation,
    IPromiseSelectableOptions,
    ISearchOptions,
    ISelectFieldsOptions,
    ISelectionCountModeOptions,
    ISelectionTypeOptions,
    ISortingOptions,
    ISourceOptions,
    TKey,
    TSortingOptionValue,
} from 'Controls/interface';
import { error, NewSourceController as SourceController } from 'Controls/dataSource';
import type { IColumn, IHeaderCell } from 'Controls/grid';
import type { TExplorerViewMode } from 'Controls/explorer';
import { Logger } from 'UI/Utils';
import { useSlice } from 'Controls-DataEnv/context';
import { Control } from 'UI/Base';
import { withWasabyEventObject } from 'UI/Events';
import { INewListSchemeHandlers } from './INewListScheme';
import { useHandlers } from './useListContainerConnectedNewApi';
import { process } from 'Controls/error';

export interface IViewOptions
    extends ISortingOptions,
        IPromiseSelectableOptions,
        IHierarchyOptions,
        ISourceOptions,
        IFilterOptions,
        IExpandedItemsOptions,
        ISelectionTypeOptions,
        ISearchOptions,
        IHierarchySearchOptions,
        ISelectFieldsOptions,
        IMarkerListOptions,
        ISelectionCountModeOptions,
        IGroupingOptions {
    sourceController: SourceController;
    root: TKey;
    breadCrumbsItems: Model[];
    loading: boolean;
    items: RecordSet;
    columns?: IColumn[];
    header?: IHeaderCell[];
    viewMode?: TExplorerViewMode;
    multiSelectVisibility?: string;
    backButtonCaption?: string;
    displayProperty?: string;
    navigation?: INavigation;
    expanderVisibility?: 'hasChildren' | 'visible';
    hasChildrenProperty: string;
    deepReload?: boolean;
    singleExpand?: boolean;
    nodeTypeProperty?: string;
}

export interface IListContainerOptions {
    storeId: string;
    children: React.ReactElement<IViewOptions>;
    preloadRoot?: boolean;
    ignoreOptionsValidate?: boolean;
    changeRootByItemClick?: boolean;
}

type TViewOptions = keyof IViewOptions;

const VIEW_OPTIONS: TViewOptions[] = [
    'source',
    'filter',
    'sorting',
    'navigation',
    'selectFields',
    'markerVisibility',
    'markedKey',
    'multiSelectVisibility',
    'selectedKeys',
    'excludedKeys',
    'selectionType',
    'selectionCountMode',
    'displayProperty',
    'parentProperty',
    'nodeProperty',
    'nodeTypeProperty',
    'root',
    'hasChildrenProperty',
    'expandedItems',
    'collapsedItems',
    'nodeHistoryId',
    'nodeHistoryType',
    'groupHistoryId',
    'backButtonCaption',
    'breadCrumbsItems',
    'searchStartingWith',
    'searchValue',
    'viewMode',
    'sourceController',
    'loading',
    'deepReload',
    'singleExpand',
];

function validateOptionsOnContainer(options: IListContainerOptions): void {
    VIEW_OPTIONS.forEach((optionName) => {
        if (options[optionName] !== undefined) {
            Logger.error(`Передаётся опция ${optionName} для списка со storeId: ${options.storeId}.
                          Опцию ${optionName} необходимо задавать в параметрах списочной фабрики.
                          Подробнее можно прочитать тут: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/`);
        }
    });

    // @ts-ignore
    if (options.dataLoadCallback) {
        /*
         * warning пока подгрузка по скроллу не триггерит _dataLoaded в слайсе, надо добить реквест
         * https://online.sbis.ru/opendoc.html?guid=8d53f3b1-1acb-4b48-be8e-8ab773604670&client=3
         */
        Logger.warn(`Передаётся опция dataLoadCallback для списка со storeId: ${options.storeId}.
                           Опция не поддерживается, надо определить метод _dataLoaded на слайсе,
                           подробнее тут: https://wi.sbis.ru/docs/js/Controls/dataFactory/ListSlice/methods/_dataLoaded/`);
    }

    // @ts-ignore
    if (options.nodeLoadCallback) {
        Logger.error(`Передаётся опция nodeLoadCallback для списка со storeId: ${options.storeId}.
                           Опция не поддерживается, надо определить метод _nodeDataLoaded на слайсе,
                           подробнее тут: https://wi.sbis.ru/docs/js/Controls/dataFactory/ListSlice/methods/_nodeDataLoaded/`);
    }
}

function Content(props) {
    const state = props.slice.state;
    const innerProps = props.innerProps;
    const eventHandlers = { ...props.eventHandlers };
    // если регистрировать onListSelectedKeysCountChanged как событие на wasaby-контроле
    // то будет происходить его множесвенный выхов из Controls/_baseTree/BaseTreeControl::_endBeforeUpdate()
    const listSelectedKeysCountChangedCallback = eventHandlers.onListSelectedKeysCountChanged;
    delete eventHandlers.onListSelectedKeysCountChanged;
    return React.cloneElement(props.innerContent, {
        ...innerProps,
        $wasabyRef: null,
        ...eventHandlers,
        listSelectedKeysCountChangedCallback,
        sorting: state.sorting,
        selectedKeys: state.selectedKeys,
        excludedKeys: state.excludedKeys,
        parentProperty: state.parentProperty,
        keyProperty: state.keyProperty,
        backButtonCaption: state.backButtonCaption,
        nodeProperty: state.nodeProperty,
        nodeTypeProperty: state.nodeTypeProperty,
        searchValue: state.searchValue,
        searchNavigationMode: state.searchNavigationMode,
        searchStartingWith: state.searchStartingWith,
        breadCrumbsItems: state.breadCrumbsItems,
        root: state.root,
        source: state.source,
        filter: state.filter,
        viewMode: state.viewMode,
        multiSelectVisibility: state.multiSelectVisibility,
        displayProperty: state.displayProperty,
        markerVisibility: state.markerVisibility,
        expandedItems: state.expandedItems,
        collapsedItems: state.collapsedItems,
        singleExpand: state.singleExpand,

        sourceController: state.sourceController,
        loading: state.loading,
        columns: state.columns || innerProps.columns,
        header: state.header || innerProps.header,
        navigation: state.navigation,
        hasChildrenProperty: state.hasChildrenProperty,
        forwardedRef: props.forwardedRef,
        // expanderVisibility - чисто интерфейсная опция, её не должно быть в слайсе.
        expanderVisibility: props.expanderVisibility || state.expanderVisibility,
        selectionCountMode: state.selectionCountMode,
        supportSelection: state.supportSelection,
        markedKey: state.markedKey,
        slice: props.slice,
        hasSlice: !!props.slice,
        // Коллекция создана на слайсе, проставлен коллекшн тайп.
        useCollection: !!state.collectionType,
        collection: state.collectionType ? props.slice._collection : props.collection,
    });
}

function ListContainerConnected(
    props: IListContainerOptions,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const slice = useSlice(props.storeId) as ListSlice;
    const [selectedTypeRegister] = React.useState(
        new RegisterClass({
            register: 'selectedTypeChanged',
        })
    );
    const newApiEventHandlers = useHandlers({
        slice,
        changeRootByItemClick: props.changeRootByItemClick,
    });
    const eventHandlers = React.useMemo<INewListSchemeHandlers>(() => {
        return {
            onRootChanged(root: TKey): void {
                if (rootLoadingRef.current[root]) {
                    rootLoadingRef.current[root]
                        .then((items: RecordSet) => {
                            slice.unobserveChanges();
                            slice.state.sourceController.setRoot(root);
                            slice.observeChanges();
                            slice.setItems(items, root);
                        })
                        .finally(() => {
                            delete rootLoadingRef.current[root];
                        });
                } else {
                    slice.changeRoot(root);
                }
            },
            onBeforeRootChanged(root: TKey): void {
                if (props.preloadRoot && !rootLoadingRef.current[root]) {
                    rootLoadingRef.current[root] = slice.load(undefined, root, undefined, false);
                }
            },
            onSelectedKeysChanged(selectedKeys: TKey[]): void {
                slice.setState({
                    selectedKeys,
                });
            },
            onExcludedKeysChanged(excludedKeys: TKey[]): void {
                slice.setState({
                    excludedKeys,
                });
            },
            onListSelectedKeysCountChanged(count: number | null, isAllSelected: boolean): void {
                slice.setSelectionCount(count, isAllSelected, props.storeId);
            },
            onExpandedItemsChanged(expandedItems: TKey[]): void {
                slice.setState({
                    expandedItems,
                });
            },
            onMarkedKeyChanged(markedKey: TKey): void {
                slice.setState({
                    markedKey,
                });
            },
            onSortingChanged(sorting: TSortingOptionValue): void {
                slice.setState({
                    sorting,
                });
            },
            onRegister: withWasabyEventObject(
                (
                    event: Event,
                    registerType: string,
                    component: Control,
                    callback: Function,
                    config: object
                ): void => {
                    selectedTypeRegister.register(event, registerType, component, callback, config);
                }
            ),
            onLoadExpandedItem(nodeKey: TKey): Promise<RecordSet | Error> | void {
                if (!slice.hasLoaded(nodeKey)) {
                    return slice.load(void 0, nodeKey);
                }
            },
            onDataError(errorConfig: { error: Error }): void {
                if (errorConfig.error) {
                    process(errorConfig);
                }
            },
            ...newApiEventHandlers,
        };
    }, [slice, newApiEventHandlers]);
    const rootLoadingRef = React.useRef({});

    React.useEffect(() => {
        if (slice.state.command) {
            selectedTypeRegister.start(slice.state.command);
            slice.onExecutedCommand();
        }
    }, [slice.state.command]);

    React.useEffect(() => {
        slice.connect();
        return () => {
            slice.disconnect();
        };
    }, [slice]);

    validateOptionsOnContainer(props);
    return (
        <error.Container
            viewConfig={slice.state.errorViewConfig}
            forwardedRef={ref}
            innerContent={props.children}
            innerProps={props}
        >
            <Content eventHandlers={eventHandlers} slice={slice} />
        </error.Container>
    );
}

const forwardedComponent = React.forwardRef(ListContainerConnected);
forwardedComponent.defaultProps = {
    preloadRoot: true,
};
forwardedComponent.displayName = 'Controls/baseList:ListContainerConnected';

export default forwardedComponent;
