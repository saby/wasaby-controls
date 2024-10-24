import * as React from 'react';
import { IFilterItem, View } from 'Controls/filter';
import {
    useFilterDescription,
    IFilterBase,
    IUseFilterDescription,
    getSlices,
    getPropertyFromSlice,
} from 'Controls-ListEnv/filterBase';
import { isEqual } from 'Types/object';
import { logger } from 'Application/Env';
import { TFilter } from 'Controls/interface';
import { DataContext } from 'Controls-DataEnv/context';
import { useAdaptiveMode } from 'UICore/Adaptive';

export interface IFilterViewWidgetOptions extends IFilterBase {
    showFilterText?: boolean;
}

interface IBaseFilterViewWidgetProps extends IFilterViewWidgetOptions {
    getDetailPanelName?: Function;
    className?: string;
}

const customEvents = ['onItemsChanged', 'onDetailPanelClose'];

function validateProps(storeId?: string | string[]): void {
    if (storeId === undefined) {
        logger.error(
            'Для работы контрола Controls-ListEnv/filterConnected:View необходимо указать опцию storeId'
        );
    }
}

function getDetailPanelName(filterSource: IFilterItem[]): string {
    const showFiltersPopup = !!filterSource.find(({ viewMode, window }) => {
        const filterViewMode = window?.viewMode || viewMode;
        return filterViewMode === 'basic' || filterViewMode === 'extended';
    });
    return showFiltersPopup ? 'Controls/filterPanelPopup:Sticky' : '';
}

function getSearchParam(storeId: string | string[]): string {
    return getPropertyFromSlice<string>(storeId, 'searchParam');
}

function updateTextValueVisible(
    filterSource: IFilterItem[],
    searchParam: string,
    idAdaptive: boolean
): void {
    filterSource.forEach((item) => {
        if ((item.appliedFrom && item.viewMode !== 'frequent') || item.name === searchParam) {
            item.textValueVisible = !(
                !isEqual(item.value, item.resetValue) &&
                (item.appliedFrom === 'filterSearch' ||
                    (item.appliedFrom === 'filterPanel' && !idAdaptive) ||
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
    const { filterDescription, applyFilterDescription, fullFilterDescription } =
        useFilterDescription(props);
    const isAdaptiveControl = useAdaptiveMode()?.device.isPhone();
    const filteredFilterDescription = React.useMemo(() => {
        if (isAdaptiveControl && filterDescription) {
            return filterDescription.filter(({isAdaptive}: IFilterItem) => {return isAdaptive !== false});
        }
        return filterDescription;
    }, [filterDescription, isAdaptiveControl]);

    return filteredFilterDescription?.length ? (
        <FilterConnectedViewContent
            {...props}
            ref={ref}
            filterDescription={filteredFilterDescription}
            // чиню тут https://online.sbis.ru/opendoc.html?guid=f99fdcf3-a700-4a74-92f2-8753d71598a2&client=3
            // но при раскомментировании надо проверить, что не вернётся ошибка
            // https://online.sbis.ru/opendoc.html?guid=f81c73af-0dba-44d7-a41e-b0a5d48d962d&client=3
            // fullFilterDescription={fullFilterDescription}
            applyFilterDescription={applyFilterDescription}
        />
    ) : (
        <div ref={ref} className={'controls-FilterView-empty'}></div>
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
        const { filterDescription, applyFilterDescription, storeId, fullFilterDescription } = props;
        const searchParam = getSearchParam(storeId);
        const isAdaptive = useAdaptiveMode()?.device.isPhone();
        const [filterViewDescription, setFilterViewDescription] = React.useState(() => {
            updateTextValueVisible(filterDescription, searchParam, isAdaptive);
            return filterDescription;
        });
        const context = React.useContext(DataContext);
        const slices = getSlices(storeId);
        const sliceViewMode = getPropertyFromSlice<string>(storeId, 'editorsViewMode');
        const editorsViewMode = React.useMemo(
            () => sliceViewMode || props.editorsViewMode,
            [props.editorsViewMode, slices[storeId]]
        );
        const historyId = getPropertyFromSlice<string>(storeId, 'historyId');
        const filter = getPropertyFromSlice<TFilter>(storeId, 'filter');
        const detailPanelVisible = getDetailPanelVisible(storeId);

        const viewRef = React.useRef(null);

        React.useMemo(() => {
            validateProps(storeId);
        }, [storeId]);

        const [resetButtonVisibility, setResetButtonVisibility] = React.useState(() =>
            initResetButtonVisibility(filterDescription, editorsViewMode, searchParam)
        );

        const isChangedFilterSource = React.useMemo(() => {
            return checkIsChangedFilterSource(filterDescription, searchParam);
        }, [filterDescription, searchParam]);

        React.useLayoutEffect(() => {
            updateTextValueVisible(filterDescription, searchParam, isAdaptive);
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
        }, [editorsViewMode, filterDescription, searchParam, isAdaptive]);

        const detailPanelName = React.useMemo(() => {
            if (props.detailPanelTemplateName) {
                return props.detailPanelTemplateName;
            }
            return getDetailPanelName(filterDescription);
        }, [filterDescription, props.detailPanelTemplateName]);

        const detailPanelClose = React.useCallback(() => {
            Object.keys(slices).forEach((storeId) => {
                if (typeof slices[storeId].closeFilterDetailPanel === 'function') {
                    slices[storeId].closeFilterDetailPanel();
                } else {
                    slices[storeId].setState({
                        filterDetailPanelVisible: false,
                    });
                }
            });
        }, [slices, props.storeId, context]);

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
                applyButtonVisible: props.detailPanelApplyButtonVisible,
                width: props.detailPanelWidth,
                filter,
                fullFilterDescription,
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
            props.detailPanelApplyButtonVisible,
            filter,
            editorsViewMode,
            fullFilterDescription,
        ]);

        const setRefs = React.useCallback((element) => {
            viewRef.current = element;
            if (ref) {
                ref(element);
            }
        }, []);

        const attrs = React.useMemo(() => {
            return {
                ...props.attrs,
                ...props.userAttrs,
            };
        }, [props.attrs, props.userAttrs]);

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
