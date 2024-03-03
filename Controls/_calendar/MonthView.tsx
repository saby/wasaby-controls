/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IControlOptions } from 'UI/Base';
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { Base as DateUtil } from 'Controls/dateUtils';
import monthListUtils from './MonthList/Utils';

import { IDateRangeSelectable, Utils as calendarUtils } from 'Controls/dateRange';
import MonthViewModel from './MonthView/MonthViewModel';

import MonthViewTableBody from './MonthView/MonthViewTableBody';
import CaptionTemplate from './MonthView/captionTemplate';
import DayHeaderTemplate from './MonthView/dayHeaderTemplate';
import DayTemplate from './MonthView/dayTemplate';

import IMonth from './interfaces/IMonth';

import { Logger } from 'UI/Utils';
import 'css!Controls/calendar';

/**
 * Календарь, отображающий 1 месяц.
 * Умеет только отображать представление месяца и поддерживает события взаимодействия пользователя с днями.
 * Есть возможность переопределить конструктор модели и шаблон дня.
 * С помощью этого механизма можно кастомизировать отображение дней.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_calendar.less переменные тем оформления}
 *
 * @class Controls/_calendar/MonthView
 * @extends UI/Base:Control
 * @mixes Controls/calendar:IMonth
 * @implements Controls/interface:IDayTemplate
 *
 * @public
 * @demo Controls-demo/Date/MonthView
 *
 */

export default class MonthView extends React.Component<IControlOptions> {
    _month: Date | string;
    _days: object[];
    _showWeekdays: boolean;
    _monthViewModel: MonthViewModel;
    _caption: string;

    constructor(props: IControlOptions) {
        super(props);
        this._updateView(props);
        this._monthViewModel = props.monthViewModel
            ? new props.monthViewModel(props)
            : new MonthViewModel(props);

        if (!props.newMode) {
            Logger.warn(
                'MonthView: Используется устаревшая верстка, используйте newMode=true для перехода на новую'
            );
        }

        this._dayClickHandler = this._dayClickHandler.bind(this);
        this._mouseEnterHandler = this._mouseEnterHandler.bind(this);
        this._mouseLeaveHandler = this._mouseLeaveHandler.bind(this);
        this._keyDownHandler = this._keyDownHandler.bind(this);
    }

    shouldComponentUpdate(props: IControlOptions): boolean {
        this._updateView(props);
        this._monthViewModel.updateOptions(props);

        return true;
    }

    protected _dateToDataString(date: Date): string {
        return monthListUtils.dateToId(date);
    }

    protected _getDayData(): object {
        return {};
    }

    private _isDayAvailable(date: Date, extData?: object): boolean {
        if (this.props.isDayAvailable) {
            return this.props.isDayAvailable(date, extData);
        }
        return true;
    }

    protected _dayClickHandler(
        event: React.MouseEvent,
        item: Date,
        isCurrentMonth: boolean,
        extData: {}
    ): void {
        if (!this.props.onItemClick) {
            return;
        }

        if (
            this.props.selectionType !== IDateRangeSelectable.SELECTION_TYPES.disable &&
            !this.props.readOnly &&
            (isCurrentMonth || this.props.mode === 'extended')
        ) {
            this.props.onItemClick(
                event,
                item,
                event,
                extData,
                this._isDayAvailable(item, extData)
            );
        }
    }

    protected _mouseEnterHandler(
        event: React.MouseEvent,
        item: Date,
        isCurrentMonth: boolean
    ): void {
        if (!this.props.onItemMouseEnter) {
            return;
        }

        if (isCurrentMonth || (this.props.mode === 'extended' && this._isDayAvailable(item))) {
            this.props.onItemMouseEnter(event, item);
        }
    }

    protected _mouseLeaveHandler(
        event: React.MouseEvent,
        item: Date,
        isCurrentMonth: boolean
    ): void {
        if (!this.props.onItemMouseLeave) {
            return;
        }

        if (isCurrentMonth || (this.props.mode === 'extended' && this._isDayAvailable(item))) {
            this.props.onItemMouseLeave(event, item);
        }
    }

