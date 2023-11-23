/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { withWasabyEventObject } from 'UI/Events';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Date as WSDate } from 'Types/entity';
import { debounce } from 'Types/function';
import { Base as BaseSource } from 'Types/source';
import { TemplateFunction } from 'UI/Base';
import { TInternalProps } from 'UICore/Executor';
import { detection } from 'Env/Env';
import { IMonthListSource, IMonthListSourceOptions } from './interfaces/IMonthListSource';
import { IMonthList, IMonthListOptions } from './interfaces/IMonthList';
import {
    IMonthListVirtualPageSize,
    IMonthListVirtualPageSizeOptions,
} from './interfaces/IMonthListVirtualPageSize';
import ExtDataModel from './MonthList/ExtDataModel';
import MonthsSource from './MonthList/MonthsSource';
import monthListUtils from './MonthList/Utils';
import ITEM_TYPES from './MonthList/ItemTypes';
import {
    IDateConstructor,
    IDateConstructorOptions,
    IControlProps,
    IDisplayedRanges,
    IDisplayedRangesOptions,
    TDisplayedRangesItem,
    INavigationOptionValue as INavigation,
    INavigationPositionSourceConfig,
} from 'Controls/interface';
import { IntersectionObserverSyntheticEntry, scrollToElement } from 'Controls/scroll';
import { error, NewSourceController } from 'Controls/dataSource';
import { IntersectionObserverController, Container as ScrollContainer } from 'Controls/scroll';
import { IVirtualScrollConfig } from 'Controls/list';
import { Base as dateUtils } from 'Controls/dateUtils';
import { getDimensions } from 'Controls/sizeUtils';
import { IRowProps, IColumnConfig, ICellProps } from 'Controls/gridReact';
import { View as GridView } from 'Controls/grid';
import 'Controls/gridReact';
import MonthListColumnRender from './MonthList/MonthListColumnRender';
import MonthTemplate from './MonthList/MonthTemplate';
import YearTemplate from './MonthList/YearTemplate';
import { ErrorViewMode, ErrorViewConfig, ErrorController } from 'Controls/error';
import { date as formatDate } from 'Types/formatter';
import { RecordSet } from 'Types/collection';

interface IMonthListOptions
    extends TInternalProps,
        IControlProps,
        IMonthListSourceOptions,
        IMonthListOptions,
        IMonthListVirtualPageSizeOptions,
        IDisplayedRangesOptions,
        IDateConstructorOptions {}

const ITEM_BODY_SELECTOR = {
    day: '.controls-MonthViewVDOM__item_currentMonthDay',
    month: '.controls-MonthViewVDOM',
    year: '.controls-MonthList__year-months',
    mainTemplate: '.controls-MonthList__template',
    custom: '.controls-MonthList__custom-position',
};

enum VIEW_MODE {
    month = 'month',
    year = 'year',
    custom = 'custom'
}

const SCALE_ROUNDING_ERROR_FIX = 1.5;

const ENRICH_ITEMS_DELAY = 200;

const ITEM_DATA_LOAD_RATIO = 0.1;

// события, которые надо спроксировать ниже
const EVENTS_TO_PROXY = ['onMouseEnter', 'onMouseLeave', 'onWheel', 'onTouchMove'];
const INTERSECT_CUSTOM_EVENTS = ['onIntersect'];
const SCROLL_CUSTOM_EVENTS = ['onScrollStateChanged', 'onCustomscroll'];
const LIST_CUSTOM_EVENTS = ['onDrawItems', 'onMarkedKeyChanged', 'onItemClick'];

/**
 * Прокручивающийся список с месяцами. Позволяет выбирать период.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_calendar.less переменные тем оформления}
 *
 * @class Controls/_calendar/MonthList
 * @extends UI/Base:Control
 * @mixes Controls/calendar:IMonthListSource
 * @implements Controls/interface:IDayTemplate
 *
 * @public
 * @demo Controls-demo/Date/MonthList
 */
