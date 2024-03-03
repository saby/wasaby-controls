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
import { Logger } from 'UI/Utils';
import { TFilter } from 'Controls/interface';
import { DataContext } from 'Controls-DataEnv/context';

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
    detailPanelEmptyHistoryTemplate?: Function | JSX.Element;
}

interface IBaseFilterViewWidgetProps extends IFilterViewWidgetOptions {
    getDetailPanelName?: Function;
    /**
     * @deprecated
     */
    useStore?: boolean;
    className?: string;
    detailPanelTemplateName?: string;
}

const customEvents = ['onItemsChanged', 'onDetailPanelClose'];

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

function validateProps(props: IBaseFilterViewWidgetProps): void {
    if (props.useStore) {
        Logger.warn(
            `Controls-ListEnv/filter:View не поддерживает опцию useStore. Настройте загрузку данных
             согласно статье: ${LOAD_CUSTOM_LINK} и передайте опцию storeId. При необходимости связи по Store
             используйте Controls.filterOld:ViewContainer и Controls.filter:View`,
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

function getSearchParam(storeId: string | string[]): string {
    return getPropertyFromSlice<string>(storeId, 'searchParam');
}

function updateTextValueVisible(filterSource: IFilterItem[], searchParam: string): void {
    filterSource.forEach((item) => {
        if ((item.appliedFrom && item.viewMode !== 'frequent') || item.name === searchParam) {
            item.textValueVisible = !(
                !isEqual(item.value, item.resetValue) &&
                (item.appliedFrom === 'filterSearch' ||
                    item.appliedFrom === 'filterPanel' ||
                    item.name === searchParam)
            );
        }
    });
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
            (item.type !== 'list' || item.appliedFrom === 'filterPopup')
        );
    });
}

function getResetButtonVisible(editorsViewMode: string, isChanged: boolean): string {
    let result;
    if (editorsViewMode === 'cloud|default' && isChanged) {
        result = 'visible';
    } else if (editorsViewMode === 'cloud' && isChanged) {
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

const FilterConnectedView = React.forwardRef((props: IBaseFilterViewWidgetProps, ref) => {
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
});

function getDetailPanelVisible(storeId: IBaseFilterViewWidgetProps['storeId']): boolean {
    const slices = getSlices(storeId);
    return !!Object.keys(slices).find((storeName) => {
        return slices[storeName].state.filterDetailPanelVisible;
    });
}

const FilterConnectedViewContent = React.forwardRef(
    (props: IBaseFilterViewWidgetProps & IUseFilterDescription, ref): JSX.Element => {
        const { filterDescription, applyFilterDescription } = props;
        const searchParam = getSearchParam(props.storeId);
        const [filterViewDescription, setFilterViewDescription] = React.useState(() => {
            updateTextValueVisible(filterDescription, searchParam);
            return filterDescription;
        });
        const context = React.useContext(DataContext);
        const slices = getSlices(props.storeId);
        const editorsViewMode =
            getPropertyFromSlice<string>(props.storeId, 'editorsViewMode') || props.editorsViewMode;
        const historyId = getPropertyFromSlice<string>(props.storeId, 'historyId');
        const filter = getPropertyFromSlice<TFilter>(props.storeId, 'filter');
        const detailPanelVisible = getDetailPanelVisible(props.storeId);

        const viewRef = React.useRef(null);

        React.useEffect(() => {
            validateProps(props);
        }, [props.useStore, props.storeId, context]);

        const [resetButtonVisibility, setResetButtonVisibility] = React.useState(
            initResetButtonVisibility(filterDescription, editorsViewMode, searchParam)
        );

        const isChangedFilterSource = React.useMemo(() => {
            return checkIsChangedFilterSource(filterDescription, searchParam);
        }, [filterDescription, searchParam]);

        React.useLayoutEffect(() => {
            updateTextValueVisible(filterDescription, searchParam);
            setFilterViewDescription(filterDescription);
            if (
                !isChangedFilterSource ||
                isChangedPopupFilterSource(filterDescription, searchParam)
            ) {
                // Обновляем в случаях:
                // 1) если изменен хотя бы один фильтр из окна
                // 2) если фильтры сброшены
                return setResetButtonVisibility(
                    getResetButtonVisible(editorsViewMode, isChangedFilterSource)
                );
            }
        }, [editorsViewMode, filterDescription, searchParam]);

        const detailPanelName = React.useMemo(() => {
            if (props.detailPanelTemplateName) {
                return props.detailPanelTemplateName;
            }
            return getDetailPanelName(filterDescription);
        }, [filterDescription]);

        const detailPanelClose = React.useCallback(() => {
            Object.keys(slices).forEach((storeId) => {
                slices[storeId].setState({
                    filterDetailPanelVisible: false,
                });
            });
        }, [props.storeId, context]);

        const filterSourceChangedInternal = React.useCallback(
            (filterSource: IFilterItem[]) => {
                applyFilterDescription(filterSource, undefined, 'filterPopup');

                // Если изменились только frequent фильтры - не обновляем
                if (!isOnlyFrequentItemsChanged(filterDescription, filterSource)) {
                    const newFilterSourceIsChanged = checkIsChangedFilterSource(
                        filterSource,
                        searchParam
                    );
                    setResetButtonVisibility(
                        getResetButtonVisible(editorsViewMode, newFilterSourceIsChanged)
                    );
                }
            },
            [applyFilterDescription, filterDescription, editorsViewMode, searchParam, context]
        );

        const detailPanelTemplateOptions = React.useMemo(() => {
            return {
                orientation: props.detailPanelOrientation,
                historySaveMode: props.detailPanelHistorySaveMode,
                extendedItemsViewMode: props.detailPanelExtendedItemsViewMode,
                extendedTemplateName: props.detailPanelExtendedTemplateName,
                topTemplate: props.detailPanelTopTemplateName,
                topTemplateOptions: props.detailPanelTopTemplateOptions,
                emptyHistoryTemplate: props.detailPanelEmptyHistoryTemplate,
                width: props.detailPanelWidth,
                filter,
                editorsViewMode,
            };
        }, [
            props.detailPanelWidth,
            props.detailPanelExtendedItemsViewMode,
            props.detailPanelExtendedTemplateName,
            props.detailPanelTopTemplateName,
            props.detailPanelTopTemplateOptions,
            props.detailPanelOrientation,
            props.detailPanelHistorySaveMode,
            props.detailPanelEmptyHistoryTemplate,
            filter,
            editorsViewMode,
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

        React.useEffect(() => {
            if (detailPanelVisible) {
                viewRef.current.openDetailPanel();
            } else {
                viewRef.current.closeDetailPanel();
            }
        }, [detailPanelVisible]);

        return (
            <View
                attrs={attrs}
                className={attrs?.className || props.className}
                ref={setRefs}
                source={filterViewDescription}
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
                readOnly={props.readOnly}
            ></View>
        );
    }
);

FilterConnectedView.defaultProps = {
    editorsViewMode: 'default',
};

export default FilterConnectedView;
