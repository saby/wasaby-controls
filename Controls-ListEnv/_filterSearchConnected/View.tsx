/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import * as rk from 'i18n!Controls-ListEnv';
import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    forwardRef,
    ReactElement,
} from 'react';
import ExtSearchConnected from 'Controls-ListEnv/ExtSearchConnected';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { IFilterItem, resetFilterItem } from 'Controls/filter';
import 'css!Controls-ListEnv/filterSearchConnected';
import { useTheme } from 'UICore/Contexts';
import { IFilterBase, useFilterDescription } from 'Controls-ListEnv/filterBase';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';

interface ISearchProps {
    storeId: string;
    searchFilterNames: string[];
    contrastBackground?: boolean;
}

interface IFilterSearchConnectedViewProps extends ISearchProps, IFilterBase {}

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
 * @extends Controls-ListEnv/filterConnected:View
 *
 * @demo Controls-ListEnv-demo/FilterSearch/View/Index
 * @see Controls/filter:View
 * @see Controls-ListEnv/filterPanelConnected:Widget
 */
function FilterSearchConnectedView(props: IFilterSearchConnectedViewProps, ref) {
    const filterViewRef = useRef(null);
    const theme = useTheme(props);
    const { filterDescription, applyFilterDescription } = useFilterDescription(props);

    const setRefs = useCallback((element) => {
        filterViewRef.current = element;
        if (ref) {
            ref(element);
        }
    }, []);

    return (
        <div
            className={`controls_filter_theme-${theme} tw-flex tw-items-center controls-ListEnv-FilterSearchConnected-searchTemplate`}
        >
            <SearchTemplate
                searchFilterNames={props.searchFilterNames}
                contrastBackground={props.contrastBackground}
                storeId={props.storeId}
                searchParam={props.searchParam}
                filterView={filterViewRef}
                filterDescription={filterDescription}
                emptyText={props.emptyText}
                applyFilterDescription={applyFilterDescription}
            />
            <FilterView
                ref={setRefs}
                storeId={props.storeId}
                filterNames={props.filterNames}
                alignment={props.alignment}
                showFilterText={false}
                detailPanelTemplateName={props.detailPanelTemplateName}
                detailPanelTopTemplateName={props.detailPanelTopTemplateName}
                detailPanelTopTemplateOptions={props.detailPanelTopTemplateOptions}
                panelTemplateName={props.panelTemplateName}
                panelTemplateOptions={props.panelTemplateOptions}
            />
        </div>
    );
}

export default forwardRef(FilterSearchConnectedView);

interface ISearchTemplateProps extends ISearchProps {
    filterDescription: IFilterItem[];
    emptyText?: string;
    filterView?: React.MutableRefObject<null>;
    applyFilterDescription: Function;
}

