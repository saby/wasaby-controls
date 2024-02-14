/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ListSlice, THandleItemClickParams } from 'Controls/dataFactory';
import { RegisterClass } from 'Controls/event';
import { IMarkerListOptions } from 'Controls/marker';
import { useTheme } from 'UICore/Contexts';
import * as React from 'react';
import {
    ISortingOptions,
    IPromiseSelectableOptions,
    IHierarchyOptions,
    IExpandedItemsOptions,
    ISourceOptions,
    IFilterOptions,
    TKey,
    TSortingOptionValue,
    INavigation,
    ISelectionTypeOptions,
    ISearchOptions,
    IHierarchySearchOptions,
    ISelectFieldsOptions,
    ISelectionCountModeOptions,
    IGroupingOptions,
} from 'Controls/interface';
import { NewSourceController as SourceController, error } from 'Controls/dataSource';
import { IColumn } from 'Controls/grid';
import { TExplorerViewMode } from 'Controls/explorer';
import { Logger } from 'UI/Utils';
import { useSlice } from 'Controls-DataEnv/context';
import type { ErrorController } from 'Controls/error';
import { processError, getErrorConfig } from 'Controls/_baseList/Error/errorHelpers';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Control } from 'UI/Base';
import { INewListSchemeHandlers } from 'Controls/_baseList/Data/INewListScheme';

interface IViewOptions
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

    if (options.dataLoadCallback) {
        Logger.warn(`Передаётся опция dataLoadCallback для списка со storeId: ${options.storeId}.
                           Опция не поддерживается, надо определить метод _dataLoaded на слайсе,
                           подробнее тут: https://wi.sbis.ru/docs/js/Controls/dataFactory/ListSlice/methods/_dataLoaded/`);
    }

    if (options.nodeLoadCallback) {
        Logger.error(`Передаётся опция nodeLoadCallback для списка со storeId: ${options.storeId}.
                           Опция не поддерживается, надо определить метод _nodeDataLoaded на слайсе,
                           подробнее тут: https://wi.sbis.ru/docs/js/Controls/dataFactory/ListSlice/methods/_nodeDataLoaded/`);
    }
}

function getErrorController(): ErrorController {
    const errorModule = loadSync<typeof import('Controls/error')>('Controls/error');
    return new errorModule.ErrorController({});
}

function Content(props) {
    const state = props.slice.state;
    const innerProps = props.innerProps;
    return React.cloneElement(props.innerContent, {
        ...innerProps,
        $wasabyRef: null,
        ...props.eventHandlers,
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
        singleExpand: state.singleExpand,

        // Коллекция создана на слайсе, проставлен коллекшн тайп.
        useCollection: !!props.slice.collection,
        sourceController: state.sourceController,
        loading: state.loading,
        columns: state.columns || innerProps.columns,
        navigation: state.navigation,
        hasChildrenProperty: state.hasChildrenProperty,
        forwardedRef: props.forwardedRef,
        expanderVisibility: state.expanderVisibility,
        selectionCountMode: state.selectionCountMode,
        supportSelection: state.supportSelection,
        markedKey: state.markedKey,
        slice: props.slice,
        collection: props.slice.collection,
    });
}

function ListContainerConnected(
    props: IListContainerOptions,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const slice = useSlice(props.storeId) as ListSlice;
    const theme = useTheme();
    const [errorConfig, setErrorConfig] = React.useState(null);
    const [errorController, setErrorController] = React.useState(
        isLoaded('Controls/error') ? getErrorController() : null
    );
    const [selectedTypeRegister] = React.useState(
        new RegisterClass({
            register: 'selectedTypeChanged',
        })
    );
    const [errorLoading, setErrorLoading] = React.useState(false);
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
            onRegister(
                event: Event,
                registerType: string,
                component: Control,
                callback: Function,
                config: object
            ): void {
                selectedTypeRegister.register(event, registerType, component, callback, config);
            },
            onLoadExpandedItem(nodeKey: TKey): Promise<RecordSet | Error> | void {
                if (!slice.hasLoaded(nodeKey)) {
                    return slice.load(void 0, nodeKey);
                }
            },

            onCheckboxClickNew(itemKey: TKey): void {
                slice.select(itemKey);
            },
            onItemClickNew(itemKey: TKey, params: THandleItemClickParams): void {
                slice.mark(itemKey, params);

                if (props.changeRootByItemClick) {
                    slice.changeRoot(itemKey);
                }
            },
            onExpanderClick(itemKey: TKey): void {
                if (slice.isExpanded(itemKey)) {
                    slice.collapse(itemKey);
                } else {
                    slice.expand(itemKey);
                }
            },
        };
    }, [slice]);
    const rootLoadingRef = React.useRef({});
    if (slice.state.command) {
        selectedTypeRegister.start(slice.state.command);
        slice.onExecutedCommand();
    }
    React.useEffect(() => {
        if (!errorController && !errorLoading) {
            setErrorLoading(true);
            loadAsync('Controls/error').then(() => {
                setErrorController(getErrorController());
            });
        } else if (slice.state.errorConfig) {
            const errorViewConfig = getErrorConfig(
                {
                    ...slice.state.errorConfig,
                    root: slice.state.root,
                },
                slice.state.errorConfig.error
            );
            processError(errorController, errorViewConfig, theme).then((config) => {
                setErrorConfig(config);
            });
        } else if (errorConfig) {
            setErrorConfig(null);
        }
    }, [slice.state.errorConfig, errorLoading]);
    React.useEffect(() => {
        slice.connect();
        return () => {
            slice.disconnect();
        };
    }, [slice]);

    validateOptionsOnContainer(props);
    return (
        <error.Container
            viewConfig={errorConfig}
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

export default forwardedComponent;
