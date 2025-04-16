/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import * as rk from 'i18n!Controls';
import {
    useState,
    useMemo,
    useRef,
    useCallback,
    forwardRef,
    ReactElement,
    MutableRefObject,
    MouseEvent,
    ForwardedRef,
} from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { useAdaptiveMode } from 'UI/Adaptive';
import { FocusRoot } from 'UI/Focus';
import ExtSearchConnected from 'Controls-ListEnv/ExtSearchConnected';
import type ExtSearch from 'Controls-ListEnv/ExtSearch';
import type FilterDateRangeEditorControl from 'Controls/filterDateRangeEditor';
import { ISearchInputOptions } from 'Controls/search';
import { Input } from 'Controls-ListEnv/searchConnected';
import { View as FilterConnectedView } from 'Controls-ListEnv/filterConnected';
import {
    IFilterItem,
    resetFilterItem,
    View as FilterView,
    IFilterItemInternal,
    FilterDescription,
} from 'Controls/filter';
import 'css!Controls-ListEnv/filterSearchConnected';
import { useTheme } from 'UICore/Contexts';
import { IFilterBase, useFilterDescription } from 'Controls-ListEnv/filterBase';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { Feature } from 'Feature/feature';
import {
    IControlProps,
    IContrastBackgroundOptions,
    ISearchOptions,
    ISuggest,
} from 'Controls/interface';
import IFilterSourceItem from 'Controls/_filter/interface/IFilterSourceItemOld';

interface ISearchProps
    extends IContrastBackgroundOptions,
        Pick<ISearchOptions, 'searchParam'>,
        Pick<ISearchInputOptions, 'maxLength'>,
        Pick<ISuggest, 'footerTemplate' | 'suggestWidth'> {
    searchFilterNames: string[];
    storeId: string | string[];
    searchWidth?: number;
    placeholder?: string;
}

interface IFilterSearchConnectedViewProps extends IControlProps, ISearchProps, IFilterBase {}

const FILTER_TEXT_NAME = '__FILTER_TEXT__';

/**
 * Контрол "Поиск с фильтрацией".
 * Контрол состоит из строки поиска и объединенного фильтра.
 * Реализует UI для отображения и редактирования фильтра.
 * Представляет собой строку поиска с кнопкой, при клике по которой выводится список возможных параметров фильтрации.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/filterSearchConnected:View
 * @extends Controls-ListEnv/filterConnected:View
 *
 * @demo Controls-ListEnv-demo/FilterSearch/View/Index
 * @see Controls/filter:View
 * @see Controls-ListEnv/filterPanelConnected:View
 */