function SearchTemplate(props: ISearchTemplateProps): ReactElement {
    const searchRef = useRef(null);
    const [isOpened, setIsOpened] = useState(() => false);
    const [searchWidth, setSearchWidth] = useState(null);

    const searchWidthAttrs = useMemo(() => {
        return {
            style: {
                width: searchWidth ? searchWidth + 'px' : 'auto',
            },
        };
    }, [searchWidth]);

    const onSuggestOpen = useCallback(() => {
        setSearchWidth(searchRef.current.clientWidth);
        setIsOpened(true);
    }, [setIsOpened]);
    const onSuggestClose = useCallback(() => {
        setSearchWidth(null);
        setIsOpened(false);
    }, [setIsOpened]);

    const openFilterHandler = useCallback(
        (name, target) =>
            name
                ? props.filterView.current.openFrequentPanel(name, target)
                : props.filterView.current.openDetailPanel(),
        [props.filterView]
    );
    const resetFilterHandler = useCallback(
        (name) => {
            const items = object.clonePlain(props.filterDescription, { processCloneable: false });
            if (name) {
                const item = items.find((filterItem) => filterItem.name === name);
                resetFilterItem(item);
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
        <ExtSearchConnected
            ref={searchRef}
            attrs={searchWidthAttrs}
            className="controls-ListEnv-FilterSearchConnected-searchWidth"
            storeId={props.storeId}
            filterNames={props.searchFilterNames}
            contrastBackground={props.contrastBackground}
            searchParam={props.searchParam}
            rightFieldTemplate={() => (
                <div className="tw-min-w-0 tw-flex tw-items-baseline controls-ListEnv-FilterSearchConnected-RightFieldTemplate">
                    <RightFieldTemplate
                        emptyText={props.emptyText}
                        isOpened={isOpened}
                        filterDescription={props.filterDescription}
                        openFilter={openFilterHandler}
                        resetFilter={resetFilterHandler}
                    />
                </div>
            )}
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
}

function RightFieldTemplate({
    isOpened,
    filterDescription,
    emptyText,
    openFilter,
    resetFilter,
}: IRightFieldTemplateProps): React.ReactElement | null {
    //TODO Перенести всю логику, включая DateMenu
    const filterTitles = useMemo(() => getFilterTitles(filterDescription), [filterDescription]);
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
        return <CloudTemplate onClick={openFilter} onResetFilter={resetFilter} />;
    }

    return (
        <>
            {!isOpened && hasEmptyTextFrequentFilter && isResetFrequentFilters ? (
                <CloudTemplate
                    title={emptyText || 'Все'}
                    name="all_frequent"
                    onClick={openFilter}
                    onResetFilter={resetFilter}
                />
            ) : null}
            {filterTitles?.length
                ? filterTitles.map((filterTitle) => {
                      return (
                          <CloudTemplate
                              title={filterTitle.textValue}
                              name={filterTitle.name}
                              closeButtonVisible={true}
                              onClick={openFilter}
                              onResetFilter={resetFilter}
                          />
                      );
                  })
                : null}
        </>
    );
}

function CloudTemplate(props: {
    name?: string;
    title?: string;
    closeButtonVisible?: boolean;
    onClick: Function;
    onResetFilter: Function;
}): ReactElement {
    const cloudRef = useRef(null);
    const clickHandler = useCallback(() => {
        props.onClick(props.name, props.name ? cloudRef.current : undefined);
    }, [props.name, props.onClick]);

    const resetHandler = useCallback(() => {
        props.onResetFilter(props.name);
    }, [props.name, props.onResetFilter]);

    return (
        <div
            className={`controls-ListEnv-FilterSearchConnected-cloudTemplate controls-ListEnv-FilterSearchConnected-filterText ${
                props.title ? 'controls-ListEnv-FilterSearchConnected-cloudTemplate-padding' : ''
            }`}
            onClick={clickHandler}
        >
            <div
                ref={cloudRef}
                className="controls-ListEnv-FilterSearchConnected-baseline tw-w-full tw-flex tw-items-baseline tw-overflow-hidden"
            >
                {props.title ? (
                    <div
                        title={props.title}
                        className={`tw-truncate controls-fontsize-m ${
                            !props.name ? 'controls-FilterView__filterTextLine' : ''
                        }`}
                    >
                        {props.title}
                    </div>
                ) : (
                    <div
                        className={`icon-FilterNew
                                    tw-inline-flex tw-items-center tw-justify-center
                                    controls-notFocusOnEnter
                                    controls-ListEnv-FilterSearchConnected-cloudTemplate-filterViewIcon`}
                        onMouseDown={clickHandler}
                        data-qa="FilterView__icon"
                        data-name="FilterView__icon"
                    ></div>
                )}
                {props.title && props.closeButtonVisible ? (
                    <div className="controls-ListEnv-FilterSearchConnected-cloudTemplate-crossTemplate controls-margin_left-2xs">
                        <span
                            className="controls-FilterView__iconReset icon-CloseNew"
                            ws-no-focus="true"
                            onMouseDown={resetHandler}
                            title={rk('Сбросить')}
                            data-qa="FilterView__iconReset"
                        ></span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function getFilterTitles(filterDescription: IFilterItem[]): Partial<IFilterItem>[] {
    const config = [];
    const filterButtonTitles: string[] = [];
    filterDescription.forEach((item) => {
        if (!isEqual(item.value, item.resetValue)) {
            if (item.viewMode === 'frequent') {
                config.push({
                    textValue: item.textValue,
                    name: item.name,
                });
            } else if (item.textValue) {
                filterButtonTitles.push(item.textValue);
            }
        }
    });
    if (filterButtonTitles.length) {
        config.push({
            textValue: filterButtonTitles.join(', '),
        });
    }
    return config;
}

function isFilterTextItem(item: IFilterItem): boolean {
    return !isFrequentItem(item) && !isDateItem(item) && item.textValueVisible !== false;
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
