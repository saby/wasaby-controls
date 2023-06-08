/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'css!Controls/compactDatePicker';
import getDayTemplate from 'Controls/_compactDatePicker/dayTemplate';
import {
    MonthViewDayTemplate,
    MonthList,
    MonthListMonthTemplate,
    MonthView,
} from 'Controls/calendar';
import CompactMonthModel from './MonthModel';
import { getFormattedCaption } from 'Controls/_compactDatePicker/Utils';
import { IDisplayedRangesOptions, IControlProps } from 'Controls/interface';

interface ICompactDatePickerOptions extends TInternalProps, IControlProps, IDisplayedRangesOptions {
    position: Date;
    startValue: Date | null;
    endValue: Date | null;
    topShadowVisibility: string;
}

const CUSTOM_EVENTS = ['onItemClick'];

export default class List extends React.Component<ICompactDatePickerOptions> {
    protected _baseDayTemplate: React.FunctionComponent;
    protected _monthTemplate: React.FunctionComponent;

    protected _monthProps: object = {};
    protected _monthViewModel: CompactMonthModel = CompactMonthModel;
    protected _onMouseEnterHandler: Function;
    protected _onMouseLeaveHandler: Function;
    protected _onWheelHandler: Function;
    protected _onTouchMoveHandler: Function;
    protected _onPositionchangedHandler: Function;
    protected _onItemclickHandler: Function;
    protected _onItemmouseenterHandler: Function;
    protected _onItemmouseleaveHandler: Function;
    protected _onItemkeydownHandler: Function;

    protected constructor(props: ICompactDatePickerOptions) {
        super(props);
        this._baseDayTemplate = getDayTemplate(
            props.dayTemplate || MonthViewDayTemplate,
            props.rangeModel,
            props.dayTemplateOptions
        );
        this._updateMonthProps(props);
        this._getMonthTemplate = this._getMonthTemplate.bind(this);
        this._monthTemplate = React.forwardRef(this._getMonthTemplate);
        this._getDefaultMonthTemplate = this._getDefaultMonthTemplate.bind(this);
        this._getMonthBodyTemplate = this._getMonthBodyTemplate.bind(this);
        this._getDefaultMonthTemplateHeader = this._getDefaultMonthTemplateHeader.bind(this);
        this._getCaptionTemplate = this._getCaptionTemplate.bind(this);

        this._onMouseEnterHandler = this._proxyEvent.bind(this, 'onMouseEnter');
        this._onMouseLeaveHandler = this._proxyEvent.bind(this, 'onMouseLeave');
        this._onWheelHandler = this._proxyEvent.bind(this, 'onWheel');
        this._onTouchMoveHandler = this._proxyEvent.bind(this, 'onTouchMove');
        this._onPositionchangedHandler = this._proxyEvent.bind(this, 'onPositionchanged');
        this._onItemclickHandler = this._proxyEvent.bind(this, 'onItemclick');
        this._onItemmouseenterHandler = this._proxyEvent.bind(this, 'onItemmouseenter');
        this._onItemmouseleaveHandler = this._proxyEvent.bind(this, 'onItemmouseleave');
        this._onItemkeydownHandler = this._proxyEvent.bind(this, 'onItemkeydown');
    }

    protected shouldComponentUpdate(props: ICompactDatePickerOptions): boolean {
        if (props.dayTemplateOptions !== this.props.dayTemplateOptions) {
            this._baseDayTemplate = getDayTemplate(
                props.dayTemplate || MonthViewDayTemplate,
                props.rangeModel,
                props.dayTemplateOptions
            );
        }

        if (
            props.selectionProcessing !== this.props.selectionProcessing ||
            props.selectionBaseValue !== this.props.selectionBaseValue
        ) {
            this._updateMonthProps(props);
        }

        return true;
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
        return getFormattedCaption(captionDate);
    }

    protected _monthViewItemClickHandler(event: Event): void {
        // за счет этого callback список не будет кидать событие onItemClick с всплытием
        // а нам как раз и не нужно, чтобы он его кидал
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

    private _getDefaultMonthTemplateHeader(props: object): React.ReactElement {
        if (!this._isLastMonth(props.date)) {
            return (
                <div
                    className={
                        'controls-CompactDatePicker__month-list__item__header ' +
                        `controls-CompactDatePicker__month-list__item__header__size-${this.props.size}`
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

    private _getDefaultMonthTemplate(props: object): React.ReactElement {
        return (
            <div className={`ws-flexbox ws-flex-column ${props.className || ''}`}>
                <MonthView
                    className="controls-CompactDatePicker__month-list__item"
                    data-qa="controls-CompactDatePicker__month-list__item"
                    _date={this.props._date}
                    showCaption={!!this.props.captionTemplate}
                    monthViewModel={this._monthViewModel}
                    isDayAvailable={this.props.isDayAvailable}
                    dayTemplate={this._baseDayTemplate}
                    ranges={this.props.ranges}
                    showWeekdays={false}
                    month={props.date}
                    daysData={props.extData}
                    selectionType={this.props.selectionType}
                    newMode={true}
                    selectionProcessing={props.monthProps.selectionProcessing}
                    selectionBaseValue={props.monthProps.selectionBaseValue}
                    startValue={props.startValue}
                    endValue={props.endValue}
                    hoveredStartValue={this.props.hoveredStartValue}
                    hoveredEndValue={this.props.hoveredEndValue}
                    onItemclick={this._onItemclickHandler}
                    onItemmouseenter={this._onItemmouseenterHandler}
                    onItemmouseleave={this._onItemmouseleaveHandler}
                    onItemkeydown={this._onItemkeydownHandler}
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
                data-qa="controls-CompactDatePicker__month-list"
                filter={this.props.filter}
                shouldPositionBelow={this.props.shouldPositionBelow}
                syncBeforeMount={this.props.syncBeforeMount}
                viewMode="month"
                virtualPageSize={this.props.virtualPageSize || 3}
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
                topShadowVisibility={this.props.topShadowVisibility}
                shadowStyle={this.props.shadowStyle || 'CompactDatePicker'}
                onMouseEnter={this._onMouseEnterHandler}
                onMouseLeave={this._onMouseLeaveHandler}
                onWheel={this._onWheelHandler}
                onTouchMove={this._onTouchMoveHandler}
                onPositionchanged={this._onPositionchangedHandler}
                monthTemplate={this._monthTemplate}
                onItemClick={this._monthViewItemClickHandler}
                customEvents={CUSTOM_EVENTS}
            />
        );
    }
}
