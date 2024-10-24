/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import { getFormattedCaption } from 'Controls/_compactDatePicker/Utils';
import getDayTemplate from 'Controls/_compactDatePicker/dayTemplate';
import {
    IDayAvailableOptions,
    MonthList,
    MonthListMonthTemplate,
    MonthView,
    MonthViewDayTemplate,
} from 'Controls/calendar';
import { Base as dateUtils } from 'Controls/dateUtils';
import { IControlProps, IDisplayedRangesOptions } from 'Controls/interface';
import { IntersectionObserverSyntheticEntry } from 'Controls/scroll';
import { detection } from 'Env/Env';
import { Date as BaseDate } from 'Types/entity';
import { getWasabyContext } from 'UICore/Contexts';
import { TInternalProps } from 'UICore/Executor';
import 'css!Controls/compactDatePicker';
import * as React from 'react';
import CompactMonthModel from './MonthModel';

interface ICompactDatePickerOptions
    extends TInternalProps,
        IControlProps,
        IDisplayedRangesOptions,
        IDayAvailableOptions {
    position: Date;
    startValue: Date | null;
    endValue: Date | null;
    dayClickCallback: (value: Date, extData: object, isAvailableDay?: boolean) => boolean;
}

const CUSTOM_EVENTS = ['onItemClick'];

export default class List extends React.Component<ICompactDatePickerOptions> {
    readonly state: {
        hoveredMonth: Date | null;
        readOnly: boolean;
    };
    private _readOnlyTimeout: number;
    protected _baseDayTemplate: React.FunctionComponent;
    protected _monthTemplate: React.FunctionComponent;

    protected _monthProps: object = {};
    protected _monthViewModel: object = CompactMonthModel;
    private _monthSelectionProcessing: boolean = false;
    protected _onMouseEnterHandler: Function;
    protected _onMouseLeaveHandler: Function;
    protected _onTouchMoveHandler: Function;
    protected _onPositionChangedHandler: Function;
    protected _onItemMouseEnterHandler: Function;
    protected _onItemMouseLeaveHandler: Function;
    protected _onItemKeyDownHandler: Function;

    protected constructor(props: ICompactDatePickerOptions) {
        super(props);
        this.state = {
            hoveredMonth: null,
        };
        this._baseDayTemplate = getDayTemplate(
            props.dayTemplate || MonthViewDayTemplate,
            props.rangeModel,
            props.dayTemplateOptions,
            {
                intersectionHandler: this._currentDayIntersectHandler.bind(this),
                unregisterHandler: this._unregisterCurrentDayIntersectHandler.bind(this),
            },
            props.counterProperty,
            props.counterClickCallback,
            props.size,
            props.selectionStyle,
            props.addButtonVisibilityCallback
        );
        this._updateMonthProps(props);
        this._getMonthTemplate = this._getMonthTemplate.bind(this);
        this._monthTemplate = React.forwardRef(this._getMonthTemplate);
        this._getDefaultMonthTemplate = this._getDefaultMonthTemplate.bind(this);
        this._getMonthBodyTemplate = this._getMonthBodyTemplate.bind(this);
        this._getDefaultMonthTemplateHeader = this._getDefaultMonthTemplateHeader.bind(this);
        this._getCaptionTemplate = this._getCaptionTemplate.bind(this);
        this._onItemClickHandler = this._onItemClickHandler.bind(this);

        this._onMouseEnterHandler = this._proxyEvent.bind(this, 'onMouseEnter');
        this._onMouseLeaveHandler = this._proxyEvent.bind(this, 'onMouseLeave');
        this._onWheelHandler = this._onWheelHandler.bind(this);
        this._onTouchMoveHandler = this._proxyEvent.bind(this, 'onTouchMove');
        this._onPositionChangedHandler = this._proxyEvent.bind(this, 'onPositionChanged');
        this._onItemMouseEnterHandler = this._proxyEvent.bind(this, 'onItemMouseEnter');
        this._onItemMouseLeaveHandler = this._proxyEvent.bind(this, 'onItemMouseLeave');
        this._onItemKeyDownHandler = this._proxyEvent.bind(this, 'onItemKeyDown');
    }

