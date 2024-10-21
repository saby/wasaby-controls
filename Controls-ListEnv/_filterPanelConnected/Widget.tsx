import * as React from 'react';
import { TEditorsViewMode, View } from 'Controls/filterPanel';
import {
    IBackgroundStyleOptions,
    IContrastBackgroundOptions,
    IStoreIdOptions,
    TKey,
} from 'Controls/interface';
import type { IFilterNamesOptions } from 'Controls-ListEnv/filterConnected';
import { getPropertyFromSlice, getSlices, useFilterDescription } from 'Controls-ListEnv/filterBase';
import ViewModeController, { ViewModeType } from './ViewModeController';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { logger } from 'Application/Env';
import { NewSourceController } from 'Controls/dataSource';
import { TInternalProps } from 'UICore/Executor';
import { DataContext } from 'Controls-DataEnv/context';

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

interface IFilterPanelWidgetOptions
    extends IContrastBackgroundOptions,
        IBackgroundStyleOptions,
        IStoreIdOptions,
        IFilterNamesOptions,
        TInternalProps {
    editorsViewMode?: TEditorsViewMode;
    multiSelect?: boolean;
    /**
     * @deprecated
     */
    useStore?: boolean;
}

const customEvents = ['onSourceChanged'];

function validateProps(props: IFilterPanelWidgetOptions): void {
    if (props.useStore) {
        logger.error(
            `Controls-ListEnv/filterPanelConnected:View не поддерживает опцию useStore. Настройте загрузку
             данных согласно статье: ${LOAD_CUSTOM_LINK} и передайте опцию storeId. При необходимости связи по Store
             используйте Controls/filterOld:Container и Controls/filterPanel:View`
        );
    }
    if (props.storeId === undefined) {
        logger.error(
            'Для работы контрола Controls-ListEnv/filterPanelConnected:View необходимо указать опцию storeId'
        );
    }
}

function getEditorsViewMode(
    props: IFilterPanelWidgetOptions,
    sliceViewMode?: ViewModeType
): ViewModeType {
    return props.editorsViewMode || sliceViewMode || 'default';
}

function getSearchParam(props: IFilterPanelWidgetOptions): string {
    return getPropertyFromSlice<string>(props.storeId, 'searchParam');
}

function cloneItems(filterSource: IFilterItem[]): IFilterItem[] {
    return filterSource.map((item) => {
        return { ...item };
    });
}

function setTextValueVisible(
    oldPanelSource: IFilterItem[],
    filterPanelSource: IFilterItem[]
): void {
    filterPanelSource.forEach((panelItem) => {
        const oldItem = findItem(oldPanelSource, panelItem.name);
        if (oldItem && !isEqual(oldItem.value, panelItem.value)) {
            panelItem.textValueVisible = false;
        }
    });
}

function getChangedFilterPanelItem(
    oldPanelSource: IFilterItem[],
    filterPanelSource: IFilterItem[]
): IFilterItem[] {
    const result = [];
    filterPanelSource.find((panelItem) => {
        const oldItem = findItem(oldPanelSource, panelItem.name);
        if (oldItem && !isEqual(oldItem.value, panelItem.value)) {
            result.push(panelItem);
        }
    });
    return result;
}

function getOutsideChangedFilterItem(
    filterSource: IFilterItem[],
    oldFilterSource: IFilterItem[]
): IFilterItem {
    return filterSource.find((sourceItem) => {
        const item = findItem(oldFilterSource, sourceItem.name);
        if (item) {
            return (
                !isEqual(item.value, sourceItem.value) && !isEqual(item.value, item.resetValue)

                // Вернуть после https://online.sbis.ru/opendoc.html?guid=50b805b5-639f-49da-8146-398b0fb8bddd&client=3
                /* && sourceItem.appliedFrom !== 'filterPanel' */
            );
        }
    });
}