function FilterSearchConnectedView(
    props: IFilterSearchConnectedViewProps,
    ref: ForwardedRef<HTMLElement>
) {
    const filterViewRef: MutableRefObject<FilterView | null> = useRef(null);
    const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    const theme = useTheme(props);
    const filterNames = useMemo(
        () =>
            props.filterNames
                ? [...(props.filterNames || []), ...(props.searchFilterNames || [])]
                : void 0,
        [props.filterNames, props.searchFilterNames]
    );
    const { filterDescription, applyFilterDescription } = useFilterDescription({
        storeId: props.storeId,
        filterNames,
    });

    // Если в фильтре только выбор даты, не рисуем кнопку.
    const visibleFilterView = filterDescription.some(
        (item) => !FilterDescription.isFrequentDateRangeItem(item)
    );

    const isFilterSearchFeature = Feature?.get?.(['filter_search_new'])[0];

    const suggestWidth = useMemo(() => {
        if (
            props.suggestWidth &&
            containerRef.current?.offsetWidth &&
            props.suggestWidth > containerRef.current?.offsetWidth
        ) {
            return props.suggestWidth;
        }
    }, [props.suggestWidth, containerRef.current?.offsetWidth]);

    return (
        <div
            ref={containerRef}
            className={`controls_filter_theme-${theme} ${props.className} tw-flex tw-items-center
             controls-ListEnv-FilterSearchConnected controls-ListEnv-FilterSearchConnected-searchTemplate`}
        >
            <FocusRoot ref={ref} autofocus={isFilterSearchFeature} as="div" className="tw-contents">
                <SearchTemplate
                    searchFilterNames={props.searchFilterNames}
                    contrastBackground={props.contrastBackground}
                    storeId={props.storeId}
                    placeholder={props.placeholder}
                    searchParam={props.searchParam}
                    filterView={filterViewRef}
                    filterDescription={filterDescription}
                    footerTemplate={props.footerTemplate}
                    emptyText={props.emptyText}
                    applyFilterDescription={applyFilterDescription}
                    searchWidth={props.searchWidth}
                    suggestWidth={suggestWidth}
                    maxLength={props.maxLength}
                />
            </FocusRoot>
            {visibleFilterView ? (
                <FilterConnectedView
                    filterViewRef={filterViewRef}
                    storeId={props.storeId}
                    filterNames={props.filterNames}
                    alignment={props.alignment}
                    showFilterText={false}
                    detailPanelTemplateName={props.detailPanelTemplateName}
                    detailPanelTopTemplateName={props.detailPanelTopTemplateName}
                    detailPanelTopTemplateOptions={props.detailPanelTopTemplateOptions}
                    detailPanelWidth={props.detailPanelWidth}
                    panelTemplateName={props.panelTemplateName}
                    panelTemplateOptions={props.panelTemplateOptions}
                />
            ) : null}
        </div>
    );
}

export default forwardRef(FilterSearchConnectedView);

interface ISearchTemplateProps extends ISearchProps {
    filterDescription: IFilterItem[];
    emptyText?: string;
    filterView?: MutableRefObject<FilterView | null>;
    applyFilterDescription: Function;
    placeholder?: string;
    maxLength?: ISearchInputOptions['maxLength'];
}

function SearchTemplate(props: ISearchTemplateProps): ReactElement {
    const searchRef = useRef<ExtSearch | HTMLDivElement>(null);
    const [isOpened, setIsOpened] = useState(() => false);
    const [searchWidth, setSearchWidth] = useState<number | null>(null);
    const SearchControl = props.searchFilterNames?.length ? ExtSearchConnected : Input;

    const searchWidthAttrs = useMemo(() => {
        return {
            style: {
                minWidth: (props.searchWidth ?? 0) + 'px',
                width: searchWidth ? searchWidth + 'px' : '100%',
            },
        };
    }, [searchWidth, props.searchWidth]);

    const onSuggestOpen = useCallback(() => {
        if (searchRef.current) {
            setSearchWidth(searchRef.current.clientWidth);
        }
        setIsOpened(true);
    }, [setIsOpened]);
    const onSuggestClose = useCallback(() => {
        setSearchWidth(null);
        setIsOpened(false);
    }, [setIsOpened]);

    const openFilterHandler = useCallback(
        (name: string, target) =>
            name === FILTER_TEXT_NAME
                ? props.filterView?.current?.openDetailPanel()
                : props.filterView?.current?.openFrequentPanel(name, target),
        [props.filterView]
    );
    const resetFilterHandler = useCallback(
        (name) => {
            const items = object.clonePlain(props.filterDescription, { processCloneable: false });
            if (name !== FILTER_TEXT_NAME) {
                const item = items.find((filterItem) => filterItem.name === name);
                if (item) {
                    if (
                        FilterDescription.isFrequentDateRangeItem(item) &&
                        !item.hasOwnProperty('resetValue')
                    ) {
                        resetDateRangeItem(item);
                    }
                    if (item) {
                        resetFilterItem(item);
                    }
                }
            } else {
                items.forEach((filterItem) => {
                    if (isFilterTextItem(filterItem)) {
                        resetFilterItem(filterItem);
                    }
                });
            }
            props.applyFilterDescription(items);
        },
        [props.filterView, props.filterDescription]
    );

    return (
        <SearchControl
            ref={searchRef}
            attrs={searchWidthAttrs}
            className="controls-ListEnv-FilterSearchConnected-searchWidth"
            storeId={props.storeId}
            filterNames={props.searchFilterNames}
            contrastBackground={props.contrastBackground}
            searchParam={props.searchParam}
            suggestWidth={props.suggestWidth}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            // Временная опция, чтобы показать директору новый поиск с голубыми облачками,
            // Если ему зайдём, то будет везде так без опции
            __selectedCollectionAlign={'right'}
            __suggestSearchButtonVisible={true}
            rightFieldTemplate={() => (
                <div className="tw-min-w-0 tw-flex tw-items-baseline controls-ListEnv-FilterSearchConnected-RightFieldTemplate">
                    <RightFieldTemplate
                        emptyText={props.emptyText}
                        isOpened={isOpened}
                        filterDescription={props.filterDescription}
                        openFilter={openFilterHandler}
                        resetFilter={resetFilterHandler}
                        applyFilterDescription={props.applyFilterDescription}
                    />
                </div>
            )}
            footerTemplate={props.footerTemplate}
            searchButtonVisible={false}
            onSuggestOpen={onSuggestOpen}
            onSuggestClose={onSuggestClose}
        />
    );
}