    protected _keyDownHandler(event: React.KeyboardEvent, item: Date): void {
        if (!this.props.onItemKeyDown) {
            return;
        }

        const itemClass = '.controls-MonthViewVDOM__item';
        const mode = 'days';

        this.props.onItemKeyDown(event, item, event.nativeEvent.keyCode, itemClass, mode);
        // Останавливаем нативный скролл, когда управляем выбором через стрелочки клавиатуры
        event.preventDefault();
    }

    private _updateView(props: IControlOptions): void {
        const newMonth = props.month || new props.dateConstructor();

        // localization can change in runtime, take the actual translation of the months each time the component
        // is initialized. In the array, the days of the week are in the same order as the return values
        // of the Date.prototype.getDay () method.  Moving the resurrection from the beginning of the array to the end.
        this._days = calendarUtils.getWeekdaysCaptions();

        if (!DateUtil.isDatesEqual(newMonth, this._month)) {
            this._month = newMonth;
            if (props.showCaption) {
                this._caption = formatDate(this._month, props.captionFormat);
            }
        }
        this._month = DateUtil.normalizeMonth(this._month);
        this._showWeekdays = props.showWeekdays;
    }

    render(): React.ReactElement {
        const CaptionTemplate = this.props.captionTemplate;
        const DayHeaderTemplate = this.props.dayHeaderTemplate;
        const attrs = this.props.attrs ? wasabyAttrsToReactDom(this.props.attrs) || {} : {};

        return (
            <div
                {...attrs}
                ref={this.props.forwardedRef}
                data-qa={this.props['data-qa'] || attrs['data-qa'] || 'controls-MonthViewVDOM'}
                data-date={this._dateToDataString(this._month)}
                className={
                    `controls-MonthViewVDOM controls_calendar_theme-${this.props.theme}` +
                    (this.props.newMode !== true ? ' controls-MonthViewVDOM-old' : '') +
                    ` ${attrs.className || this.props.className || ''}`
                }
            >
                {this.props.showCaption && (
                    <div
                        data-qa="controls-MonthViewVDOM__caption"
                        className="controls-MonthViewVDOM__caption"
                    >
                        <CaptionTemplate caption={this._caption} date={this._month} />
                    </div>
                )}
                <div className="controls-MonthViewVDOM__table">
                    {this.props.showWeekdays && (
                        <div className="controls-MonthViewVDOM__tableRow controls-MonthViewVDOM_tableHead">
                            {this._days.map((value, index) =>
                                // вешаем key на фрагмет, т.к. в некоторых местах передают wasaby шаблон,
                                // а они key не умеют обрабатывать
                                {
                                    return (
                                        <React.Fragment key={`weekDay-${value.day}`}>
                                            <DayHeaderTemplate
                                                value={value}
                                                newMode={this.props.newMode}
                                            />
                                        </React.Fragment>
                                    );
                                }
                            )}
                        </div>
                    )}
                    <MonthViewTableBody
                        newMode={this.props.newMode}
                        theme={this.props.theme}
                        caption={this._caption}
                        month={this._month}
                        days={this._days}
                        data-date={this._dateToDataString(this._month)}
                        showWeekdays={this.props.showWeekdays}
                        showCaption={this.props.showCaption}
                        mode={this.props.mode}
                        dayTemplate={this.props.dayTemplate}
                        monthViewModel={this._monthViewModel}
                        dayClickHandler={this._dayClickHandler}
                        mouseEnterHandler={this._mouseEnterHandler}
                        mouseLeaveHandler={this._mouseLeaveHandler}
                        keyDownHandler={this._keyDownHandler}
                    />
                </div>
            </div>
        );
    }

    static defaultProps: Partial<IControlOptions> = {
        ...IMonth.getDefaultOptions(),
        dayTemplate: DayTemplate,
        dayHeaderTemplate: DayHeaderTemplate,
        captionTemplate: CaptionTemplate,
        dateConstructor: WSDate,
        newMode: true,
    };
}

/**
 * @event itemClick Происходит после клика по элементу дня в календаре.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} item Дата элемента, по которому произвели клик.
 * @param {UI/Events:SyntheticEvent} event Дескриптор события onclick, при клике по дню месяца.
 */
