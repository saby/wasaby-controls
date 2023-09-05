import * as React from 'react';
import { IFilterItem, View } from 'Controls/filter';
import {
    useFilterDescription,
    IUseFilterDescriptionOptions,
    IUseFilterDescription,
    getSlices,
    getPropertyFromSlice,
} from 'Controls-ListEnv/filterBase';
import { isEqual } from 'Types/object';
import { DataContext } from 'Controls-DataEnv/context';
import { Logger } from 'UI/Utils';

export interface IFilterViewWidgetOptions extends IUseFilterDescriptionOptions {
    alignment?: 'right' | 'left';
    emptyText?: string;
    showFilterText?: boolean;

    panelTemplateName?: string;
    panelTemplateOptions?: unknown;

    detailPanelWidth?: string;
    detailPanelTopTemplateName?: string;
    detailPanelTopTemplateOptions?: object;
    detailPanelOrientation?: 'horizontal' | 'vertical';
    detailPanelExtendedItemsViewMode?: 'column' | 'row';
    detailPanelHistorySaveMode?: string;
    detailPanelExtendedTemplateName?: string;
}

interface IBaseFilterViewWidgetProps extends IFilterViewWidgetOptions {
    getDetailPanelName?: Function;
}

const customEvents = ['onItemsChanged', 'onDetailPanelClose'];

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

function validateProps(props: IBaseFilterViewWidgetProps): void {
    if (props.useStore) {
        Logger.warn(
            `Controls-ListEnv/filter:View не поддерживает опцию useStore. Настройте загрузку данных
             согласно статье: ${LOAD_CUSTOM_LINK} и передайте опцию storeId. При необходимости связи по Store
             используйте Controls.filter:ViewContainer и Controls.filter:View`,
            this
        );
    }
    if (props.storeId === undefined) {
        Logger.warn(
            'Для работы контрола Controls-ListEnv/filter:View необходимо указать опцию storeId'
        );
    }
}

function getDetailPanelName(filterSource: IFilterItem[]): string {
    const showFiltersPopup = !!filterSource.find(({ viewMode }) => {
        return viewMode === 'basic' || viewMode === 'extended';
    });
    return showFiltersPopup ? 'Controls/filterPanelPopup:Sticky' : '';
}

function getDetailPanelVisible(context: unknown, storeId: string): boolean {
    const slices = getSlices(context, storeId);
    return !!Object.keys(slices).find((storeName) => {
        return slices[storeName].filterDetailPanelVisible;
    });
}

function getSearchParam(context: unknown, storeId: string | string[]): string {
    return getPropertyFromSlice(context, storeId, 'searchParam') as string;
}

function isChangedAnyFilterSource(filterSource: IFilterItem[], searchParam: string): boolean {
    return filterSource.some((item) => {
        return (
            !isEqual(item.value, item.resetValue) &&
            item.viewMode !== 'frequent' &&
            item.visibility !== false &&
            item.name !== searchParam
        );
    });
}

function hasListItem(filterSource: IFilterItem[]): boolean {
    return filterSource.some((item) => {
        return item.type === 'list';
    });
}

function checkIsChangedFilterSource(filterSource: IFilterItem[], searchParam: string): boolean {
    return hasListItem(filterSource) && isChangedAnyFilterSource(filterSource, searchParam);
}

function isChangedPopupFilterSource(filterSource: IFilterItem[], searchParam: string): boolean {
    return filterSource.some((item) => {
        return (
            !isEqual(item.value, item.resetValue) &&
            item.viewMode !== 'frequent' &&
            item.visibility !== false &&
            item.name !== searchParam &&
            item.type !== 'list'
        );
    });
}

function getResetButtonVisible(editorsViewMode: string, isChanged: boolean): string {
    let result;
    if (!editorsViewMode && isChanged) {
        result = 'visible';
    } else if (editorsViewMode && editorsViewMode !== 'popupCloudPanelDefault' && isChanged) {
        result = 'withoutTextValue';
    } else {
        result = 'hidden';
    }
    return result;
}

function initResetButtonVisibility(
    filterSource: IFilterItem[],
    editorsViewMode,
    searchParam: string
): string {
    const isChangedFilterSource =
        hasListItem(filterSource) && isChangedPopupFilterSource(filterSource, searchParam);
    return getResetButtonVisible(editorsViewMode, isChangedFilterSource);
}

function findItem(filterSource: IFilterItem[], itemName: string): IFilterItem {
    return filterSource.find(({ name }) => {
        return name === itemName;
    });
}

function isOnlyFrequentItemsChanged(
    filterSource: IFilterItem[],
    newFilterSource: IFilterItem[]
): boolean {
    return newFilterSource.every((newItem) => {
        const oldItem = findItem(filterSource, newItem.name);
        return isEqual(oldItem.value, newItem.value) || newItem.viewMode === 'frequent';
    });
}

function FilterConnectedView(props: IBaseFilterViewWidgetProps, ref) {
    const { filterDescription, applyFilterDescription } = useFilterDescription(props);

    return filterDescription ? (
        <FilterConnectedViewContent
            {...props}
            ref={ref}
            filterDescription={filterDescription}
            applyFilterDescription={applyFilterDescription}
        />
    ) : (
        <div ref={ref}></div>
    );
}