interface IRightFieldTemplateProps {
    isOpened: boolean;
    filterDescription: IFilterItem[];
    emptyText?: string;
    openFilter: Function;
    resetFilter: Function;
    applyFilterDescription: Function;
}

function RightFieldTemplate({
    isOpened,
    filterDescription,
    emptyText,
    openFilter,
    resetFilter,
    applyFilterDescription,
}: IRightFieldTemplateProps): ReactElement | null {
    const isAdaptive = useAdaptiveMode().device.isPhone();

    const filterTitles = useMemo(
        () => getFilterTitles(filterDescription, isAdaptive),
        [filterDescription, isAdaptive]
    );
    const dateRangeItem = useMemo(
        () => filterDescription.find((item) => FilterDescription.isFrequentDateRangeItem(item)),
        [filterDescription]
    );

    const dateRangeValueHandler = useCallback(
        ({ value, textValue, viewMode }) => {
            const filterDescriptionCloned = filterDescription.map((item) => {
                if (dateRangeItem?.name === item.name) {
                    return {
                        ...item,
                        value,
                        textValue,
                        viewMode,
                    };
                }
                return item;
            });
            applyFilterDescription(filterDescriptionCloned);
        },
        [dateRangeItem, applyFilterDescription]
    );

    const filterDateRangeProps = useMemo(() => {
        return {
            dateRangeItem,
            dateRangeValueHandler,
        };
    }, [dateRangeItem, dateRangeValueHandler]);

    const hasEmptyTextFrequentFilter = useMemo(
        () =>
            filterDescription.some(
                ({ viewMode }) => viewMode === 'basic' || viewMode === 'extended'
            ) && filterDescription.some(({ viewMode }) => viewMode === 'frequent'),
        [filterDescription]
    );

    const isResetFrequentFilters = useMemo(
        () =>
            filterDescription.every(
                ({ viewMode, value, resetValue }) => viewMode !== 'frequent' || value === resetValue
            ),
        [filterDescription]
    );

    if (isOpened && filterTitles?.length) {
        return (
            <CloudTemplate
                onClick={openFilter}
                name={FILTER_TEXT_NAME}
                onResetFilter={resetFilter}
            />
        );
    }

    return (
        <>
            {!isAdaptive && !isOpened && hasEmptyTextFrequentFilter && isResetFrequentFilters ? (
                <CloudTemplate
                    title={emptyText || rk('Все')}
                    name="all_frequent"
                    onClick={openFilter}
                    onResetFilter={resetFilter}
                />
            ) : null}
            {dateRangeItem ? (
                <CloudTemplate
                    key={dateRangeItem.name}
                    name={dateRangeItem.name}
                    title={dateRangeItem.name}
                    closeButtonVisible={
                        !isEqual(dateRangeItem.value, dateRangeItem.resetValue) &&
                        !!dateRangeItem.resetValue
                    }
                    onResetFilter={resetFilter}
                    contentTemplate={FilterDateRange}
                    contentTemplateProps={filterDateRangeProps}
                />
            ) : null}
            {filterTitles?.length
                ? filterTitles.map((filterTitle) => {
                      return (
                          <CloudTemplate
                              key={filterTitle.name}
                              title={filterTitle.textValue}
                              name={filterTitle.name}
                              closeButtonVisible={filterTitle.closeButtonVisible}
                              onClick={openFilter}
                              onResetFilter={resetFilter}
                          />
                      );
                  })
                : null}
        </>
    );
}

