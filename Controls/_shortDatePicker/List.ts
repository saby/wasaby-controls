/**
 * @kaizen_zone d7dff399-200f-4169-9c69-4c54617de7e8
 */

import { Control, TemplateFunction } from 'UI/Base';
import componentTmpl = require('wml!Controls/_shortDatePicker/List');
import { Base as dateUtils } from 'Controls/dateUtils';
import {
    BORDER_RADIUS_CLASSES,
    BORDER_CLASSES,
} from './resources/constants';

class View extends Control {
    protected _template: TemplateFunction = componentTmpl;

    protected _proxyEvent(event: Event): void {
        this._notify(event.type, Array.prototype.slice.call(arguments, 1));
    }

    protected _itemClickHandler(event: Event, value: Date, mouseEvent: Event): void {
        if (mouseEvent) {
            this._children.dragNDrop.startDragNDrop({ allowAutoscroll: true }, mouseEvent);
        }
        this._notify('itemClick', [value, mouseEvent]);
    }

    protected _isYearSelected(year: number): boolean {
        const startValueYear = this._options.startValue?.getFullYear();
        const endValueYear = this._options.endValue?.getFullYear();
        return (
            dateUtils.isStartOfYear(this._options.startValue) &&
            startValueYear <= year &&
            (dateUtils.isEndOfYear(this._options.endValue) && endValueYear >= year)
        );
    }

    protected _isSelectedYearStart(year: number): boolean {
        const startValueYear = this._options.startValue?.getFullYear();
        return this._isYearSelected(year) && startValueYear === year;
    }

    protected _isSelectedYearEnd(year: number): boolean {
        const endValueYear = this._options.endValue?.getFullYear();
        return this._isYearSelected(year) && endValueYear === year;
    }

    protected _getSelectedYearHeaderClassNames(value: Date): string {
        const year = value.getFullYear();
        const isSelected = this._isYearSelected(year);
        const isSelectedStart = this._isSelectedYearStart(year);
        let className = '';
        if (isSelected && (!this._options.hovered || this._options.selectionProcessing)) {
            className += ' controls-PeriodLiteDialog__item-selected';
            if (isSelectedStart) {
                className += BORDER_RADIUS_CLASSES.topLeft;
                className += BORDER_RADIUS_CLASSES.topRight;
                className += BORDER_CLASSES.top;
            }
            className += BORDER_CLASSES.left;
            className += BORDER_CLASSES.right;
        }
        if (isSelectedStart) {
            className += ' controls-PeriodLiteDialog__item_border-radius-top';
        }
        return className;
    }
}

export default View;
