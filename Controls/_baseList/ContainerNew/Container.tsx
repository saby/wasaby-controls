/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ListSlice, IListSliceErrorConfig } from 'Controls/dataFactory';
import { RegisterClass } from 'Controls/event';
import { createElement, delimitProps } from 'UICore/Jsx';
import { TVisibility as TMarkerVisibility } from 'Controls/marker';
import { useTheme } from 'UICore/Contexts';
import * as React from 'react';
import {
    ISortingOptions,
    IPromiseSelectableOptions,
    IHierarchyOptions,
    IExpandedItemsOptions,
    ISourceOptions,
    IFilterOptions,
    Direction,
    TKey,
    TSortingOptionValue,
    INavigation,
} from 'Controls/interface';
import { NewSourceController as SourceController, error } from 'Controls/dataSource';
import { IColumn } from 'Controls/grid';
import { TExplorerViewMode } from 'Controls/explorer';
import { Logger } from 'UI/Utils';
import { useSlice } from 'Controls-DataEnv/context';
import type { ErrorViewConfig, ErrorController } from 'Controls/error';
import { processError, getErrorConfig } from 'Controls/_baseList/Error/errorHelpers';
import { loadAsync, isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

interface IViewOptions
    extends ISortingOptions,
        IPromiseSelectableOptions,
        IHierarchyOptions,
        ISourceOptions,
        IFilterOptions,
        IExpandedItemsOptions {
    markerVisibility: TMarkerVisibility;
    sourceController: SourceController;
    root: TKey;
    breadCrumbsItems: Model[];
    loading: boolean;
    items: RecordSet;
    columns?: IColumn[];
    viewMode?: TExplorerViewMode;
    multiSelectVisibility?: string;
    searchValue: string;
    backButtonCaption?: string;
    displayProperty?: string;
    navigation?: INavigation;
    expanderVisibility?: 'hasChildren' | 'visible';
    hasChildrenProperty: string;
}

export interface IListContainerOptions {
    storeId: string;
    children: React.ReactElement<IViewOptions>;
    preloadRoot?: boolean;
}

interface IListInnerContainerOptions {
    children: React.ReactElement<IViewOptions>;
    slice: ListSlice;
    eventHandlers: Record<string, Function>;
    contentRef: React.ForwardedRef<unknown>;
}

type TViewOptions = keyof IViewOptions;

const VIEW_OPTIONS: TViewOptions[] = [
    'markerVisibility',
    'sorting',
    'selectedKeys',
    'excludedKeys',
    'displayProperty',
    'parentProperty',
    'backButtonCaption',
    'nodeProperty',
    'expandedItems',
    'searchValue',
    'breadCrumbsItems',
    'root',
    'source',
    'filter',
    'viewMode',
    'multiSelectVisibility',
    'sourceController',
    'loading',
    'columns',
    'navigation',
    'hasChildrenProperty',
    'expanderVisibility',
];

function validateOptionsOnContainer(options: IListContainerOptions): void {
    // columns пока не проверяем, потому что его задают на списке в сотрудниках и отчётности
    // и пока непонятно, всегда ли columns должны задаваться в загрузчике
    const excludedOptions = ['columns'];

    VIEW_OPTIONS.forEach((optionName) => {
        if (options[optionName] !== undefined && !excludedOptions.includes(optionName)) {
            Logger.error(`Передаётся опция ${optionName} для списка со storeId: ${options.storeId}.
                          Опцию ${optionName} необходимо задавать на уровне загрузчика данных`);
        }
    });
}

function getErrorController(): ErrorController {
    const errorModule = loadSync<typeof import('Controls/error')>('Controls/error');
    return new errorModule.ErrorController({});
}

function Content(props) {
    const slice = props.slice;
    return React.cloneElement(props.innerContent, {
        ...props.innerProps,
        $wasabyRef: null,
        ...props.eventHandlers,
        markerVisibility: slice.state.markerVisibility,
        sorting: slice.state.sorting,
        selectedKeys: slice.state.selectedKeys,
        excludedKeys: slice.state.excludedKeys,
        displayProperty: slice.state.displayProperty,
        parentProperty: slice.state.parentProperty,
        backButtonCaption: slice.state.backButtonCaption,
        nodeProperty: slice.state.nodeProperty,
        expandedItems: slice.state.expandedItems,
        searchValue: slice.state.searchValue,
        breadCrumbsItems: slice.state.breadCrumbsItems,
        root: slice.state.root,
        source: slice.state.source,
        filter: slice.state.filter,
        viewMode: slice.state.viewMode,
        multiSelectVisibility: slice.state.multiSelectVisibility,
        sourceController: slice.state.sourceController,
        loading: slice.state.loading,
        columns: slice.state.columns || props.columns,
        navigation: slice.state.navigation,
        hasChildrenProperty: slice.state.hasChildrenProperty,
        forwardedRef: props.forwardedRef,
        expanderVisibility: slice.state.expanderVisibility,
    });
}

function ListContainerNew(
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
    const eventHandlers = React.useMemo(() => {
        return {
            onRootChanged(root: TKey): void {
                if (rootLoadingRef.current[root]) {
                    rootLoadingRef.current[root].then((items: RecordSet) => {
                        slice.unobserveChanges();
                        slice.state.sourceController.setRoot(root);
                        slice.observeChanges();
                        slice.setItems(items, root);
                    });
                    delete rootLoadingRef.current[root];
                } else {
                    slice.setState({ root });
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
            onSelectedKeysCountChanged(count: number | void, isAllSelected: boolean): void {
                this._listSlice.setSelectionCount(count, isAllSelected, props.storeId);
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
                component: unknown,
                callback: Function,
                config: object
            ): void {
                selectedTypeRegister.register(event, registerType, component, callback, config);
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
            processError(errorController, errorViewConfig, theme).then(() => {
                setErrorConfig(errorViewConfig);
            });
        } else if (errorConfig) {
            setErrorConfig(null);
        }
    }, [slice.state.errorConfig, errorLoading]);

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

const forwardedComponent = React.forwardRef(ListContainerNew);
forwardedComponent.defaultProps = {
    preloadRoot: true,
};

export default forwardedComponent;