const FilterConnectedViewContent = React.forwardRef(
    (props: IBaseFilterViewWidgetProps & IUseFilterDescription, ref): JSX.Element => {
        const { filterDescription, applyFilterDescription } = props;
        const [detailPanelVisible, setDetailPanelVisible] = React.useState(false);

        const context = React.useContext(DataContext);
        const viewRef = React.useRef(null);

        React.useEffect(() => {
            validateProps(props);
        }, [props.useStore, props.storeId]);

        React.useEffect(() => {
            if (getDetailPanelVisible(context, props.storeId)) {
                if (!detailPanelVisible) {
                    openDetailPanel();
                }
            } else {
                setDetailPanelVisible(false);
            }
        }, [context, props.storeId]);

        const editorsViewMode = React.useMemo(() => {
            return getPropertyFromSlice(context, props.storeId, 'editorsViewMode') as string;
        }, [filterDescription]);

        const [resetButtonVisibility, setResetButtonVisibility] = React.useState(
            initResetButtonVisibility(
                filterDescription,
                editorsViewMode,
                getSearchParam(context, props.storeId)
            )
        );

        const isChangedFilterSource = React.useMemo(() => {
            return checkIsChangedFilterSource(
                filterDescription,
                getSearchParam(context, props.storeId)
            );
        }, [filterDescription]);

        React.useLayoutEffect(() => {
            if (
                !isChangedFilterSource ||
                isChangedPopupFilterSource(
                    filterDescription,
                    getSearchParam(context, props.storeId)
                )
            ) {
                // Обновляем в случаях:
                // 1) если изменен хотя бы один фильтр из окна
                // 2) если фильтры сброшены
                return setResetButtonVisibility(
                    getResetButtonVisible(editorsViewMode, isChangedFilterSource)
                );
            }
        }, [editorsViewMode, filterDescription]);

        const detailPanelName = React.useMemo(() => {
            if (props.detailPanelTemplateName) {
                return props.detailPanelTemplateName;
            }
            return getDetailPanelName(filterDescription);
        }, [filterDescription]);

        const historyId = React.useMemo(() => {
            return getPropertyFromSlice(context, props.storeId, 'historyId') as string;
        }, [context, props.storeId]);

        const openDetailPanel = React.useCallback(() => {
            viewRef.current.openDetailPanel();
            setDetailPanelVisible(true);
        }, []);

        const detailPanelClose = React.useCallback(() => {
            const slices = getSlices(context, props.storeId);
            Object.keys(slices).forEach((storeId) => {
                slices[storeId].setState({
                    filterDetailPanelVisible: false,
                });
            });
        }, [context, props.storeId]);

        const filterSourceChangedInternal = React.useCallback(
            (filterSource: IFilterItem[]) => {
                applyFilterDescription(filterSource);

                // Если изменились только frequent фильтры - не обновляем
                if (!isOnlyFrequentItemsChanged(filterDescription, filterSource)) {
                    const newEditorsViewMode = getPropertyFromSlice(
                        context,
                        props.storeId,
                        'editorsViewMode'
                    ) as string;
                    const searchParam = getSearchParam(context, props.storeId);
                    const newFilterSourceIsChanged = checkIsChangedFilterSource(
                        filterSource,
                        searchParam
                    );
                    setResetButtonVisibility(
                        getResetButtonVisible(newEditorsViewMode, newFilterSourceIsChanged)
                    );
                }
            },
            [applyFilterDescription, filterDescription]
        );

        const detailPanelTemplateOptions = React.useMemo(() => {
            return {
                orientation: props.detailPanelOrientation,
                historySaveMode: props.detailPanelHistorySaveMode,
                extendedItemsViewMode: props.detailPanelExtendedItemsViewMode,
                extendedTemplateName: props.detailPanelExtendedTemplateName,
                topTemplate: props.detailPanelTopTemplateName,
                topTemplateOptions: props.detailPanelTopTemplateOptions,
                width: props.detailPanelWidth,
            };
        }, [
            props.detailPanelWidth,
            props.detailPanelExtendedItemsViewMode,
            props.detailPanelExtendedTemplateName,
            props.detailPanelTopTemplateName,
            props.detailPanelTopTemplateOptions,
            props.detailPanelOrientation,
            props.detailPanelHistorySaveMode,
        ]);

        const setRefs = (element) => {
            viewRef.current = element;
            if (ref) {
                ref(element);
            }
        };

        const attrs = {
            ...props.attrs,
            ...props.userAttrs,
        };

        return (
            <View
                attrs={attrs}
                ref={setRefs}
                source={filterDescription}
                detailPanelTemplateName={detailPanelName}
                panelTemplateName={props.panelTemplateName}
                panelTemplateOptions={props.panelTemplateOptions}
                historyId={historyId}
                alignment={props.alignment}
                emptyText={props.emptyText}
                resetButtonVisibility={resetButtonVisibility}
                editorsViewMode={editorsViewMode}
                showFilterText={props.showFilterText}
                onItemsChanged={filterSourceChangedInternal}
                onDetailPanelClose={detailPanelClose}
                customEvents={customEvents}
                detailPanelTemplateOptions={detailPanelTemplateOptions}
            ></View>
        );
    }
);

export default React.forwardRef(FilterConnectedView);