    protected shouldComponentUpdate(props: ICompactDatePickerOptions, state): boolean {
        if (props.dayTemplateOptions !== this.props.dayTemplateOptions) {
            this._baseDayTemplate = getDayTemplate(
                props.dayTemplate || MonthViewDayTemplate,
                props.rangeModel,
                props.dayTemplateOptions,
                {
                    intersectionHandler: this._currentDayIntersectHandler.bind(this),
                    unregisterHandler: this._unregisterCurrentDayIntersectHandler.bind(this),
                },
                props.counterProperty,
                props.counterClickCallback,
                props.size,
                props.selectionStyle,
                props.addButtonVisibilityCallback
            );
        }

        if (
            this.state.readOnly !== state.readOnly ||
            props.selectionProcessing !== this.props.selectionProcessing ||
            props.selectionBaseValue !== this.props.selectionBaseValue ||
            (props.selectionType !== 'range' &&
                (props.hoveredStartValue !== this.props.hoveredStartValue ||
                    props.hoveredEndValue !== this.props.hoveredEndValue))
        ) {
            this._updateMonthProps(props);
        }

        return true;
    }

    private _onItemClickHandler(event, item, customEvents, extData, isDayAvailable): void {
        let shouldCallItemClick = true;
        let additionalConfig;
        if (this._monthSelectionProcessing) {
            additionalConfig = {
                selectionType: 'quantum',
                quantum: { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
            };
            this._monthSelectionProcessing = false;
        }
        if (this.props.dayClickCallback) {
            shouldCallItemClick = this.props.dayClickCallback(item, extData, isDayAvailable);
        }
        if (shouldCallItemClick && isDayAvailable !== false) {
            this._proxyEvent('onItemClick', event, item, additionalConfig);
        }
    }

    private _todayIconVisibleChanged(iconVisible: boolean): void {
        (this.props.onTodayiconvisiblechanged || this.props.onTodayIconVisibleChanged)(iconVisible);
    }

    protected _isLastMonth(date: Date): boolean {
        if (!this.props.displayedRanges) {
            return false;
        }
        const displayedRanges = this.props.displayedRanges;
        const amountOfRanges = displayedRanges.length;
        let lastRange;
        if (this.props.order === 'desc') {
            lastRange = this.props.displayedRanges[0][0];
        } else {
            lastRange = this.props.displayedRanges[amountOfRanges - 1][1];
        }
        if (!lastRange) {
            return false;
        }
        return (
            lastRange.getFullYear() === date.getFullYear() &&
            lastRange.getMonth() === date.getMonth()
        );
    }

    protected _getFormattedCaption(date: Date): string {
        // Рисуем заголовок текущего месяца в футоре другого месяца. Таким образом позиция будет меняться только когда
        // пользователь подскроллит прямо к месяцу с ячейками дней. Это нужно для того, чтобы заголовок в шапке менялся
        // только тогда, когда заголовка у месяца уже не видно. Иначе визуально заголовки будут дублироваться.
        const delta = this.props.order === 'desc' ? -1 : 1;
        const captionDate = new Date(date.getFullYear(), date.getMonth() + delta);
        return getFormattedCaption(captionDate, this.props._date);
    }

    protected _monthViewItemClickHandler(event: Event): void {
        // за счет этого callback список не будет кидать событие onItemClick с всплытием
        // а нам как раз и не нужно, чтобы он его кидал
    }

    protected _currentDayIntersectHandler(entry: IntersectionObserverSyntheticEntry): void {
        this._todayIconVisibleChanged(!entry.nativeEntry.isIntersecting);
    }

    protected _unregisterCurrentDayIntersectHandler(): void {
        // Если в IntersectionObserverContainer, который сделит за сегодняшним днём, происходит событие unregister -
        // значит текущий день точно не отображается. Делаем "Домик" видимым
        this._todayIconVisibleChanged(true);
    }

    private _proxyEvent(callbackName: string, ...args): void {
        this.props[callbackName]?.(...args);
    }

    private _updateMonthProps(props: ICompactDatePickerOptions): void {
        this._monthProps = {
            selectionProcessing: props.selectionProcessing,
            selectionBaseValue: props.selectionBaseValue,
        };
    }

    private _onMonthMouseEnter(date: Date): void {
        if (this.props.selectionType === 'range' && !this.state.readOnly) {
            const value = this._getMonthValue(date);
            if (!this.props.selectionProcessing) {
                this.setState({
                    hoveredMonth: value,
                });
                this._updateMonthProps(this.props);
            }
            if (this._monthSelectionProcessing) {
                this.props.onItemMouseEnter(value);
            }
        }
    }

    private _onMonthMouseLeave(date: Date): void {
        if (this.props.selectionType === 'range') {
            const value = this._getMonthValue(date);
            if (!this.props.selectionProcessing) {
                this.setState({
                    hoveredMonth: null,
                });
                this._updateMonthProps(this.props);
            }
            if (this._monthSelectionProcessing) {
                this.props.onItemMouseLeave(value);
            }
        }
    }

    private _onMonthClick(date: Date): void {
        if (
            (!this.props.selectionProcessing || this._monthSelectionProcessing) &&
            this.props.selectionType === 'range' &&
            !this.context.readOnly
        ) {
            const value = this._getMonthValue(date);
            this._monthSelectionProcessing = !this._monthSelectionProcessing;
            this.props.onItemClick(value, {
                selectionType: 'quantum',
                quantum: {
                    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
            });
            this.props.onMonthSelectionProcessingChanged(this._monthSelectionProcessing);
        }
    }

    private _onWheelHandler(): void {
        if (!this.state.readOnly) {
            this.setState({
                readOnly: true,
            });
        }
        clearTimeout(this._readOnlyTimeout);
        this._readOnlyTimeout = setTimeout(() => {
            if (this.state.readOnly) {
                this.setState({
                    readOnly: false,
                });
            }
        }, 300);
    }

    private _getMonthValue(date: Date): Date {
        const year = date.getFullYear();
        const month = !this.props.captionTemplate ? date.getMonth() + 1 : date.getMonth();
        return new BaseDate(year, month);
    }

    private _getDefaultMonthTemplateHeader(props: object): React.ReactElement {
        if (!this._isLastMonth(props.date)) {
            return (
                <div
                    onMouseEnter={this._onMonthMouseEnter.bind(this, props.date)}
                    onMouseLeave={this._onMonthMouseLeave.bind(this, props.date)}
                    onClick={this._onMonthClick.bind(this, props.date)}
                    className={
                        (this.props.selectionType === 'range' &&
                        (!this.props.selectionProcessing || this._monthSelectionProcessing)
                            ? 'tw-cursor-pointer'
                            : '') +
                        ' controls-CompactDatePicker__month-list__item__header ' +
                        ` controls-CompactDatePicker__month-list__item__header__size-${this.props.size}`
                    }
                >
                    {props.caption}
                </div>
            );
        } else {
            return null;
        }
    }

    private _getCaptionTemplate(props: object): React.ReactElement {
        return (
            <this.props.captionTemplate
                {...props}
                defaultMonthTemplateCaption={this._getDefaultMonthTemplateHeader}
            />
        );
    }

    private _getHoveredStartValue(): Date | null {
        if (this.state.hoveredMonth) {
            return this.state.hoveredMonth;
        }
        return this.props.hoveredStartValue;
    }

    private _getHoveredEndValue(): Date | null {
        if (this.state.hoveredMonth) {
            return dateUtils.getEndOfMonth(this.state.hoveredMonth);
        }
        return this.props.hoveredEndValue;
    }

    private _getDefaultMonthTemplate(props: object): React.ReactElement {
        return (
            <div className={`ws-flexbox ws-flex-column ${props.className || ''}`}>
                <MonthView
                    className="controls-CompactDatePicker__month-list__item"
                    data-qa="controls-CompactDatePicker__month-list__item"
                    _date={this.props._date}
                    readOnly={props.readOnly || this.state.readOnly}
                    holidaysData={props.holidaysData}
                    showCaption={!!this.props.captionTemplate}
                    monthViewModel={this._monthViewModel}
                    isDayAvailable={this.props.isDayAvailable}
                    dayTemplate={this._baseDayTemplate}
                    ranges={this.props.ranges}
                    showWeekdays={false}
                    month={props.date}
                    daysData={props.extData}
                    calendarData={props.calendarData}
                    selectionType={this.props.selectionType}
                    newMode={true}
                    selectionProcessing={props.monthProps.selectionProcessing}
                    selectionBaseValue={props.monthProps.selectionBaseValue}
                    startValue={props.startValue}
                    endValue={props.endValue}
                    hoveredStartValue={this._getHoveredStartValue()}
                    hoveredEndValue={this._getHoveredEndValue()}
                    onItemClick={this._onItemClickHandler}
                    onItemMouseEnter={this._onItemMouseEnterHandler}
                    onItemMouseLeave={this._onItemMouseLeaveHandler}
                    onItemKeyDown={this._onItemKeyDownHandler}
                    captionTemplate={this.props.captionTemplate && this._getCaptionTemplate}
                />
                {!this.props.captionTemplate && (
                    <this._getDefaultMonthTemplateHeader
                        caption={this._getFormattedCaption(props.date)}
                        date={props.date}
                    />
                )}
            </div>
        );
    }

    private _getMonthBodyTemplate(props: object): React.ReactElement {
        if (this.props.monthTemplate) {
            return (
                <this.props.monthTemplate
                    {...props}
                    defaultMonthTemplate={this._getDefaultMonthTemplate}
                />
            );
        } else {
            return <this._getDefaultMonthTemplate {...props} />;
        }
    }

    private _getMonthTemplate(props: Object, ref: React.Ref<HTMLDivElement>): React.ReactElement {
        return (
            <MonthListMonthTemplate
                {...props}
                ref={ref}
                bodyTemplate={this._getMonthBodyTemplate}
            />
        );
    }

    private _getVirtualPageSize(): number {
        if (this.props.virtualPageSize) {
            return this.props.virtualPageSize;
        }
        if (detection.isMobilePlatform) {
            return 6;
        }
        return 3;
    }

    private _getSegmentSize(): number {
        if (detection.isMobilePlatform) {
            return 12;
        }
    }

    render() {
        return (
            <MonthList
                forwardedRef={this.props.forwardedRef}
                className={`${this.props.className || ''} controls-CompactDatePicker__month-list ${
                    this.props.isPopup
                        ? 'controls-CompactDatePicker__month-list_height ' +
                          `controls-CompactDatePicker__month-list_height__size-${this.props.size}`
                        : ''
                } ${
                    this.props.isAdaptive
                        ? `controls-CompactDatePicker__month-list_adaptiveHeight__size-${this.props.size}`
                        : ''
                }`}
                readOnly={this.props.readOnly || this.state.readOnly}
                data-qa="controls-CompactDatePicker__month-list"
                holidaysGetter={this.props.holidaysGetter}
                filter={this.props.filter}
                shouldPositionBelow={this.props.shouldPositionBelow}
                syncBeforeMount={this.props.syncBeforeMount}
                viewMode="month"
                virtualPageSize={this._getVirtualPageSize()}
                segmentSize={this._getSegmentSize()}
                order={this.props.order}
                source={this.props.source}
                startValue={this.props.rangeModel.startValue}
                endValue={this.props.rangeModel.endValue}
                monthProps={this._monthProps}
                hoveredStartValue={null}
                hoveredEndValue={null}
                displayedRanges={this.props.displayedRanges}
                position={this.props.position}
                bottomShadowVisibility="hidden"
                shadowStyle={this.props.shadowStyle || 'CompactDatePicker'}
                onMouseEnter={this._onMouseEnterHandler}
                onMouseLeave={this._onMouseLeaveHandler}
                onWheel={this._onWheelHandler}
                onTouchMove={this._onTouchMoveHandler}
                onPositionChanged={this._onPositionChangedHandler}
                monthTemplate={this._monthTemplate}
                onItemClick={this._monthViewItemClickHandler}
                customEvents={CUSTOM_EVENTS}
            />
        );
    }

    static contextType = getWasabyContext();
}
