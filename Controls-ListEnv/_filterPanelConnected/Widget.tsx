import * as React from 'react';
import { View } from 'Controls/filterPanel';
import {} from 'Controls-ListEnv/filterBase';
import { IBackgroundStyle, IContrastBackground, TKey } from 'Controls/interface';
import {
    IInnerWidgetOptions,
    getPropertyFromSlice,
    getSlice,
    useFilterDescription,
} from 'Controls-ListEnv/filterBase';
import ViewModeController, { ViewModeType } from './ViewModeController';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
import { DataContext } from 'Controls-DataEnv/context';

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

interface IFilterPanelWidgetOptions
    extends IContrastBackground,
        IBackgroundStyle,
        IInnerWidgetOptions {
    editorsViewMode?: ViewModeType;
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

function getEditorsViewMode(context: unknown, props: IFilterPanelWidgetOptions): ViewModeType {
    return (
        props.editorsViewMode ||
        (getPropertyFromSlice(context, props.storeId, 'editorsViewMode') as ViewModeType)
    );
}

function getSearchParam(context: unknown, props: IFilterPanelWidgetOptions): string {
    return getPropertyFromSlice(context, props.storeId, 'searchParam') as string;
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
    context: unknown,
    props: IFilterPanelWidgetOptions,
    viewModeController
): IFilterItem[] {
    let filterSource = viewModeController.getFilterPanelSource();

    const editorsViewMode = getEditorsViewMode(context, props);
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

function initEditorsViewMode(viewModeController: ViewModeController): string {
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
    const context = React.useContext(DataContext);
    const { fullFilterDescription, filterDescription, applyFilterDescription } =
        useFilterDescription(props);

    React.useEffect(() => {
        validateProps(props);
    }, [props.storeId]);

    const { viewModeController, resetButtonVisible, propStorageId } = React.useMemo(() => {
        const filterButtonItems = fullFilterDescription;
        const viewMode = getEditorsViewMode(context, props);
        const searchParam = getSearchParam(context, props);
        const controller = new ViewModeController(
            filterButtonItems,
            viewMode,
            props.filterNames,
            searchParam
        );

        return {
            viewModeController: controller,
            resetButtonVisible:
                viewMode || !controller.hasFilterPopupItems(filterButtonItems, props.filterNames),
            propStorageId: getPropertyFromSlice(context, props.storeId, 'propStorageId'),
        };
    }, []);

    const [editorsViewMode, setEditorsViewMode] = React.useState(
        initEditorsViewMode(viewModeController)
    );

    const [filterPanelDescription, setFilterPanelDescription] = React.useState(
        initFilterPanelSource(context, props, viewModeController)
    );

    React.useLayoutEffect(() => {
        const editorsViewModeProp = getEditorsViewMode(context, props);
        let newFilterPanelItems;
        if (editorsViewModeProp === 'popupCloudPanelDefault') {
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
                getSearchParam(context, props),
                editorsViewModeProp
            );
        }
        setFilterPanelDescription(newFilterPanelItems);
        const viewMode = viewModeController.getViewMode();
        if (editorsViewMode !== viewMode) {
            if (viewMode === 'default') {
                newFilterPanelItems.forEach(({ name }) => {
                    getSlice(context, props.storeId)?.reloadFilterItem(name);
                });
            }
            setEditorsViewMode(viewMode);
        }
    }, [fullFilterDescription, props.editorsViewMode]);

    React.useLayoutEffect(() => {
        const editorsViewModeProp = getEditorsViewMode(context, props);
        if (editorsViewModeProp === 'popupCloudPanelDefault') {
            const newFilterPanelItems = viewModeController.updateFilterPanelSource(
                fullFilterDescription,
                props.filterNames,
                getSearchParam(context, props),
                editorsViewModeProp
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
                editorsViewModeProp,
                props.filterNames,
                getSearchParam(context, props)
            )
        );
    }, [props.filterNames]);

    const filterPanelSourceChanged = React.useCallback(
        (newFilterPanelDescription) => {
            const sourceController = getPropertyFromSlice(
                context,
                props.storeId,
                'sourceController'
            );
            const parentProperty = sourceController.getParentProperty();
            const editorsViewModeProp = getEditorsViewMode(context, props);

            if (parentProperty) {
                const rootFilter = findItem(newFilterPanelDescription, parentProperty);

                if (rootFilter) {
                    sourceController.setRoot(rootFilter.value as TKey);
                }
            }

            if (editorsViewModeProp === 'popupCloudPanelDefault') {
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
                            editorsViewModeProp,
                            props.filterNames,
                            getSearchParam(context, props)
                        )
                    );
                } else if (editorsViewMode === 'cloud') {
                    setTextValueVisible(filterPanelDescription, newFilterPanelDescription);
                }
                applyFilterDescription(newFilterPanelDescription);
            }
        },
        [filterDescription]
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
