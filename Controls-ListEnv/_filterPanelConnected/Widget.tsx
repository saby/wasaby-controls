import * as React from 'react';
import { View } from 'Controls/filterPanel';
import {
    IBackgroundStyleOptions,
    IContrastBackgroundOptions,
    TKey,
    IStoreIdOptions,
} from 'Controls/interface';
import type { IFilterNamesOptions } from 'Controls-ListEnv/filterConnected';
import { getPropertyFromSlice, getSlices, useFilterDescription } from 'Controls-ListEnv/filterBase';
import { TEditorsViewMode } from 'Controls/filterPanel';
import ViewModeController, { ViewModeType } from './ViewModeController';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
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

const customEvents = ['onEditorsViewMode', 'onSourceChanged'];

function validateProps(props: IFilterPanelWidgetOptions): void {
    if (props.useStore) {
        Logger.warn(
            `Controls-ListEnv/filterPanel:View не поддерживает опцию useStore. Настройте загрузку
             данных согласно статье: ${LOAD_CUSTOM_LINK} и передайте опцию storeId. При необходимости связи по Store
             используйте Controls.filterPanel:Container и Controls.filterPanel:View`
        );
    }
    if (props.storeId === undefined) {
        Logger.warn(
            'Для работы контрола Controls-ListEnv/filterPanel:View' +
                ' необходимо указать опцию storeId'
        );
    }
}

function getEditorsViewMode(props: IFilterPanelWidgetOptions): ViewModeType {
    return (
        props.editorsViewMode ||
        getPropertyFromSlice<ViewModeType>(props.storeId, 'editorsViewMode')
    );
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

function needResetFilterPanelItem(
    filterSource: IFilterItem[],
    oldFilterSource: IFilterItem[]
): boolean {
    return !!filterSource.find((sourceItem) => {
        const item = findItem(oldFilterSource, sourceItem.name);
        if (item) {
            return !isEqual(item.value, sourceItem.value) && !isEqual(item.value, item.resetValue);
        }
    });
}

function initFilterPanelSource(
    props: IFilterPanelWidgetOptions,
    viewModeController
): IFilterItem[] {
    let filterSource = viewModeController.getFilterPanelSource();

    const editorsViewMode = getEditorsViewMode(props);
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

function initEditorsViewMode(viewModeController: ViewModeController): TEditorsViewMode {
    const controllerViewMode = viewModeController.getViewMode();
    if (controllerViewMode) {
        return controllerViewMode;
    }
    return 'default';
}

/**
 * Контрол - "Панель фильтров". Реализует UI для отображения и редактирования фильтра в левой колонке мастера.
 * В основе виджета лежит интерфейсный контрол {@link Controls/filterPanel:View панель фильтров}
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
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
 * @see Controls-ListEnv/frequentFilterConnected:Tumbler
 */
export default React.forwardRef(function FilterPanelConnectedWidget(
    props: IFilterPanelWidgetOptions,
    ref
) {
    const { fullFilterDescription, filterDescription, applyFilterDescription } =
        useFilterDescription(props);
    const searchParam = getSearchParam(props);
    const viewMode = getEditorsViewMode(props);
    const propStorageId = getPropertyFromSlice<string>(props.storeId, 'propStorageId');
    const sourceController = getPropertyFromSlice<NewSourceController>(
        props.storeId,
        'sourceController'
    );
    const slices = getSlices(props.storeId);
    const context = React.useContext(DataContext);

    React.useEffect(() => {
        validateProps(props);
    }, [props.storeId, context]);

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
            resetButtonVisible: !!(
                viewMode || !controller.hasFilterPopupItems(filterButtonItems, props.filterNames)
            ),
        };
    }, []);

    const [editorsViewMode, setEditorsViewMode] = React.useState<TEditorsViewMode>(
        initEditorsViewMode(viewModeController)
    );

    const [filterPanelDescription, setFilterPanelDescription] = React.useState(
        initFilterPanelSource(props, viewModeController)
    );

    React.useLayoutEffect(() => {
        let newFilterPanelItems;
        if (viewMode === 'popupCloudPanelDefault') {
            newFilterPanelItems = updateEditorsOptions(filterDescription, filterPanelDescription);
            const changedFilterPanelItem = needResetFilterPanelItem(
                filterDescription,
                newFilterPanelItems
            );
            if (changedFilterPanelItem) {
                newFilterPanelItems = getResetedFilterPanelItems(newFilterPanelItems);
            }
        } else {
            newFilterPanelItems = viewModeController.updateFilterPanelSource(
                fullFilterDescription,
                props.filterNames,
                searchParam,
                viewMode
            );
        }
        setFilterPanelDescription(newFilterPanelItems);
        const currentViewMode = viewModeController.getViewMode();
        if (editorsViewMode !== currentViewMode) {
            if (currentViewMode === 'default') {
                newFilterPanelItems.forEach(({ name }) => {
                    slices[props.storeId]?.reloadFilterItem(name);
                });
            }
            setEditorsViewMode(currentViewMode);
        }
    }, [fullFilterDescription, editorsViewMode, props.storeId, context]);

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
                newFilterPanelItems.forEach((panelItem) => {
                    const item = findItem(filterPanelDescription, panelItem.name);
                    panelItem.viewMode = item ? item.viewMode : panelItem.viewMode;
                });

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
            const parentProperty = sourceController.getParentProperty();

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
                    applyFilterDescription(changedFilterPanelItem);
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
                applyFilterDescription(newFilterPanelDescription);
            }
        },
        [filterDescription, editorsViewMode, props.filterNames, searchParam, sourceController]
    );

    //scope={options}
    return (
        <View
            ref={ref}
            attrs={props.attrs}
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
});

/**
 * @name Controls-ListEnv/filterPanelConnected/View#filterNames
 * @cfg {string[]} Фильтры, которые редактируются в виджете. Передаётся в виде массива имён фильтров.
 * @example
 * <pre>
 *    <Controls-ListEnv.filterPanelConnected:View filterNames="['Ответственный', 'Регион']" />
 * </pre>
 */