function initFilterPanelSource(
    props: IFilterPanelWidgetOptions,
    viewModeController,
    sliceViewMode: ViewModeType
): IFilterItem[] {
    let filterSource = viewModeController.getFilterPanelSource();

    const editorsViewMode = getEditorsViewMode(props, sliceViewMode);
    if (editorsViewMode === 'popupCloudPanelDefault') {
        filterSource = getResetedFilterPanelItemsOnMount(filterSource);
    }
    return filterSource;
}

function getResetedFilterPanelItemsOnMount(filterPanelSource: IFilterItem[]): IFilterItem[] {
    const filterPanel = cloneItems(filterPanelSource);
    filterPanel.forEach((item) => {
        if (!item.doNotSaveToHistory) {
            item.value = item.editorOptions?.emptyKey || item.resetValue;
        }
    });
    return filterPanel;
}

function getResetedFilterPanelItems(filterPanelSource): IFilterItem[] {
    const filterPanel = cloneItems(filterPanelSource);
    filterPanel.forEach((item) => {
        item.value = item.editorOptions?.emptyKey || item.resetValue;
    });
    return filterPanel;
}

function findItem(filterSource: IFilterItem[], itemName: string): IFilterItem {
    return filterSource.find(({ name }) => {
        return name === itemName;
    });
}

function updateEditorsOptions(
    newFilterSource: IFilterItem[],
    oldFilterSource: IFilterItem[]
): IFilterItem[] {
    const filterPanel = oldFilterSource
        .filter((item) => {
            return findItem(newFilterSource, item.name);
        })
        .map((item) => {
            return { ...item };
        });
    filterPanel.forEach((filterItem) => {
        filterItem.editorOptions = { ...filterItem.editorOptions };
    });
    filterPanel.forEach((item) => {
        item.editorOptions = findItem(newFilterSource, item.name).editorOptions;
    });
    return filterPanel;
}

function assignNewFilterItems(
    newFilterSource: IFilterItem[],
    updatedFilterSource: IFilterItem[]
): IFilterItem[] {
    const newFilterPanelSource = newFilterSource.filter((item) => {
        return !findItem(updatedFilterSource, item.name);
    });
    return [...updatedFilterSource, ...newFilterPanelSource];
}

function updateChangedItems(
    newFilterSource: IFilterItem[],
    oldFilterSource: IFilterItem[]
): IFilterItem[] {
    const updatedFilterPanelItems = updateEditorsOptions(newFilterSource, oldFilterSource);
    const filterPanel = assignNewFilterItems(newFilterSource, updatedFilterPanelItems);
    filterPanel.forEach((item) => {
        const newItem = findItem(newFilterSource, item.name);
        if (
            !newItem.appliedFrom &&
            !isEqual(newItem.value, newItem.resetValue) &&
            !isEqual(item.value, newItem.value)
        ) {
            item.value = newItem.value;
        }
    });
    return filterPanel;
}

function initEditorsViewMode(viewModeController: ViewModeController): TEditorsViewMode {
    const controllerViewMode = viewModeController.getViewMode();
    if (controllerViewMode) {
        return controllerViewMode;
    }
    return 'default';
}

function resetViewMode(
    newFilterPanelItems: IFilterItem[],
    oldFilterPanelItems: IFilterItem[],
    viewMode: string
): void {
    newFilterPanelItems.forEach((panelItem) => {
        const item = findItem(oldFilterPanelItems, panelItem.name);
        if (
            item &&
            (viewMode === 'popupCloudPanelDefault' || isItemExtendedInDefaultMode(item, viewMode))
        ) {
            panelItem.viewMode = item ? item.viewMode : panelItem.viewMode;
        }
    });
}

function isItemExtendedInDefaultMode(filterItem: IFilterItem, viewMode: string): boolean {
    return !!(
        viewMode === 'default' &&
        filterItem.expanderVisible &&
        filterItem.editorOptions?.markerStyle !== 'primary' &&
        filterItem.extendedCaption
    );
}

