/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { ListSlice } from 'Controls/dataFactory';
import { RegisterClass } from 'Controls/event';
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
    TKey,
    TSortingOptionValue,
    INavigation,
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
    deepReload?: boolean;
}

export interface IListContainerOptions {
    storeId: string;
    children: React.ReactElement<IViewOptions>;
    preloadRoot?: boolean;
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
    'deepReload',
];

function validateOptionsOnContainer(options: IListContainerOptions): void {
    // columns пока не проверяем, потому что его задают на списке в сотрудниках и отчётности
    // и пока непонятно, всегда ли columns должны задаваться в загрузчике
    // multiSelectVisibility - https://online.sbis.ru/opendoc.html?guid=813bbe8b-e41f-4a34-be80-c5d4eff2279a&client=3
    const excludedOptions = ['columns', 'multiSelectVisibility'];

    VIEW_OPTIONS.forEach((optionName) => {
        if (options[optionName] !== undefined && !excludedOptions.includes(optionName)) {
            Logger.warn(`Передаётся опция ${optionName} для списка со storeId: ${options.storeId}.
                          Опцию ${optionName} необходимо задавать на уровне загрузчика данных`);
        }
    });
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
        breadCrumbsItems: state.breadCrumbsItems,
        root: state.root,
        source: state.source,
        filter: state.filter,
        viewMode: state.viewMode,
        //https://online.sbis.ru/opendoc.html?guid=813bbe8b-e41f-4a34-be80-c5d4eff2279a&client=3
        multiSelectVisibility:
            innerProps.multiSelectVisibility && innerProps.multiSelectVisibility !== 'hidden'
                ? innerProps.multiSelectVisibility
                : state.multiSelectVisibility,
        displayProperty: innerProps.displayProperty || state.displayProperty,
        markerVisibility: innerProps.markerVisibility || state.markerVisibility,
        expandedItems: innerProps.expandedItems || state.expandedItems,

        sourceController: state.sourceController,
        loading: state.loading,
        columns: state.columns || innerProps.columns,
        navigation: state.navigation,
        hasChildrenProperty: state.hasChildrenProperty,
        forwardedRef: props.forwardedRef,
        expanderVisibility: state.expanderVisibility,
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