function FilterDateRange({
    dateRangeItem,
    dateRangeValueHandler,
}: {
    dateRangeItem: IFilterItemInternal;
    dateRangeValueHandler: Function;
}) {
    const FilterDateRangeEditor = loadSync(
        'Controls/filterDateRangeEditor'
    ) as typeof FilterDateRangeEditorControl;
    return (
        <FilterDateRangeEditor
            {...dateRangeItem.editorOptions}
            fontWeight="default"
            value={dateRangeItem.value as [Date, Date]}
            type={dateRangeItem.type}
            editorTemplateName={dateRangeItem.editorTemplateName}
            validateValueBeforeChange={true}
            onPropertyValueChanged={dateRangeValueHandler}
            fontColorStyle="filterViewCloud"
            resetStartValue={void 0}
            resetEndValue={void 0}
        />
    );
}

interface ICloudTemplateProps {
    name?: string;
    title?: string;
    closeButtonVisible?: boolean;
    contentTemplate?: Function;
    contentTemplateProps?: Record<string, unknown>;
    onClick?: Function;
    onResetFilter: Function;
}

function CloudTemplate(props: ICloudTemplateProps): ReactElement {
    const cloudRef = useRef(null);
    const clickHandler = useCallback(
        (event) => {
            props.onClick?.(props.name, event?.currentTarget);
        },
        [props.name, props.onClick]
    );

    const resetHandler = useCallback(
        (e: MouseEvent) => {
            props.onResetFilter(props.name);
            e.stopPropagation();
        },
        [props.name, props.onResetFilter]
    );

    const paddingClassName = props.title
        ? `controls-padding_left-s ${
              props.closeButtonVisible
                  ? 'controls-ListEnv-FilterSearchConnected-cloudTemplate-paddingRight'
                  : ' controls-padding_right-s'
          }`
        : '';

    return (
        <div
            className={`controls-ListEnv-FilterSearchConnected-cloudTemplate controls-ListEnv-FilterSearchConnected-filterText
             ${
                 props.name === FILTER_TEXT_NAME
                     ? 'controls-FilterView__filterTextLine'
                     : 'tw-flex-shrink'
             } ${
                 props.name === FILTER_TEXT_NAME && props.title
                     ? 'controls-ListEnv-FilterSearchConnected__filterTextLine-minWidth'
                     : ''
             } ${paddingClassName}`}
            onClick={clickHandler}
        >
            <div
                ref={cloudRef}
                className="js-controls-FilterView__target tw-w-full tw-flex tw-items-center tw-overflow-hidden"
            >
                <CloudContentTemplate {...props} />
                {props.title && props.closeButtonVisible ? (
                    <div className="controls-ListEnv-FilterSearchConnected-cloudTemplate-crossTemplate-hover ">
                        <div className="controls-ListEnv-FilterSearchConnected-cloudTemplate-crossTemplate">
                            <span
                                className="controls-FilterView__iconReset icon-Close"
                                ws-no-focus="true"
                                onClick={resetHandler}
                                title={rk('Сбросить')}
                                data-qa="FilterView__iconReset"
                            ></span>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function CloudContentTemplate(
    props: Pick<
        ICloudTemplateProps,
        'title' | 'closeButtonVisible' | 'contentTemplate' | 'contentTemplateProps' | 'onClick'
    >
) {
    if (props.contentTemplate) {
        return <props.contentTemplate {...props.contentTemplateProps} />;
    } else if (props.title) {
        return (
            <div
                title={props.title}
                className={`tw-truncate controls-fontsize-m ${
                    props.closeButtonVisible
                        ? 'controls-ListEnv-FilterSearchConnected-cloudTemplate-marginRight'
                        : ''
                }`}
            >
                {props.title}
            </div>
        );
    } else {
        return (
            <div
                className={`icon-FilterNew
                                    tw-inline-flex tw-items-center tw-justify-center
                                    controls-notFocusOnEnter
                                    controls-ListEnv-FilterSearchConnected-cloudTemplate-filterViewIcon`}
                data-qa="FilterView__icon"
                data-name="FilterView__icon"
            ></div>
        );
    }
}

interface IFilterTitle extends Pick<IFilterItem, 'name' | 'textValue'> {
    closeButtonVisible: boolean;
}

function getFilterTitles(
    filterDescription: IFilterItemInternal[],
    isAdaptive?: boolean
): IFilterTitle[] {
    const config = [];
    const filterButtonTitles: string[] = [];
    filterDescription.forEach((item) => {
        const { name, value, resetValue, textValue, visibility, viewMode, appliedFrom, type } =
            item;
        const isValueChanged = !isEqual(value, resetValue);
        if (
            (isValueChanged || type === 'dateMenu') &&
            visibility !== false &&
            appliedFrom !== 'filterPanel' &&
            !FilterDescription.isFrequentDateRangeItem(item)
        ) {
            if (viewMode === 'frequent') {
                if (!isAdaptive) {
                    config.push({
                        textValue: getTextValue(item),
                        name,
                        closeButtonVisible: isValueChanged,
                    });
                }
            } else if (textValue) {
                filterButtonTitles.push(textValue);
            }
        }
    });
    if (filterButtonTitles.length) {
        config.push({
            name: FILTER_TEXT_NAME,
            textValue: filterButtonTitles.join(', '),
            closeButtonVisible: true,
        });
    }
    return config;
}

function getTextValue(item: IFilterSourceItem): string | void {
    if (item.type === 'dateMenu') {
        return item.textValue || (item.editorOptions?.emptyCaption as string) || item.emptyText;
    }
    return item.textValue;
}

function resetDateRangeItem(item: IFilterItemInternal): void {
    item.value = [item.editorOptions?.resetStartValue, item.editorOptions?.resetEndValue];
    item.textValue = '';
}

function isFilterTextItem(item: IFilterItemInternal): boolean {
    return (
        !isFrequentItem(item) &&
        !isDateItem(item) &&
        (item.textValueVisible !== false || item.appliedFrom === 'filterSearch')
    );
}

function isFrequentItem(item: IFilterItem): boolean {
    return item.viewMode === 'frequent' && !isDateItem(item);
}

function isDateItem(item: IFilterItem): boolean {
    return item.type === 'dateRange' || item.type === 'date' || item.type === 'dateMenu';
}

/**
 * @name Controls-ListEnv/filterSearchConnected:View#searchFilterNames
 * @cfg {String[]} {@link Controls/filter:IFilterItem#name Имена} параметров фильтра, которые будут доступны для отображения и редактирования в строке поиска.
 */

/**
 * @name Controls-ListEnv/filterSearchConnected:View#detailPanelOrientation
 * @cfg {String} Определяет ориентацию окна фильтров.
 * @variant vertical Вертикальная ориентация панели. Блок истории отображается внизу.
 * @variant horizontal Горизонтальная ориентация панели. Блок истории отображается справа.
 * @default vertical
 * @remark
 * Если указано значение "horizontal", но на панели нет истории фильтрации, контрол будет отображаться в одном столбце.
 * @example
 * В данном примере панель будет отображаться в две колонки.
 * <pre class="brush: html; highlight: [3]">
 * <Controls-ListEnv.filterConnected:View
 *    storeId="reports"
 *    detailPanelOrientation="horizontal"/>
 * </pre>
 */