/**
 * Контрол - "Панель фильтров". Реализует UI для отображения и редактирования фильтра в левой колонке мастера.
 * В основе виджета лежит интерфейсный контрол {@link Controls/filterPanel:View панель фильтров}
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке панели фильтров}
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтров на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @class Controls-ListEnv/filterPanelConnected:View
 * @extends Controls/filterPanel:View
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions source
 * @ignoreEvents filterChanged sourceChanged
 * @ignoreMethods resetFilter
 *
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/FilterPanel/View/Base/Index
 *
 * @see Controls/filterPanel:View
 * @see Controls-ListEnv/filterConnected:View
 * @see Controls/dataFactory:ListSlice
 */
const FilterPanelConnectedWidget = React.forwardRef<View, IFilterPanelWidgetOptions>(
    (props: IFilterPanelWidgetOptions, ref) => {
        const { fullFilterDescription, filterDescription, applyFilterDescription } =
            useFilterDescription(props);
        const searchParam = getSearchParam(props);
        const propStorageId = getPropertyFromSlice<string>(props.storeId, 'propStorageId');
        const sourceController = getPropertyFromSlice<NewSourceController>(
            props.storeId,
            'sourceController'
        );
        const slices = getSlices(props.storeId);
        const context = React.useContext(DataContext);
        const firstRenderRef = React.useRef<boolean>(true);
        const sliceViewMode = getPropertyFromSlice<ViewModeType>(props.storeId, 'editorsViewMode');
        React.useMemo(() => {
            validateProps(props);
        }, [props.storeId, context]);

        const viewMode = React.useMemo(
            () => getEditorsViewMode(props, sliceViewMode),
            [props.editorsViewMode, slices[props.storeId]]
        );
        const { viewModeController, resetButtonVisible } = React.useMemo(() => {
            const filterButtonItems = fullFilterDescription;
            const controller = new ViewModeController(
                filterButtonItems,
                viewMode,
                props.filterNames,
                searchParam
            );

            return {
                viewModeController: controller,
                resetButtonVisible:
                    (viewMode !== 'cloud|default' ||
                        !controller.hasFilterPopupItems(filterButtonItems, props.filterNames)) &&
                    props.resetButtonVisible !== false,
            };
        }, [props.resetButtonVisible]);

        const [editorsViewMode, setEditorsViewMode] = React.useState<TEditorsViewMode>(
            initEditorsViewMode(viewModeController)
        );

        const [filterPanelDescription, setFilterPanelDescription] = React.useState(
            initFilterPanelSource(props, viewModeController, sliceViewMode)
        );

        React.useLayoutEffect(() => {
            viewModeController.setViewMode(viewMode);
        }, [viewMode]);

        React.useLayoutEffect(() => {
            let newFilterPanelItems;
            if (viewMode === 'popupCloudPanelDefault') {
                newFilterPanelItems = updateChangedItems(filterDescription, filterPanelDescription);
                const changedFilterPanelItem = getOutsideChangedFilterItem(
                    filterDescription,
                    newFilterPanelItems
                );
                if (!!changedFilterPanelItem) {
                    newFilterPanelItems = getResetedFilterPanelItems(newFilterPanelItems);
                }
            } else {
                newFilterPanelItems = viewModeController.updateFilterPanelSource(
                    fullFilterDescription,
                    props.filterNames,
                    searchParam,
                    viewMode
                );
                if (viewMode === 'default') {
                    resetViewMode(newFilterPanelItems, filterPanelDescription, viewMode);
                }
            }
            if (!firstRenderRef.current) {
                setFilterPanelDescription(newFilterPanelItems);
            }
            const currentViewMode = viewModeController.getViewMode();
            if (editorsViewMode !== currentViewMode) {
                if (currentViewMode === 'default') {
                    newFilterPanelItems.forEach(({ name }) => {
                        slices[props.storeId]?.reloadFilterItem(name);
                    });
                }
                setEditorsViewMode(currentViewMode);
                slices[props.storeId]?.setState({ editorsViewMode: currentViewMode });
            }
            if (firstRenderRef.current) {
                firstRenderRef.current = false;
            }
        }, [fullFilterDescription, editorsViewMode, props.storeId, slices[props.storeId]]);

        React.useLayoutEffect(() => {
            if (!isEqual(viewModeController.getFilterNames(), props.filterNames)) {
                viewModeController.setFilterNames(props.filterNames);

                if (viewMode === 'popupCloudPanelDefault') {
                    const newFilterPanelItems = viewModeController.updateFilterPanelSource(
                        fullFilterDescription,
                        props.filterNames,
                        searchParam,
                        viewMode
                    );
                    // В итемах панели на состоянии viewMode элемента может отличаться от того, что находится в конфиге
                    // Чтобы фильтры не улетели в "Можно отобрать" проставим viewMode из старых итемов.
                    resetViewMode(newFilterPanelItems, filterPanelDescription, viewMode);

                    setFilterPanelDescription(
                        updateEditorsOptions(newFilterPanelItems, filterPanelDescription)
                    );
                }
                setFilterPanelDescription(
                    viewModeController.setFilterPanelSource(
                        fullFilterDescription,
                        viewMode,
                        props.filterNames,
                        searchParam
                    )
                );
            }
        }, [props.filterNames, searchParam]);

        const filterPanelSourceChanged = React.useCallback(
            (newFilterPanelDescription) => {
                const parentProperty = sourceController?.getParentProperty();

                if (parentProperty) {
                    const rootFilter = findItem(newFilterPanelDescription, parentProperty);

                    if (rootFilter) {
                        sourceController.setRoot(rootFilter.value as TKey);
                    }
                }

                if (viewMode === 'popupCloudPanelDefault') {
                    const changedFilterPanelItem = getChangedFilterPanelItem(
                        filterPanelDescription,
                        newFilterPanelDescription
                    );
                    setFilterPanelDescription(newFilterPanelDescription);
                    if (changedFilterPanelItem.length) {
                        applyFilterDescription(changedFilterPanelItem, undefined, 'filterPanel');
                    }
                } else {
                    if (editorsViewMode === 'default') {
                        setFilterPanelDescription(
                            viewModeController.setFilterPanelSource(
                                newFilterPanelDescription,
                                viewMode,
                                props.filterNames,
                                searchParam
                            )
                        );
                    } else if (editorsViewMode === 'cloud') {
                        setTextValueVisible(filterPanelDescription, newFilterPanelDescription);
                    }
                    applyFilterDescription(newFilterPanelDescription, undefined, 'filterPanel');
                }
            },
            [
                filterDescription,
                filterPanelDescription,
                editorsViewMode,
                props.filterNames,
                searchParam,
                sourceController,
            ]
        );

        //scope={options}
        return (
            <View
                ref={ref}
                attrs={{
                    style: props.attrs?.style,
                }}
                className={props.className}
                data-qa={props['data-qa']}
                propStorageId={propStorageId}
                multiSelect={props.multiSelect}
                editorsViewMode={editorsViewMode}
                resetButtonVisible={resetButtonVisible}
                source={filterPanelDescription}
                style="master"
                onSourceChanged={filterPanelSourceChanged}
                contrastBackground={props.contrastBackground}
                customEvents={customEvents}
            />
        );
    }
);

export default FilterPanelConnectedWidget;

/**
 * @name Controls-ListEnv/filterPanelConnected/View#filterNames
 * @cfg {string[]} Фильтры, которые редактируются в виджете. Передаётся в виде массива имён фильтров.
 * @example
 * <pre>
 *    <Controls-ListEnv.filterPanelConnected:View filterNames="['Ответственный', 'Регион']" />
 * </pre>
 */
