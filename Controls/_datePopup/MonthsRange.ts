/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { IDateConstructorOptions } from 'Controls/_interface/IDateConstructor';
import {
    DateRangeModel,
    IDateRangeOptions,
    IDateRangeSelectableOptions,
    IRangeSelectableOptions,
} from 'Controls/dateRange';
import { Base as dateUtils } from 'Controls/dateUtils';
import { detection } from 'Env/Env';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { EventUtils, SyntheticEvent } from 'UI/Events';
import 'css!Controls/datePopup';
import * as componentTmpl from 'wml!Controls/_datePopup/MonthsRange';
import MonthsRangeItem from './MonthsRangeItem';

interface IMonthsRangeOptions
    extends IControlOptions,
        IDateConstructorOptions,
        IRangeSelectableOptions,
        IDateRangeSelectableOptions,
        IDateRangeOptions {
    position: Date;
    selectionProcessing: boolean;
}

/**
 * Component that allows you to select a period of multiple months.
 *
 * @class Controls/_datePopup/MonthsRange
 * @extends UI/Base:Control
 *
 * @author Ковалев Г.Д.
 * @private
 */

class Component extends Control<IMonthsRangeOptions> {
    protected _template: TemplateFunction = componentTmpl;

    protected _hovered: boolean = false;

    protected _shouldShowSelectedPeriodCorners: boolean = true;

    protected _isYearSelecting: boolean = false;

    protected _hoveredYear: number | null = null;

    _proxyEvent: Function = EventUtils.tmplNotify;

    _position: Date;
    _rangeModel: DateRangeModel;

    _formatDate: Function = formatDate;

    constructor(options: IMonthsRangeOptions, context?: object) {
        super(options, context);
        this._rangeModel = new DateRangeModel({
            dateConstructor: options.dateConstructor,
        });
        EventUtils.proxyModelEvents(this, this._rangeModel, [
            'startValueChanged',
            'endValueChanged',
        ]);
    }
    protected _beforeMount(options: IMonthsRangeOptions): void {
        this._position = dateUtils.getStartOfYear(
            options.position || new options.dateConstructor()
        );
        this._rangeModel.update(options);
        this._setShouldShowSelectedPeriodCorners(options);
    }

    protected _isCurrentYear(year: number): boolean {
        return year === new Date().getFullYear();
    }

    protected _isYearOrYearsSelected(startValue: Date, endValue: Date): boolean {
        return dateUtils.isStartOfYear(startValue) && dateUtils.isEndOfYear(endValue);
    }

    protected _isYearSelectAvailable(): boolean {
        const { selectionType, isDayAvailable } = this._options;
        return selectionType === 'range' && !isDayAvailable;
    }

    protected _onHeaderClick(_: Event, date: Date): void {
        if (!this._isYearSelectAvailable()) {
            return;
        }
        this._notifyYearSelection(date);
    }

    protected _onHeaderMouseEnter(event: Event, date: Date): void {
        event.stopPropagation();
        if (this._isYearSelecting) {
            this._notify('itemMouseEnter', [
                date,
                {
                    selectionType: 'quantum',
                    quantum: {
                        years: [],
                    },
                },
            ]);
        } else {
            this._hoveredYear = date.getFullYear();
        }
    }

    protected _onHeaderMouseLeave(_: Event): void {
        this._hoveredYear = null;
        if (this._isYearSelecting) {
            this._notify('itemMouseLeave');
        }
    }

    protected _onMouseItemEnter(event: SyntheticEvent, month: Date): void {
        if (this._isYearSelecting) {
            event.stopPropagation();
            this._notify('itemMouseEnter', [
                month,
                {
                    selectionType: 'quantum',
                    quantum: {
                        years: [],
                    },
                },
            ]);
            return;
        }
        this._notify('itemMouseEnter', [month]);
    }

    protected _onMouseItemLeave(event: SyntheticEvent, month: Date): void {
        if (this._isYearSelecting) {
            event.stopPropagation();
            this._notify('itemMouseLeave', [month]);
            return;
        }
        this._notify('itemMouseLeave', [month]);
    }

    protected _setShouldShowSelectedPeriodCorners(options: IMonthsRangeOptions): void {
        const { startValue, endValue } = options;
        if (this._isYearOrYearsSelected(startValue, endValue) && !this._isYearSelecting) {
            this._shouldShowSelectedPeriodCorners = false;
        } else {
            this._shouldShowSelectedPeriodCorners = true;
        }
    }

    protected _beforeUpdate(options: IMonthsRangeOptions): void {
        this._rangeModel.update(options);
        if (options.position.getFullYear() !== this._position.getFullYear()) {
            this._position = dateUtils.getStartOfYear(options.position);
        }
        // If the user selects the period using this control,
        // then we have already set the selection type and do not need to update it.
        if (options.selectionProcessing) {
            this._hovered = false;
        }
        this._setShouldShowSelectedPeriodCorners(options);
    }

    protected _beforeUnmount(): void {
        this._rangeModel.destroy();
    }

    protected _getHoveredStartValue(date: Date): Date | null {
        if (
            !this._options.hoveredStartValue ||
            this._options.hoveredStartValue?.getFullYear() !== date.getFullYear()
        ) {
            return null;
        }
        return this._options.hoveredStartValue;
    }

    protected _getHoveredEndValue(date: Date): Date | null {
        if (
            !this._options.hoveredEndValue ||
            this._options.hoveredEndValue?.getFullYear() !== date.getFullYear()
        ) {
            return null;
        }
        return this._options.hoveredEndValue;
    }

    protected _onFixedPeriodClick(event: Event, start: Date, end: Date) {
        event.stopPropagation();
        if (this._isYearSelecting) {
            this._notifyYearSelection(end);
            return;
        }
        this._notify('fixedPeriodClick', [start, end]);
    }

    protected _onMouseItemClick(event: Event, date: Date) {
        event.stopPropagation();
        if (this._isYearSelecting) {
            this._notifyYearSelection(date);
            return;
        }
        this._notify('itemClick', [date]);
    }

    protected _onItemClick(event: Event): void {
        event.stopPropagation();
        if (this._options.selectionProcessing) {
            this._hovered = true;
        }
    }

    protected _mouseEnterHandler(): void {
        if (!this._options.selectionProcessing && !TouchDetect.getInstance().isTouch()) {
            this._hovered = true;
        }
    }

    protected _mouseLeaveHandler(): void {
        this._isYearSelecting = false;
        this._hovered = false;
        this._notify('yearSelectionEnded');
    }

    protected _onPositionChanged(e: Event, position: Date): void {
        this._notify('positionChanged', [position]);
    }

    protected _notifyYearSelection(date: Date) {
        this._isYearSelecting = !this._isYearSelecting;
        if (this._isYearSelecting) {
            this._notify('monthsRangeYearSelectionStarted');
        }
        this._notify('itemClick', [
            date,
            {
                selectionType: 'quantum',
                quantum: {
                    years: [],
                },
            },
        ]);
    }

    protected _getVirtualPageSize(): number {
        if (detection.isMobilePlatform) {
            return 3;
        }
        if (this._options.shouldPositionBelow) {
            return 3;
        }
        return 2;
    }

    protected _getSegmentSize(): number {
        if (detection.isMobilePlatform) {
            return 10;
        }
    }
}

Component.SELECTION_VIEW_TYPES = MonthsRangeItem.SELECTION_VIEW_TYPES;

Component.getDefaultOptions = (): {} => {
    return {
        dateConstructor: WSDate,
    };
};

// Component.getOptionTypes = function() {
//    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
// };

export default Component;
