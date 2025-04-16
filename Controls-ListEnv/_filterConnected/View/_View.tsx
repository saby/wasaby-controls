import {
    useCallback,
    useMemo,
    forwardRef,
    ForwardedRef,
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    ReactElement,
} from 'react';
import { IFilterItem, View } from 'Controls/filter';
import { Button } from 'Controls/buttons';
import * as rk from 'i18n!Controls-ListEnv';
import {
    useFilterDescriptionState,
    useFilterDescriptionActions,
    IFilterBase,
    IUseFilterDescription,
    getPropertyFromSlice,
} from 'Controls-ListEnv/filterBase';
import { isEqual } from 'Types/object';
import { logger } from 'Application/Env';
import { IComponentPropsWithReadonly, TFilter } from 'Controls/interface';
import type { IListState, ListSlice } from 'Controls/dataFactory';
import { useAdaptiveMode } from 'UICore/Adaptive';
import { useSelector, useSliceActions } from 'Controls-DataEnv/context';
import { loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';

export interface IFilterViewWidgetOptions extends IFilterBase, IComponentPropsWithReadonly {
    showFilterText?: boolean;
    className?: string;
    filterViewRef?: ForwardedRef<View>;
    detailPanelApplyButtonVisible?: unknown;
}

interface IBaseFilterViewWidgetProps extends IFilterViewWidgetOptions {
    getDetailPanelName?: Function;
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
                (!isEqual(item.value, item.resetValue) &&
                    (item.appliedFrom === 'filterSearch' ||
                        (item.appliedFrom === 'filterPanel' && !idAdaptive))) ||
                item.name === searchParam
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

const FilterConnectedViewSlicesCollector = forwardRef(
    ({ slices, storeIds, ...rest }: IFilterConnectedViewContentProps, ref) => {
        const [currentStoreId, restStoreIds] = useMemo(() => {
            const [firtsId, ...restIds] = storeIds;
            return [firtsId, restIds];
        }, [storeIds]);
        const dispatcher = useSliceActions<ListSlice>(currentStoreId);
        if (currentStoreId && !dispatcher) {
            logger.error('Controls-ListEnv/filter не найден слайс по storeId', currentStoreId);
        }
        const nextSlices = useMemo<Record<string, ListSlice>>(() => {
            if (!dispatcher) {
                return slices;
            }
            return {
                ...slices,
                [currentStoreId]: dispatcher,
            };
        }, [slices, currentStoreId, dispatcher]);

        const shouldStopRecursion = !restStoreIds.length;
        const NextComponent = shouldStopRecursion
            ? FilterConnectedViewContent
            : FilterConnectedViewSlicesCollector;

        return <NextComponent {...rest} slices={nextSlices} storeIds={restStoreIds} ref={ref} />;
    }
);

const FilterConnectedView = forwardRef(
    (props: IBaseFilterViewWidgetProps, ref: ForwardedRef<HTMLElement>) => {
        const storeId = props.storeId;
        const storeIds = useMemo(() => {
            const ids = Array.isArray(storeId) ? storeId : [storeId];
            return ids.filter((id) => id !== undefined && id !== null);
        }, [storeId]);
        const { filterDescription } = useFilterDescriptionState(props);
        const isAdaptiveControl = useAdaptiveMode()?.device.isPhone();
        const filteredFilterDescription = useMemo(() => {
            if (isAdaptiveControl && filterDescription) {
                return filterDescription.filter(({ isAdaptive }: IFilterItem) => {
                    return isAdaptive !== false;
                });
            }
            return filterDescription;
        }, [filterDescription, isAdaptiveControl]);
        const slices = useMemo(() => ({}), []);

        return filteredFilterDescription?.length ? (
            <FilterConnectedViewSlicesCollector
                {...props}
                ref={ref}
                slices={slices}
                storeIds={storeIds}
                filterDescription={filteredFilterDescription}
                // чиню тут https://online.sbis.ru/opendoc.html?guid=f99fdcf3-a700-4a74-92f2-8753d71598a2&client=3
                // но при раскомментировании надо проверить, что не вернётся ошибка
                // https://online.sbis.ru/opendoc.html?guid=f81c73af-0dba-44d7-a41e-b0a5d48d962d&client=3
                // fullFilterDescription={fullFilterDescription}
            />
        ) : (
            <div
                ref={ref as ForwardedRef<HTMLDivElement>}
                className="controls-FilterView-empty"
            ></div>
        );
    }
);

const ExtendedTemplateWithWidgetButton = (props): ReactElement => {
    const ExtendedTemplate = loadSync('Controls/filterPanelExtendedItems:Control');
    const clickHandler = useCallback(() => {
        loadAsync('Controls-ListEnv/filterUtils/createWidgetFromFilter').then(
            ({ createWidgetFromFilter }) => {
                createWidgetFromFilter(props.widgetName, props.dataSetName, props.editingObject);
            }
        );
    }, []);

    const HeadingContentTemplate = useMemo(() => {
        if (props.headingCaption) {
            return (
                <Button
                    viewMode="link"
                    icon="icon-WidgetShop"
                    captionPosition="start"
                    buttonStyle="unaccented"
                    fontColorStyle="label"
                    iconStyle="label"
                    caption={rk('Создать вижджет')}
                    className={'controls-margin_left-m'}
                    onClick={clickHandler}
                />
            );
        }
        return props.headingContentTemplate;
    }, []);

    return (
        <ExtendedTemplate {...props} headingContentTemplate={HeadingContentTemplate} />
    ) as ReactElement;
};

function useGetDetailPanelVisible(storeId: IBaseFilterViewWidgetProps['storeId']): boolean {
    const detailPanelVisibleSelector = useCallback(
        (state: Record<string, IListState> | undefined) => {
            if (!state) {
                return false;
            }
            const ids = !Array.isArray(storeId) ? [storeId] : storeId;
            for (const id of ids) {
                const filterDetailPanelVisible = state[id]?.filterDetailPanelVisible;
                if (filterDetailPanelVisible) {
                    return true;
                }
            }
            return false;
        },
        [storeId]
    );
    const detailPanelVisible = useSelector<Record<string, IListState>, boolean>(
        detailPanelVisibleSelector
    );
    return detailPanelVisible;
}

interface IFilterConnectedViewContentProps extends IBaseFilterViewWidgetProps {
    filterDescription: IUseFilterDescription['filterDescription'];
    fullFilterDescription?: IUseFilterDescription['fullFilterDescription'];
    slices: Record<string, ListSlice>;
    storeIds: string[];
}

const FilterConnectedViewContent = forwardRef(
    (props: IFilterConnectedViewContentProps, ref: ForwardedRef<HTMLElement>): JSX.Element => {
        const { filterDescription, storeId, fullFilterDescription, slices, filterViewRef } = props;
        const { applyFilterDescription, closeDetailPanel } = useFilterDescriptionActions(slices);
        const searchParam = getSearchParam(storeId);
        const isAdaptive = useAdaptiveMode()?.device.isPhone();
        const [filterViewDescription, setFilterViewDescription] = useState(() => {
            updateTextValueVisible(filterDescription, searchParam, isAdaptive);
            return filterDescription;
        });
        const sliceViewMode = getPropertyFromSlice<string>(storeId, 'editorsViewMode');
        const editorsViewMode = useMemo(
            () => sliceViewMode || props.editorsViewMode,
            [props.editorsViewMode, ...Object.values(slices)]
        ) as string;
        const historyId = getPropertyFromSlice<string>(storeId, 'historyId');
        const filter = getPropertyFromSlice<TFilter>(storeId, 'filter');
        const detailPanelVisible = useGetDetailPanelVisible(storeId);

        const viewRef = useRef<View | null>(null);

        useMemo(() => {
            validateProps(storeId);
        }, [storeId]);

        const [resetButtonVisibility, setResetButtonVisibility] = useState(() =>
            initResetButtonVisibility(filterDescription, editorsViewMode, searchParam)
        );

        const isChangedFilterSource = useMemo(() => {
            return checkIsChangedFilterSource(filterDescription, searchParam);
        }, [filterDescription, searchParam]);

        useLayoutEffect(() => {
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

        const detailPanelName = useMemo(() => {
            if (props.detailPanelTemplateName) {
                return props.detailPanelTemplateName;
            }
            return getDetailPanelName(filterDescription);
        }, [filterDescription, props.detailPanelTemplateName]);

        const detailPanelClose = useCallback(() => closeDetailPanel(), [closeDetailPanel]);

        const filterSourceChangedInternal = useCallback(
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
            [applyFilterDescription, filterDescription, editorsViewMode, searchParam]
        );

        const detailPanelTemplateOptions = useMemo(() => {
            return {
                orientation: props.detailPanelOrientation,
                historySaveMode: props.detailPanelHistorySaveMode,
                extendedItemsViewMode: props.detailPanelExtendedItemsViewMode,
                extendedTemplateName:
                    props.widgetName && props.dataSetName
                        ? ExtendedTemplateWithWidgetButton
                        : props.detailPanelExtendedTemplateName,
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
            fullFilterDescription,
        ]);

        const upperfilterViewRef = useMemo(() => {
            if (!filterViewRef) {
                return () => undefined;
            }
            if (typeof filterViewRef === 'function') {
                return filterViewRef;
            }
            return (element: View | null) => {
                filterViewRef.current = element;
            };
        }, [filterViewRef]);

        const setRefs = useCallback(
            (element: View | null) => {
                viewRef.current = element;
                if (upperfilterViewRef) {
                    upperfilterViewRef(element);
                }
            },
            [upperfilterViewRef]
        );

        const attrs = useMemo(() => {
            return {
                ...props.attrs,
                ...props.userAttrs,
            };
        }, [props.attrs, props.userAttrs]);

        useEffect(() => {
            if (detailPanelVisible) {
                viewRef.current?.openDetailPanel();
            } else {
                viewRef.current?.closeDetailPanel();
            }
        }, [detailPanelVisible]);

        return (
            <View
                attrs={attrs}
                className={attrs?.className || props.className}
                ref={setRefs}
                forwardedRef={ref}
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

FilterConnectedView.displayName = 'FilterConnectedView';
FilterConnectedView.defaultProps = {
    editorsViewMode: 'default',
};

export default FilterConnectedView;