class MonthList
    extends React.Component<IMonthListOptions>
    implements
        IMonthListSource,
        IMonthList,
        IMonthListVirtualPageSize,
        IDateConstructor,
        IDisplayedRanges
{
    readonly '[Controls/_calendar/interface/IMonthListSource]': boolean = true;
    readonly '[Controls/_calendar/interface/IMonthList]': boolean = true;
    readonly '[Controls/_calendar/interface/IMonthListVirtualPageSize]': boolean = true;
    readonly '[Controls/_interface/IDateConstructor]': boolean = true;
    readonly '[Controls/_interface/IDisplayedRanges]': boolean = true;
    readonly '[Controls/_interface/IDayTemplate]': boolean = true;

    protected _viewSource: BaseSource;
    protected _sourceController: NewSourceController;
    private _startPositionId: string;
    private _positionToScroll: Date;
    private _displayedPosition: Date;
    private _lastPositionFromOptions: Date;

    private _itemTemplate: TemplateFunction;
    private _itemHeaderTemplate: TemplateFunction;

    private _lastNotifiedPositionChangedDate: Date;

    private _displayedDates: number[] = [];
    private _extData: ExtDataModel;
    private _extDataLastVersion: number;

    private _scrollTop: number = 0;

    private readonly _scrollRef: React.Ref<ScrollContainer>;
    private readonly _listRef: React.Ref<GridView>;
    private _container: Element;

    protected _topShadowVisibility: string;
    protected _bottomShadowVisibility: string;

    private _enrichItemsDebounced: Function;

    private _columns: IColumnConfig[];
    private _navigation: INavigation<INavigationPositionSourceConfig>;
    protected _virtualPageSize: number;
    protected _virtualScrollConfig: IVirtualScrollConfig;
    protected _errorViewConfig: ErrorViewConfig;
    protected _threshold: number[] = [0, 0.01, ITEM_DATA_LOAD_RATIO, 0.99, 1];
    private _errorController: ErrorController = new ErrorController({});

    protected _hasStartOrEndValue: boolean;

    private _shouldPositionBelow: boolean = false;

    constructor(props: IMonthListOptions) {
        super(props);
        this._scrollRef = React.createRef();
        this._listRef = React.createRef();
        // Если в календаре нет работы с startValue или endValue, будем использовать обычный шаблон, вместо контрола
        this._hasStartOrEndValue =
            props.hasOwnProperty('startValue') || props.hasOwnProperty('endValue');

        const now = new WSDate();
        let position = props.position;

        if (!position) {
            position =
                props.viewMode !== VIEW_MODE.month
                    ? dateUtils.getStartOfYear(now)
                    : dateUtils.getStartOfMonth(now);
        }

        const normalizedPosition = this._normalizeDate(position, props.viewMode);

        this._enrichItemsDebounced = debounce(this._enrichItems, ENRICH_ITEMS_DELAY);

        this._updateItemTemplate(props);
        this._updateVirtualPageSize(props);
        this._startPositionId = monthListUtils.dateToId(normalizedPosition);
        this._shouldPositionBelow = this._getShouldPositionBelow(
            position,
            props.shouldPositionBelow
        );
        this._positionToScroll = position;
        this._displayedPosition = position;
        this._lastNotifiedPositionChangedDate = normalizedPosition;
        this._updateSource(props);
        this._updateColumns(this.props);
        this._updateNavigation(this.props);

        const topShadowVisibility =
            props.topShadowVisibility ||
            this._calculateInitialShadowVisibility(props.displayedRanges, 'top');
        const bottomShadowVisibility =
            props.bottomShadowVisibility ||
            this._calculateInitialShadowVisibility(props.displayedRanges, 'bottom');
        this._updateShadowVisibility(topShadowVisibility, bottomShadowVisibility);

        if (this._extData && props.source && props.source.getInitialData) {
            this._extData.updateInitialData();
        }

        this._refCallback = this._refCallback.bind(this);
        this._intersectHandler = this._intersectHandler.bind(this);
        this._scrollStateChangedHandler = this._scrollStateChangedHandler.bind(this);
        this._scrollHandler = this._scrollHandler.bind(this);
        this._drawItemsHandler = this._drawItemsHandler.bind(this);
        this._onMarkedKeyChanged = withWasabyEventObject(this._onMarkedKeyChanged.bind(this));
        this._getRowProps = this._getRowProps.bind(this);
    }

    componentDidMount() {
        if (this.props.displayedRanges) {
            // Если период отображения месяцев ограничен - сбрасываем тени, чтобы при достижении края тень пропала.
            const topShadowVisibility = this.props.topShadowVisibility || 'auto';
            const bottomShadowVisibility = this.props.bottomShadowVisibility || 'auto';
            this._updateShadowVisibility(topShadowVisibility, bottomShadowVisibility);
        }

        // загружаем данные для extData, если их не передали снаружи
        if (this._extData && (this.props.source && !this.props.source.getInitialData || this.props.holidaysGetter)) {
            const displayedDates = this._getDisplayedRanges(
                this._lastNotifiedPositionChangedDate,
                this.props.virtualPageSize,
                this.props.viewMode
            );
            this._extData.enrichItems(displayedDates).catch((error: Error) => {
                return this._errorHandler(error);
            });
        }
    }

    shouldComponentUpdate(props: IMonthListOptions): boolean {
        this._updateShadowVisibility(props.topShadowVisibility, props.bottomShadowVisibility);

        this._updateItemTemplate(props);
        const sourceUpdated = this._updateSource(props, this.props);
        if (sourceUpdated) {
            this._enrichItems();
        }
        this._updateVirtualPageSize(props, this.props);
        // Сравниваем по ссылке, а не по значению. position обновляется только при смене года или если
        // напрямую менять position через опцию. Таким обзразом, если мы попробуем подскролить календарь к дате, которую
        // устанавливали через опцию ранее, значения окажутся одинаковыми и подскролла не произайдет.
        // В то же время ссылки окажутся разыми
        if (props.position !== this._displayedPosition) {
            // Не инициализируем перестроение списка пока не завершится пребыбущая перерисовка.
            // https://online.sbis.ru/opendoc.html?guid=4c2ee6ae-c41d-4bc2-97e7-052963074621
            if (!this._lastPositionFromOptions) {
                this._displayedPosition = props.position;
                // Обновляем _lastPositionFromOptions перед вызовом _scrollToPosition потому что
                // если элемент уже отрисован, то подскол может произойти синхронно.
                // В этом случае _lastPositionFromOptions обнулиться сразу же.
                this._lastPositionFromOptions = props.position;
                this._scrollToPosition(props.position);
            } else {
                this._lastPositionFromOptions = props.position;
            }
        }

        if (
            this.props.stubTemplate !== props.stubTemplate ||
            this.props.dayHeaderTemplate !== props.dayHeaderTemplate ||
            this.props.dayTemplate !== props.dayTemplate ||
            this.props.monthTemplate !== props.monthTemplate ||
            this.props.monthProps !== props.monthProps ||
            this.props.monthHeaderTemplate !== props.monthHeaderTemplate ||
            this.props.yearTemplate !== props.yearTemplate ||
            this.props.yearHeaderTemplate !== props.yearHeaderTemplate ||
            this.props.startValue !== props.startValue ||
            this.props.endValue !== props.endValue ||
            this.props.newMode !== props.newMode ||
            this.props.viewMode !== props.viewMode
        ) {
            this._updateColumns(props);
        }

        if (this.props._limit !== props._limit) {
            this._updateNavigation(props);
        }

        return true;
    }

    protected componentDidUpdate() {
        const newVersion = this._extData.getVersion();
        if (this._extDataLastVersion !== newVersion) {
            this._extDataLastVersion = newVersion;
            this.props.onEnrichItems?.();
        }
    }

    private _updateShadowVisibility(
        topShadowVisibility: string,
        bottomShadowVisibility: string
    ): void {
        if (this._topShadowVisibility !== topShadowVisibility) {
            this._topShadowVisibility = topShadowVisibility;
        }
        if (this._bottomShadowVisibility !== bottomShadowVisibility) {
            this._bottomShadowVisibility = bottomShadowVisibility;
        }
    }

    protected _getShouldPositionBelow(position: Date, shouldPositionBelow: boolean): boolean {
        if (!shouldPositionBelow) {
            return false;
        }
        return position.getFullYear() >= new Date().getFullYear();
    }

    protected _drawItemsHandler(): void {
        // Подскроливаем к нужной позиции только если не меняли позицию через опции пока список перерисовывался.
        // Иначе перерисовываем список по самой последней позиции установленной через опции.
        // https://online.sbis.ru/opendoc.html?guid=4c2ee6ae-c41d-4bc2-97e7-052963074621
        if (+this._displayedPosition === +this._lastPositionFromOptions) {
            this._updateScrollAfterViewModification();
            this._lastPositionFromOptions = null;
        } else if (this._lastPositionFromOptions) {
            this._displayedPosition = this._lastPositionFromOptions;
            this._scrollToPosition(this._displayedPosition);
        }
    }

    protected _onMarkedKeyChanged(event: SyntheticEvent, markedKey: string): void {
        this.props.onMarkedKeyChanged?.(event, markedKey);
    }

    private _getDisplayedRanges(
        position: Date,
        virtualPageSize: number,
        viewMode: string
    ): number[] {
        const displayedRanges = [];
        if (viewMode !== VIEW_MODE.month) {
            virtualPageSize *= 12;
        }
        for (let i = 0; i < virtualPageSize; i++) {
            displayedRanges.push(
                Date.parse(new Date(position.getFullYear(), position.getMonth() + i))
            );
        }
        return displayedRanges;
    }

    private _calculateInitialShadowVisibility(
        displayedRanges: TDisplayedRangesItem[],
        shadowPosition: string
    ): string {
        // Если мы стоим на краю (первом или последнем элементе) отключим тени при инициализации
        if (displayedRanges) {
            const displayedRangesLastElementIndex = displayedRanges.length - 1;
            const displayedRangesItem =
                shadowPosition === 'top'
                    ? displayedRanges[0][0]
                    : displayedRanges[displayedRangesLastElementIndex][1];

            if (dateUtils.isDatesEqual(this._displayedPosition, displayedRangesItem)) {
                return 'auto';
            }
        }
        return 'visible';
    }

    private _updateItemTemplate(props: IMonthListOptions): void {
        this._itemHeaderTemplate =
            props.viewMode !== VIEW_MODE.month
                ? props.yearHeaderTemplate
                : props.monthHeaderTemplate;

        this._itemTemplate = this._getItemTemplate(props);
    }

    private _getItemTemplate(props: IMonthListOptions): TemplateFunction {
        if (props.viewMode === VIEW_MODE.year) {
            return props.yearTemplate;
        } else if (props.viewMode === VIEW_MODE.month) {
            return props.monthTemplate;
        }
        return props.customTemplate;
    }

    private _updateSource(props: IMonthListOptions, oldProps?: IMonthListOptions): boolean {
        if (
            !oldProps ||
            props.viewMode !== oldProps.viewMode ||
            props.order !== oldProps.order ||
            props.displayedRanges !== oldProps.displayedRanges
        ) {
            const source = new MonthsSource({
                header: Boolean(this._itemHeaderTemplate),
                dateConstructor: props.dateConstructor,
                displayedRanges: props.displayedRanges,
                viewMode: props.viewMode,
                amountOfCustomItems: props.amountOfCustomItems,
                order: props.order,
                stubTemplate: props.stubTemplate,
            });
            this._viewSource = source;
            const now = new WSDate();
            let position = props.position;

            if (!position) {
                position =
                    props.viewMode !== VIEW_MODE.month
                        ? dateUtils.getStartOfYear(now)
                        : dateUtils.getStartOfMonth(now);
            }

            let normalizedPosition = this._normalizeDate(position, props.viewMode);
            if (this._shouldPositionBelow) {
                if (props.viewMode !== VIEW_MODE.month) {
                    normalizedPosition = new Date(
                        normalizedPosition.getFullYear() - 1,
                        normalizedPosition.getMonth(),
                        normalizedPosition.getDate()
                    );
                } else {
                    normalizedPosition = new Date(
                        normalizedPosition.getFullYear(),
                        normalizedPosition.getMonth() - 1,
                        normalizedPosition.getDate()
                    );
                }
            }
            const data = this._viewSource.getItemsData(this._virtualPageSize, normalizedPosition);
            const items = new RecordSet({
                rawData: data.items,
                keyProperty: 'id',
            });
            items.setMetaData({
                total: {
                    before: data.hasBeforeItems,
                    after: Boolean(data.month),
                },
                more: {
                    before: data.hasBeforeItems,
                    after: Boolean(data.month),
                },
            });
            this._sourceController = new NewSourceController({
                keyProperty: 'id',
                source,
                items,
                navigation: {
                    source: 'position',
                    view: 'infinity',
                    sourceConfig: {
                        position: this._startPositionId,
                        direction: 'bothways',
                        field: 'id',
                        limit: props._limit,
                    },
                },
            });
        }
        if (
            !oldProps ||
            props.viewMode !== oldProps.viewMode ||
            props.source !== oldProps.source ||
            props.filter !== oldProps.filter ||
            props.holidaysGetter !== oldProps.holidaysGetter
        ) {
            this._extData = new ExtDataModel({
                viewMode: props.viewMode,
                source: props.source,
                dateConstructor: props.dateConstructor,
                filter: props.filter,
                holidaysGetter: props.holidaysGetter,
                onUpdateDataCallback: (isInitial: boolean) => {
                    // чтобы список перерисовал записи, обновляем колонки(они зависят от _extData)
                    // и вызываем перерисовку
                    // при этом ничего не делаем для изначальной инициализации,
                    // т.к. она происходит в момент первого построения
                    if (!isInitial) {
                        this._updateColumns(this.props);
                        this.forceUpdate();
                    }
                },
            });
            this._extDataLastVersion = this._extData.getVersion();
            return true;
        }
        return false;
    }

    private _updateColumns(props: IMonthListOptions): void {
        this._columns = [
            {
                key: 'month',
                width: '100%',
                render: (
                    <MonthListColumnRender
                        hasStartOrEndValue={this._hasStartOrEndValue}
                        itemHeaderTemplate={this._itemHeaderTemplate}
                        itemTemplate={this._itemTemplate}
                        extData={this._extData}
                        formatMonth={this._formatMonth}
                        getMonth={this._getMonth}
                        dateToDataString={this._dateToDataString}
                        stubTemplate={props.stubTemplate}
                        dayHeaderTemplate={props.dayHeaderTemplate}
                        dayTemplate={props.dayTemplate}
                        monthTemplate={props.monthTemplate}
                        monthProps={props.monthProps}
                        startValue={props.startValue}
                        endValue={props.endValue}
                        newMode={props.newMode}
                        viewMode={props.viewMode}
                    />
                ),
                getCellProps: (): ICellProps => {
                    return {
                        padding: {
                            left: 'null',
                            right: 'null',
                        },
                        valign: 'top',
                    };
                },
            },
        ];
    }

    private _updateNavigation(props: IMonthListOptions): void {
        this._navigation = {
            source: 'position',
            view: 'infinity',
            sourceConfig: {
                limit: props._limit,
                position: this._startPositionId,
                direction: 'bothways',
                field: 'id',
            },
        };
    }

    private _getRowProps(): IRowProps {
        return {
            markerVisible: !!this._hasStartOrEndValue,
            hoverBackgroundStyle: 'none',
            cursor: 'auto',
            padding: {
                top: 'null',
                bottom: 'null',
            },
        };
    }

    private _updateVirtualPageSize(props: IMonthListOptions, oldProps?: IMonthListOptions): void {
        if (
            !oldProps ||
            props.virtualPageSize !== oldProps.virtualPageSize ||
            props.segmentSize !== oldProps.segmentSize
        ) {
            // If we draw the headers as a separate element, then the virtual page should be 2 times larger,
            // because instead of one element, we draw two. Header and body.
            this._virtualPageSize = this._itemHeaderTemplate
                ? props.virtualPageSize * 2
                : props.virtualPageSize;
            this._virtualScrollConfig = {
                pageSize: this._virtualPageSize,
                segmentSize: props.segmentSize,
            };
        }
    }

    private _scrollToPosition(position: Date): void {
        if (!position) {
            return;
        }

        const normalizedPosition: Date = this._normalizeDate(position);

        this._positionToScroll = position;
        this._lastNotifiedPositionChangedDate = normalizedPosition;

        if (this._container && this._canScroll(position)) {
            // Update scroll position without waiting view modification
            this._updateScrollAfterViewModification();
        } else {
            this._displayedDates = [];
            const oldPositionId = this._startPositionId;
            this._startPositionId = monthListUtils.dateToId(normalizedPosition);
            this._updateNavigation(this.props);
            // After changing the navigation props, we must call the "reload" to redraw the control,
            // because the last time we could start rendering from the same position.
            // Position option is the initial position from which control is initially drawn.
            // TODO: Удалить по https://online.sbis.ru/opendoc.html?guid=775879fd-5eb6-4449-ac95-c27a4107c52d
            if (this.props._shouldUseScrollToItem) {
                this._listRef.current.scrollToItem(this._startPositionId, 'top');
            } else {
                if (oldPositionId === this._startPositionId && this._listRef.current) {
                    this._listRef.current.reload();
                }
            }
            // Если компонент скрыт, то сбросим _positionToScroll, доверим списочному контролу восстановление скрола
            // после того, как компонент станет видимым. Скорее всего _positionToScroll уже нигде не актален.
            // https://online.sbis.ru/opendoc.html?guid=d85227d0-3f42-4300-947f-cf8f57a02c0d
            if (this._isHidden()) {
                this._positionToScroll = null;
            }
        }
    }

    private _normalizeDate(date: Date, viewMode?: VIEW_MODE): Date {
        return (viewMode || this.props.viewMode) !== VIEW_MODE.month
            ? dateUtils.getStartOfYear(date)
            : dateUtils.getStartOfMonth(date);
    }

    protected _intersectHandler(entries: IntersectionObserverSyntheticEntry[]): void {
        // Don't update if the observer is triggered after hiding the component.
        if (!this._monthListVisible()) {
            return;
        }
        for (const entry of entries) {
            this._updateDisplayedItems(entry);
        }
        this._updateDisplayedPosition(entries);
    }

    private _updateDisplayedPosition(entries: IntersectionObserverSyntheticEntry[]): void {
        let date;

        // We go around all the elements where the intersection with the scrolled container has changed and
        // find the element that is at the top and it is not fully displayed.
        for (const entry of entries) {
            if (entry.data) {
                if (entry.data.type !== ITEM_TYPES.body) {
                    continue;
                }
                const entryDate: Date = entry.data.date;
                const rootBounds: DOMRect = entry.nativeEntry.rootBounds;
                // На Ipad приходит уже не актуальное положение элементов.
                // При дальнейшем скролировании обсервер уже не вызывается.
                const boundingClientRect: DOMRect = detection.isMobileIOS
                    ? entry.nativeEntry.target.getBoundingClientRect()
                    : entry.nativeEntry.boundingClientRect;

                // We select only those containers that are not fully displayed
                // and intersect with the scrolled container in its upper part, or lie higher.
                if (boundingClientRect.top - rootBounds.top <= 0) {
                    // Из-за дробных пикселей при масштабе или на touch-устройствах могу дергаться элементы.
                    // При этом возникает разница между boundingClientRect.bottom и rootBounds.top
                    // вплоть до 1.5 пикселей в зависимости от зума. Из-за этого неправильно расчитывается текущая дата.
                    if (boundingClientRect.bottom - rootBounds.top >= SCALE_ROUNDING_ERROR_FIX) {
                        // If the bottom of the container lies at or below the top of
                        // the scrolled container, then we found the right date
                        date = entryDate;
                        break;
                    } else if (
                        rootBounds.top - boundingClientRect.bottom <
                        entry.nativeEntry.target.offsetHeight
                    ) {
                        // If the container is completely invisible and lies on top of the scrolled area,
                        // then the next container may intersect with the scrolled area.
                        // We save the date, and check the following. This condition branch is needed, because a
                        // situation is possible when the container partially intersected from above, climbed up,
                        // persecuted, and the lower container approached the upper edge and its intersection
                        // did not change.
                        const delta: number = this.props.order === 'asc' ? 1 : -1;
                        if (this.props.viewMode !== VIEW_MODE.month) {
                            date = new this.props.dateConstructor(
                                entryDate.getFullYear() + delta,
                                entryDate.getMonth()
                            );
                        } else {
                            date = new this.props.dateConstructor(
                                entryDate.getFullYear(),
                                entryDate.getMonth() + delta
                            );
                        }
                    }
                }
            }
        }

        if (
            date &&
            !dateUtils.isMonthsEqual(date, this._lastNotifiedPositionChangedDate) &&
            !this._lastPositionFromOptions
        ) {
            const event = new SyntheticEvent(null, {
                type: 'positionChanged',
            });

            this._lastNotifiedPositionChangedDate = date;
            this._displayedPosition = date;

            this.props.onPositionChanged?.(event, date);
        }
    }

    private _updateDisplayedItems(entry: IntersectionObserverSyntheticEntry): void {
        // TODO: убрать `!entry.data` после
        //  https://online.sbis.ru/opendoc.html?guid=fee96058-62bc-4af3-8a74-b9d3b680f8ef
        if (!(this.props.source || this.props.holidaysGetter) || !entry.data) {
            return;
        }

        const time = entry.data.date.getTime();
        const index = this._displayedDates.indexOf(time);
        const isDisplayed = index !== -1;

        if (
            entry.nativeEntry.isIntersecting &&
            entry.nativeEntry.intersectionRatio >= ITEM_DATA_LOAD_RATIO &&
            !isDisplayed &&
            entry.data.type === ITEM_TYPES.body
        ) {
            this._displayedDates.push(time);
            this._enrichItemsDebounced();
        } else if (
            !entry.nativeEntry.isIntersecting &&
            isDisplayed &&
            entry.data.type === ITEM_TYPES.body
        ) {
            this._displayedDates.splice(index, 1);
        }
    }

    /**
     * Перезагружает данные для периода. Если переданный период не пересекается с отбражаемым периодом,
     * то данные не будут обновляться сразу же, а обновятся при подскроле к ним.
     * @function Controls/_calendar/MonthList#invalidatePeriod
     * @param {Date} start Начало периода
     * @param {Date} end Конец периода
     * @see Controls/_calendar/interface/IMonthListSource#source
     */
    protected invalidatePeriod(start: Date, end: Date): void {
        if (this._extData) {
            this._extData.invalidatePeriod(start, end);
            this._extData.enrichItems(this._displayedDates).catch((error: Error) => {
                return this._errorHandler(error);
            });
        }
    }

    private _enrichItems(): void {
        if (this._extData) {
            this._extData.enrichItems(this._displayedDates).catch((error: Error) => {
                return this._errorHandler(error);
            });
        }
    }

    private _updateScrollAfterViewModification(): void {
        if (
            this._positionToScroll &&
            this._canScroll(this._positionToScroll) &&
            this._scrollToDate(this._positionToScroll)
        ) {
            if (+this._lastPositionFromOptions === +this._positionToScroll) {
                this._lastPositionFromOptions = null;
            }
            this._positionToScroll = null;
        }
    }

    private _scrollToDate(date: Date): boolean {
        const containerToScroll: HTMLElement = this._findElementByDate(date);

        if (containerToScroll) {
            scrollToElement(
                containerToScroll,
                this._shouldPositionBelow ? 'bottom' : 'top',
                true,
                false,
                0,
                false,
                true
            );
            this._shouldPositionBelow = false;
            return true;
        }
        return false;
    }

    protected _scrollStateChangedHandler(): void {
        this._updateScrollAfterViewModification();
    }

    private _canScroll(date: Date): boolean {
        const itemContainer: HTMLElement = this._findElementByDate(date);

        if (!itemContainer) {
            return false;
        }

        // If the data is drawn over the years, and the displayed period is not the first month of the year,
        // then scroll to it unconditionally. In this case, the last month can be scrolled to the bottom
        // of the scrolled area. But this configuration is used only in a large selection of the period,
        // and there it is valid.
        if (this.props.viewMode !== VIEW_MODE.month && date.getMonth() !== 0) {
            return true;
        }

        const itemDimensions = getDimensions(itemContainer);
        const containerDimensions = getDimensions(this._container as HTMLElement);
        const scrollTop = this._scrollTop + (itemDimensions.top - containerDimensions.top);

        return this._scrollRef.current.canScrollTo(scrollTop);
    }

    protected _formatMonth(date: Date): string {
        return date ? formatDate(date, formatDate.FULL_MONTH) : '';
    }

    protected _getMonth(year: number, month: number): Date {
        return new WSDate(year, month, 1);
    }

    protected _dateToDataString(date: Date): string {
        return monthListUtils.dateToId(date);
    }

    protected _scrollHandler(scrollTop: number) {
        this._scrollTop = scrollTop;
        this._enrichItemsDebounced();
    }

    protected _refCallback(element: Element): void {
        this._container = element;
        this.props.forwardedRef?.(element);
    }

    private _findElementByDate(date: Date): HTMLElement {
        // После подскролла позиции вниз, нужно отобразить первую неделю следующего месяца
        const getShouldPositionBelowPosition = () => {
            if (!this._shouldPositionBelow) {
                return date;
            }
            // В режиме лет в БольшомВП месяцы отображаются 1 кварталом в ряд.
            // Берем 3 месяца вперед, чтобы подскроллить к 1 недели месяца следующего квартала
            if (this.props.viewMode !== VIEW_MODE.month) {
                return new Date(date.getFullYear(), date.getMonth() + 3, 1);
            }
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
        };
        const templates = {
            custom: {
                condition: this._shouldPositionBelow,
                dateId: dateUtils.getStartOfMonth(date),
            },
            day: {
                condition: date.getDate() !== 1 || this._shouldPositionBelow,
                dateId: getShouldPositionBelowPosition(),
            },
            month: {
                condition: date.getMonth() !== 0 || this._shouldPositionBelow,
                dateId: dateUtils.getStartOfMonth(date),
            },
            // В шаблоне может использоваться headerTemplate, нужно подскроллить к месяцу/году под ним
            year: {
                condition: true,
                dateId: dateUtils.getStartOfYear(date),
            },
            // В случае, если используется кастомный шаблон, пытаемся подскроллить к нему
            mainTemplate: {
                condition: true,
                dateId: dateUtils.getStartOfYear(date),
            },
        };

        for (const item in templates) {
            if (templates.hasOwnProperty(item)) {
                const element = this._getElementByDate(
                    ITEM_BODY_SELECTOR[item],
                    monthListUtils.dateToId(templates[item].dateId)
                );
                if (element && templates[item].condition) {
                    return element;
                }
            }
        }
    }

    private _monthListVisible(): boolean {
        return this._container?.offsetParent !== null;
    }

    private _getElementByDate(selector: string, dateId: string): HTMLElement {
        return this._container?.querySelector(selector + '[data-date="' + dateId + '"]');
    }

    private _errorHandler(error: Error): Promise<unknown> {
        return this._errorController
            .process({
                error,
                mode: ErrorViewMode.dialog,
            })
            .then((errorViewConfig) => {
                this._errorViewConfig = errorViewConfig;
                return error;
            });
    }

    private _getProxyEvents(): object {
        return EVENTS_TO_PROXY.reduce((result, eventName) => {
            if (eventName in this.props) {
                result[eventName] = this.props[eventName];
            }
            return result;
        }, {});
    }

    // Формируем дату для шаблона элемента через эту функцию несмотря на то,
    // что дата и так содержится в данных для элемента. Проблема в том, что если страница строится на сервере,
    // и клиент находится в часовом поясе меньшем чем сервер, то даты после десериализации теряют несколько часов.
    // В результате этого происходит переход на сутки назад.
    // Десериализуем даты сами из текстового идентификатора пока не будет сделана следующая задача.
    // https://online.sbis.ru/opendoc.html?guid=d3d0fc8a-06cf-49fb-ad80-ce0a9d9a8632
    protected _idToDate(dateId: string): Date {
        return monthListUtils.idToDate(dateId);
    }

    private _isHidden(): boolean {
        return !!this._container.closest('.ws-hidden');
    }

    render() {
        const attrs = this.props.attrs ? wasabyAttrsToReactDom(this.props.attrs) || {} : {};

        return (
            <error.Container forwardedRef={this._refCallback} viewConfig={this._errorViewConfig}>
                <IntersectionObserverController
                    threshold={this._threshold}
                    observerName="monthList"
                    onIntersect={this._intersectHandler}
                    customEvents={INTERSECT_CUSTOM_EVENTS}
                >
                    <ScrollContainer
                        {...attrs}
                        ref={this._scrollRef}
                        className={`controls-MonthList MonthList-ScrollContainer MonthList-ScrollContainer controls_calendar_theme-${
                            this.props.theme
                        } ${this.props.className || ''}`}
                        data-qa={this.props['data-qa'] || attrs['data-qa']}
                        scrollbarVisible={false}
                        topShadowVisibility={this._topShadowVisibility}
                        bottomShadowVisibility={this._bottomShadowVisibility}
                        shadowStyle={this.props.shadowStyle}
                        shadowMode="js"
                        {...this._getProxyEvents()}
                        onScrollStateChanged={this._scrollStateChangedHandler}
                        onCustomscroll={this._scrollHandler}
                        customEvents={SCROLL_CUSTOM_EVENTS}
                    >
                        <GridView
                            ws-tab-cycling="true"
                            ref={this._listRef}
                            columns={this._columns}
                            getRowProps={this._getRowProps}
                            disablePreloadDataToBackward={true}
                            virtualScrollConfig={this._virtualScrollConfig}
                            navigation={this._navigation}
                            sourceController={this._sourceController}
                            source={this._viewSource}
                            sourceExt={this.props.source}
                            viewMode={this.props.viewMode}
                            markerVisibility={this.props.markerVisibility}
                            markedKey={this.props.markedKey}
                            keyProperty="id"
                            onItemClick={this.props.onItemClick}
                            onDrawItems={this._drawItemsHandler}
                            onMarkedKeyChanged={this._onMarkedKeyChanged}
                            customEvents={LIST_CUSTOM_EVENTS}
                        />
                    </ScrollContainer>
                </IntersectionObserverController>
            </error.Container>
        );
    }

    static _ITEM_BODY_SELECTOR = ITEM_BODY_SELECTOR;

    static defaultProps: Partial<IMonthListOptions> = {
        viewMode: VIEW_MODE.year,
        yearTemplate: YearTemplate,
        monthTemplate: MonthTemplate,
        // In most places where control is used, no more than 4 elements are displayed at the visible area.
        // Draw the elements above and below.
        virtualPageSize: 8,
        _limit: 8,
        order: 'asc',
        dateConstructor: WSDate,
        displayedRanges: null,
        markerVisibility: 'hidden',
    };
}

export default MonthList;

/**
 * @event positionChanged Происходит когда меняется год или месяц.
 * Т.е. когда год или месяц пересекают верхнюю границу.
 * @name Controls/_calendar/MonthList#positionChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {date} Date отображаемый в самом верху год или месяц.
 * @example
 * Обновляем заголовок в зависимости от отображаемого года.
 * <pre>
 *    <Controls.calendar:MonthList bind:position="_date" on:positionChanged="_positionChangedHandler()"/>
 * </pre>
 * <pre>
 *    class  ModuleComponent extends Control {
 *       ...
 *       _positionChangedHandler(e, date) {
 *          this.setTitle(date);
 *       }
 *       ...
 *    }
 * </pre>
 */
