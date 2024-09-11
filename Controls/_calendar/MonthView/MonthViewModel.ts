/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import { IDateRangeSelectable, Utils as calendarUtils } from 'Controls/dateRange';
import { VersionableMixin, Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { Base as DateUtil } from 'Controls/dateUtils';
import { detection } from 'Env/Env';
import * as coreMerge from 'Core/core-merge';

/**
 * Модель для представления месяца.
 * @public
 */

export default class MonthViewModel extends VersionableMixin {
    _state: object;
    _modelArray: object[] = [];
    _singleDayHover: boolean = true;
    private _isDayAvailable: Function;

    constructor(cfg: object) {
        super(cfg);

        this._isDayAvailable = cfg.isDayAvailable;

        // Нет необходимости каждый раз обовлять стили месяца при наведении,
        // если хавер работает только по одной ячейке дня, а не по нескольким.
        const isQuantumSelection = cfg.selectionType === 'quantum' && cfg.ranges;
        let isSingleDayQuantum;
        if (isQuantumSelection) {
            isSingleDayQuantum = 'days' in cfg.ranges && cfg.ranges.days.indexOf(1) !== -1;
        }
        if (cfg.selectionType === 'workdays' || (isQuantumSelection && !isSingleDayQuantum)) {
            this._singleDayHover = false;
        }

        this._state = this._normalizeState(cfg);
        this._validateWeeksArray();
    }

    updateOptions(options: object) {
        const state = this._normalizeState(options);
        const changed = this._isStateChanged(state);
        this._state = state;
        if (changed) {
            this._validateWeeksArray();
            this._nextVersion();
        }
    }

    getMonthArray() {
        return this._modelArray;
    }

    protected _prepareClass(
        scope: {},
        fontColorStyle: string,
        backgroundStyle: string,
        borderStyle: string,
        fontWeight: string
    ): string {
        let textColorClass = 'controls-MonthView__textColor';
        let backgroundColorClass = 'controls-MonthView__backgroundColor';
        let backgroundColorClassRangeHovered;
        const css = [];

        if (detection.isIE11) {
            css.push('controls-MonthView__ieFix');
        }

        if (scope.isCurrentMonth) {
            css.push('controls-MonthViewVDOM__item_currentMonthDay');
            textColorClass += '-currentMonthDay';
            backgroundColorClass += '-currentMonthDay';
        } else {
            textColorClass += '-otherMonthDay';
            backgroundColorClass += '-otherMonthDay';
        }

        if (scope.today) {
            textColorClass += '-today';
        } else {
            textColorClass += scope.weekend ? '-weekend' : '-workday';
        }

        if (scope.selected && (scope.isCurrentMonth || scope.mode === 'extended')) {
            backgroundColorClass += '-selected';
            if (scope.selectedStart || scope.selectedEnd) {
                if (fontWeight !== 'normal') {
                    css.push('controls-MonthView__fontWeight');
                }
            }

            if (scope.selectedStart && scope.selectedEnd) {
                backgroundColorClass += '-startend';
            } else if (scope.selectionBase) {
                backgroundColorClass += '-base';
            } else if (scope.selectedStart) {
                backgroundColorClass += '-start';
            } else if (scope.selectedEnd) {
                backgroundColorClass += '-end';
            }

            if (
                scope.selectionProcessing &&
                !scope.selectionBase &&
                (scope.selectedEnd || scope.selectedStart)
            ) {
                backgroundColorClass += '-unfinished';
            }

            let borderColorClass = 'controls-MonthViewVDOM__item-border';

            const borderStylePostfix = borderStyle ? '_style-' + borderStyle : '';
            css.push(`${borderColorClass}${borderStylePostfix}`);

            borderColorClass = 'controls-MonthView__item-border';
            if (scope.selectedStart && scope.selectedEnd && !scope.selectionProcessing) {
                borderColorClass += '-start-end';
            } else if (scope.selectedStart && !scope.selectedUnfinishedStart) {
                borderColorClass += '-start';
            } else if (
                scope.selectedEnd &&
                (!scope.selectionProcessing ||
                    (scope.selectedEnd !== scope.selectedStart && !scope.selectedUnfinishedEnd))
            ) {
                borderColorClass += '-end';
            }
            if (scope.readOnly) {
                borderColorClass += '-readOnly';
            }
            css.push(`${borderColorClass}${borderStylePostfix}`);
        } else {
            backgroundColorClass += '-unselected';
        }

        if (scope.readOnly) {
            backgroundColorClass += '-readOnly';
            textColorClass += '-readOnly';
        }

        if (scope.isDayAvailable === false) {
            textColorClass += '-dayNotAvailable';
        }

        backgroundColorClassRangeHovered = backgroundColorClass + '-hovered';

        if (fontColorStyle) {
            textColorClass += '_style-' + fontColorStyle;
        }

        if (backgroundStyle) {
            backgroundColorClass += '_style-' + backgroundStyle;
            backgroundColorClassRangeHovered += '_style-' + backgroundStyle;
        }
        if (scope.isCurrentMonth || scope.mode === 'extended') {
            css.push(textColorClass, backgroundColorClass);
            if (scope.hovered) {
                css.push(backgroundColorClassRangeHovered);
            }
        }

        // Оставляем старые классы т.к. они используются в большом выборе периода до его редизайна
        // TODO: Выпилить старые классы
        if (scope.isCurrentMonth || scope.mode === 'extended') {
            if (scope.selected) {
                css.push('controls-MonthViewVDOM__item-selected');
            }

            if (!scope.readOnly) {
                if (scope.selectionEnabled) {
                    css.push('controls-MonthViewVDOM__cursor-item');
                }
                if (!scope.selected) {
                    let borderStyleLocal;
                    if (scope.selectionEnabled && this._singleDayHover) {
                        borderStyleLocal = 'controls-MonthView__border-currentMonthDay-unselected';
                    } else if (scope.hovered) {
                        borderStyleLocal = 'controls-MonthView__border-hover';
                    }
                    if (borderStyleLocal) {
                        borderStyleLocal += backgroundStyle ? '_style-' + backgroundStyle : '';
                        css.push(borderStyleLocal);
                    }
                }
                css.push('controls-MonthViewVDOM__selectableItem');
                if (scope.enabled && scope.selectionEnabled) {
                    css.push('controls-MonthViewVDOM__hover-selectableItem');
                }

                if (scope.selectedUnfinishedStart) {
                    css.push('controls-MonthViewVDOM__item-selectedStart-unfinished');
                }
                if (scope.selectedUnfinishedEnd) {
                    css.push('controls-MonthViewVDOM__item-selectedEnd-unfinished');
                }
                if (scope.selected) {
                    if (scope.selectedStart && scope.selectedEnd && !scope.selectionProcessing) {
                        css.push('controls-MonthViewVDOM__item-selectedStartEnd');
                    } else if (scope.selectedStart && !scope.selectedUnfinishedStart) {
                        css.push('controls-MonthViewVDOM__item-selectedStart');
                    } else if (
                        scope.selectedEnd &&
                        (!scope.selectionProcessing ||
                            (scope.selectedEnd !== scope.selectedStart &&
                                !scope.selectedUnfinishedEnd))
                    ) {
                        css.push('controls-MonthViewVDOM__item-selectedEnd');
                    }
                }
                if (scope.selectedInner) {
                    css.push('controls-MonthViewVDOM__item-selectedInner');
                }
            }

            if (scope.today) {
                css.push('controls-MonthViewVDOM__today');
                if (!scope.weekend) {
                    css.push('controls-MonthViewVDOM__workday-today');
                } else {
                    css.push('controls-MonthViewVDOM__weekend-today');
                }
            }
        }
        css.push(
            scope.isCalendar
                ? 'controls-MonthViewVDOM__currentMonthDay'
                : 'controls-MonthViewVDOM__' + scope.month
        );

        if (scope.weekend) {
            css.push('controls-MonthViewVDOM__weekend');
        } else {
            css.push('controls-MonthViewVDOM__workday');
        }

        return css.join(' ');
    }

    protected _normalizeState(state: object): object {
        return {
            month: DateUtil.normalizeDate(state.month),
            mode: state.mode,
            enabled: state.enabled,
            daysData: state.daysData,
            holidaysData: state.holidaysData,
            dateConstructor: state.dateConstructor || WSDate,
            readOnly: state.readOnly,
            dayFormatter: state.dayFormatter,
            _date: state._date,
        };
    }

    protected _isStateChanged(state: object): object {
        return (
            !DateUtil.isDatesEqual(state.month, this._state.month) ||
            state.daysData !== this._state.daysData ||
            state.holidaysData !== this._state.holidaysData
        );
    }

    protected _getDayObject(date: Date, state: {}, dayIndex: number): object {
        state = state || this._state;
        /* Опция _date устаналивается только(!) в демках, для возможности протестировать
         визуальное отображение текущей даты */
        const obj = {};
        const today = this._state._date
            ? DateUtil.normalizeDate(this._state._date)
            : DateUtil.normalizeDate(new this._state.dateConstructor());
        const firstDateOfMonth = DateUtil.getStartOfMonth(date);
        const lastDateOfMonth = DateUtil.getEndOfMonth(date);

        obj.readOnly = state.readOnly;
        obj.mode = state.mode;
        obj.date = date;
        obj.id = formatDate(date, 'YYYY-MM-DD');
        obj.day = date.getDate();
        obj.dayOfWeek = date.getDay() ? date.getDay() - 1 : 6;
        obj.isCurrentMonth = DateUtil.isMonthsEqual(date, state.month);
        obj.today = DateUtil.isDatesEqual(date, today);
        obj.month = date.getMonth();
        obj.firstDayOfMonth = DateUtil.isDatesEqual(date, firstDateOfMonth);
        obj.lastDayOfMonth = DateUtil.isDatesEqual(date, lastDateOfMonth);

        obj.selectionEnabled =
            this._state.selectionType !== IDateRangeSelectable.SELECTION_TYPES.disable &&
            !this._state.readOnly;

        obj.weekend = obj.dayOfWeek === 5 || obj.dayOfWeek === 6;
        if (state.holidaysData) {
            obj.weekend = state.holidaysData[obj.day - 1];
        }
        obj.enabled = state.enabled;
        obj.clickable = obj.mode === 'extended' || obj.isCurrentMonth;

        obj.hovered =
            state.hoveredStartValue <= obj.date &&
            state.hoveredStartValue !== null &&
            state.hoveredEndValue >= obj.date &&
            !DateUtil.isDatesEqual(state.hoveredStartValue, state.hoveredEndValue);

        obj.hoveredStartValue = state.hoveredStartValue;
        obj.hoveredEndValue = state.hoveredEndValue;

        if (state.dayFormatter) {
            coreMerge(obj, state.dayFormatter(date) || {});
        }

        if (state.daysData) {
            let dayDataIndex;
            if (obj.mode === 'extended') {
                dayDataIndex = dayIndex;
            } else {
                dayDataIndex = obj.day - 1;
            }
            obj.extData = state.daysData.at
                ? state.daysData.at(dayDataIndex)
                : state.daysData[dayDataIndex];
        }
        if (!obj.readOnly && this._isDayAvailable) {
            // Разделяем логику работы с readonly датой и с недоступной датой. Например, недоступный день в годовом
            // режиме красим серым, а в readonly - черным.
            const isDayAvailable = this._isDayAvailable(date, obj.extData);
            obj.readOnly = !isDayAvailable;
            obj.isDayAvailable = isDayAvailable;
        }
        obj.selectionBase = DateUtil.isDatesEqual(date, state.selectionBaseValue);

        return obj;
    }

    private _validateWeeksArray(state?: object): void {
        this._modelArray = this._getDaysArray(state);
    }

    private _getDaysArray(outerState?: object) {
        const state = outerState || this._state;
        const weeks = calendarUtils.getWeeksArray(state.month, state.mode, state.dateConstructor);
        let dayIndex = 0;

        return weeks.map((weekArray) => {
            return weekArray.map((day) => {
                const dayObject = this._getDayObject(day, state, dayIndex);
                dayIndex += 1;
                return dayObject;
            }, this);
        }, this);
    }
}
