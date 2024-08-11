/**
 * @kaizen_zone d7dff399-200f-4169-9c69-4c54617de7e8
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_shortDatePicker/YearsList');
import { Base as dateUtils } from 'Controls/dateUtils';
import { BORDER_CLASSES, BORDER_RADIUS_CLASSES } from './resources/constants';

interface IYearItemOptions extends IControlOptions {
    selectionProcessing: boolean;
    startValue: Date;
    endValue: Date;
    selectionBaseValue: Date;
    onYearClick: (event: Event, year: number) => void;
}

/**
 * Компонент - шаблон списка лет, для быстрого выбора периода при отключенных остальных квантах.
 * @private
 */

export default class YearsList extends Control<IYearItemOptions> {
    readonly '[Controls/_interface/IDateConstructor]': boolean = true;
    protected _template: TemplateFunction = template;

    private _mouseDownHandled: boolean = false;
    // При клике на элемент, сначала выстрелит событие mouseMove, а только потом click.
    // Это приводит к тому, что элемент выбирается моментально при первом клике (Т.к. стреляет сразу два itemClick).
    // Состояние нужно, для того чтобы проигнорировать первый mouseMove.
    private _mouseMoveHandled: boolean = false;

    protected _displayedRanges: [null | Date, null | Date][];

    protected _beforeMount(options: IYearItemOptions): void {
        const getDisplayedRanges = () => {
            if (options.displayedRanges) {
                return options.displayedRanges;
            }
            const currentDate = new Date();
            // Показываем следующий год только тогда, когда прошла половина текущего
            if (options.chooseAllYears && currentDate.getMonth() > 5) {
                return [[null, new Date(currentDate.getFullYear() + 1, 0)]];
            }
        };
        this._displayedRanges = getDisplayedRanges();
    }

    protected _afterMount() {
        this._notify('hoveredItemChanged', ['year'], { bubbling: true });
    }

    protected _onYearCornerClick(event: Event, startValue: Date): void {
        let value = startValue;
        if (this._options.selectionProcessing) {
            value = dateUtils.getEndOfYear(value);
        }
        this._mouseDownHandled = false;
        event.stopImmediatePropagation();
        this._notify('itemClick', [value], { bubbling: true });
    }

    protected _onMouseMove(event: Event, value: Date) {
        if (this._mouseDownHandled) {
            if (!this._mouseMoveHandled) {
                this._mouseMoveHandled = true;
            } else {
                this._mouseDownHandled = false;
                this._notify('itemClick', [value, event], { bubbling: true });
            }
        }
    }

    protected _onMouseDown(event: Event, date?: Date, selectionType?: string) {
        if (!this._options.selectionProcessing && this._options.multiSelect) {
            this._mouseDownHandled = true;
            if (selectionType) {
                this._notify('selectionTypeChanged', [selectionType], { bubbling: true });
            }
        }
    }

    protected _onMouseUp(event: Event, value: Date) {
        if (this._options.selectionProcessing && this._options.multiSelect) {
            const endValue = dateUtils.getEndOfYear(value);
            this._notify('itemClick', [endValue], { bubbling: true });
        }
    }

    protected _positionChangeHandler(_: Event, position: Date): void {
        this._notify('positionChanged', [position]);
    }

    protected _onYearMouseEnter(_: Event, value: Date): void {
        this._notify('hoveredItemChanged', ['year'], { bubbling: true });
        this._notify('itemMouseEnter', [value], { bubbling: true });
    }

    protected _startCornerVisible(value: Date): boolean {
        if (
            (this._options.selectionProcessing &&
                this._options.startValue >= this._options.selectionBaseValue &&
                !dateUtils.isYearsEqual(this._options.endValue, this._options.startValue)) ||
            (!this._options.selectionProcessing &&
                dateUtils.isYearsEqual(this._options.startValue, this._options.endValue))
        ) {
            return false;
        }
        return this._isSelectedEnd(value);
    }

    protected _isSelectedStart(value: Date): boolean {
        const startValue = new Date(
            this._options?.startValue?.getFullYear(),
            this._options?.startValue?.getMonth(),
            this._options?.startValue?.getDate()
        );
        return dateUtils.isDatesEqual(startValue, value);
    }

    protected _endCornerVisible(value: Date): boolean {
        if (
            this._options.selectionProcessing &&
            this._options.startValue < this._options.selectionBaseValue
        ) {
            return false;
        }
        if (dateUtils.isYearsEqual(this._options.startValue, this._options.endValue)) {
            return false;
        }
        return this._isSelectedStart(value);
    }

    protected _isSelectedEnd(value: Date): boolean {
        const endOfPeriod = dateUtils.getEndOfYear(value);
        const endValue = new Date(
            this._options?.endValue?.getFullYear(),
            this._options?.endValue?.getMonth(),
            this._options?.endValue?.getDate()
        );
        return dateUtils.isDatesEqual(endValue, endOfPeriod);
    }

    protected _isSelectedPeriod(value: Date): boolean {
        const range = [this._options.startValue, this._options.endValue];
        return (
            dateUtils.hitsDisplayedRanges(value, [range]) &&
            dateUtils.hitsDisplayedRanges(dateUtils.getEndOfYear(value), [range]) &&
            !!(this._options.startValue || this._options.endValue)
        );
    }

    protected _onYearClick(event: Event, year: Date): void {
        if (this._options.selectionProcessing) {
            this._notify('itemClick', [dateUtils.getEndOfYear(year)], { bubbling: true });
            return;
        }
        this._options.onYearClick(event, year.getFullYear());
    }

    protected _getSelectionClassName(value: Date): string {
        let className = '';
        if (this._options.hovered && !this._options.selectionProcessing) {
            return className;
        }
        const startValue = this._options?.startValue
            ? new Date(
                  this._options?.startValue?.getFullYear(),
                  this._options?.startValue?.getMonth(),
                  this._options?.startValue?.getDate()
              )
            : this._options?.startValue;
        const endValue = this._options?.endValue
            ? new Date(
                  this._options?.endValue?.getFullYear(),
                  this._options?.endValue?.getMonth(),
                  this._options?.endValue?.getDate()
              )
            : this._options?.endValue;
        if (!startValue && !endValue) {
            return className;
        }
        const periodStartValue = value;
        const periodEndValue = dateUtils.getEndOfYear(value);
        const isSelected = () => {
            const range = [startValue, endValue];
            return (
                dateUtils.hitsDisplayedRanges(periodStartValue, [range]) &&
                dateUtils.hitsDisplayedRanges(periodEndValue, [range])
            );
        };
        const isPeriodSelected = isSelected();
        if (isPeriodSelected) {
            className += BORDER_CLASSES.left;
            className += BORDER_CLASSES.right;

            if (this._options.endValue && this._options.startValue) {
                if (dateUtils.isDatesEqual(periodStartValue, this._options.startValue)) {
                    className += BORDER_CLASSES.bottom;
                    className += BORDER_RADIUS_CLASSES.bottomRight;
                    className += BORDER_RADIUS_CLASSES.bottomLeft;
                }
                if (dateUtils.isDatesEqual(periodEndValue, this._options.endValue)) {
                    className += BORDER_CLASSES.top;
                    className += BORDER_RADIUS_CLASSES.topRight;
                    className += BORDER_RADIUS_CLASSES.topLeft;
                }
            }
        }
        return className;
    }
}
