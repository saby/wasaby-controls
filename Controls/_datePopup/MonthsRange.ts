/**
 * @kaizen_zone 3000b102-db75-420e-bda6-37c50495ae25
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Date as WSDate } from 'Types/entity';
import { date as formatDate } from 'Types/formatter';
import {
    DateRangeModel,
    IDateRangeSelectableOptions,
    IRangeSelectableOptions,
    IDateRangeOptions,
} from 'Controls/dateRange';
import { EventUtils } from 'UI/Events';
import { Base as dateUtils } from 'Controls/dateUtils';
import MonthsRangeItem from './MonthsRangeItem';
import * as componentTmpl from 'wml!Controls/_datePopup/MonthsRange';
import 'css!Controls/datePopup';
import { IDateConstructorOptions } from 'Controls/_interface/IDateConstructor';
import { TouchDetect } from 'EnvTouch/EnvTouch';

interface IMonthsRangeOptions
    extends IControlOptions,
        IDateConstructorOptions,
        IRangeSelectableOptions,
        IDateRangeSelectableOptions,
        IDateRangeOptions {
    position: Date;
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

    _proxyEvent: Function = EventUtils.tmplNotify;

    _position: Date;
    _rangeModel: DateRangeModel;

    _formatDate: Function = formatDate;

    _selectionViewType: string;

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
        this._updateSelectionType(options);
        this._setShouldShowSelectedPeriodCorners(options);
    }

    protected _isCurrentYear(year: number): boolean {
        return year === new Date().getFullYear();
    }

    protected _isYearOrYearsSelected(startValue: Date, endValue: Date): boolean {
        return dateUtils.isStartOfYear(startValue) && dateUtils.isEndOfYear(endValue);
    }

    protected _isMonthSelected(startValue: Date, endValue: Date): boolean {
        return (
            startValue.getFullYear() === endValue.getFullYear() &&
            startValue.getMonth() === endValue.getMonth() &&
            dateUtils.isStartOfMonth(startValue) &&
            dateUtils.isEndOfMonth(endValue)
        );
    }

    protected _setShouldShowSelectedPeriodCorners(options: IMonthsRangeOptions): void {
        const { startValue, endValue } = options;
        if (
            this._isMonthSelected(startValue || new Date(), endValue || new Date()) ||
            this._isYearOrYearsSelected(startValue || new Date(), endValue || new Date())
        ) {
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
        if (!options.selectionProcessing) {
            this._updateSelectionType(options);
        } else {
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

    protected _onItemClick(event: Event): void {
        event.stopPropagation();
    }

    protected _mouseEnterHandler(): void {
        if (!this._options.selectionProcessing && !TouchDetect.getInstance().isTouch()) {
            this._hovered = true;
        }
    }

    protected _mouseLeaveHandler(): void {
        this._hovered = false;
    }

    protected _onPositionChanged(e: Event, position: Date): void {
        this._notify('positionChanged', [position]);
    }

    private _updateSelectionType(options: IMonthsRangeOptions): void {
        if (
            dateUtils.isStartOfMonth(options.startValue) &&
            dateUtils.isEndOfMonth(options.endValue)
        ) {
            this._selectionViewType = MonthsRangeItem.SELECTION_VIEW_TYPES.months;
        } else {
            this._selectionViewType = MonthsRangeItem.SELECTION_VIEW_TYPES.days;
        }
    }
}

Component.SELECTION_VIEW_TYPES = MonthsRangeItem.SELECTION_VIEW_TYPES;

Component.getDefaultOptions = (): {} => {
    return {
        selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.days,
        dateConstructor: WSDate,
    };
};

// Component.getOptionTypes = function() {
//    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
// };

export default Component;
