/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import { MonthModel } from 'Controls/calendar';
import { Base } from 'Controls/dateUtils';

const BORDER_RADIUS_CLASSES = {
    bottomRight: ' controls-MonthView_item_border-bottom-right-radius',
    topRight: ' controls-MonthView_item_border-top-right-radius',
    bottomLeft: ' controls-MonthView_item_border-bottom-left-radius',
    topLeft: ' controls-MonthView_item_border-top-left-radius',
};

const BORDER_CLASSES = {
    top: ' controls-MonthView_item_border-top',
    bottom: ' controls-MonthView_item_border-bottom',
    left: ' controls-MonthView_item_border-left',
    right: ' controls-MonthView_item_border-right',
};

const getBorderClass = (direction: string, borderStyle: string) => {
    return BORDER_CLASSES[direction] + '__style-' + borderStyle;
};

const getBorderRadiusClass = (direction: string, borderStyle: string) => {
    return BORDER_RADIUS_CLASSES[direction] + '__style-' + borderStyle;
};

export default class CompactMonthModel extends MonthModel {
    protected _getDayObject(date: Date, state: {}, dayIndex: number): object {
        const dayObject = super._getDayObject(date, state, dayIndex);
        dayObject.startValue = state.startValue;
        dayObject.endValue = state.endValue;
        return dayObject;
    }

    protected _prepareClass(
        scope: {},
        fontColorStyle: string,
        backgroundStyle: string,
        borderStyle: string,
        fontWeight: string,
        selectionStyle?: string,
        counterProperty?: string
    ): string {
        let cssClass = super._prepareClass(
            scope,
            fontColorStyle,
            backgroundStyle,
            borderStyle,
            fontWeight
        );

        const daysInWeek = 7;
        const getAdjacentDay = (delta: number) => {
            return new Date(
                scope.date.getFullYear(),
                scope.date.getMonth(),
                scope.date.getDate() + delta
            );
        };

        const isSelected = (value: Date, startValue: Date, endValue: Date): boolean => {
            return startValue <= value && (endValue >= value || endValue === null);
        };

        const dayOverCurrentDay = getAdjacentDay(-daysInWeek);
        const dayUnderCurrentDay = getAdjacentDay(daysInWeek);
        let dayOverCurrentDaySelected;
        let dayUnderCurrentDaySelected;

        if (selectionStyle === 'brand') {
            cssClass += ' controls-CompactDatePicker__selectionStyle-brand';
        }

        const setSelectionStartClassName = (selectedStart) => {
            if (selectedStart) {
                if (dayUnderCurrentDaySelected) {
                    cssClass += getBorderRadiusClass('topLeft', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                        cssClass += getBorderClass('bottom', borderStyle);
                    }
                } else {
                    cssClass += `${getBorderRadiusClass(
                        'topLeft',
                        borderStyle
                    )} ${getBorderRadiusClass('bottomLeft', borderStyle)}`;
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                }
                if (!Base.isMonthsEqual(scope.date, dayUnderCurrentDay)) {
                    cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('top', borderStyle);
                    }
                }
            }
            return cssClass;
        };

        const setSelectionEndClassName = (selectedEnd) => {
            if (selectedEnd) {
                if (dayOverCurrentDaySelected) {
                    cssClass += getBorderRadiusClass('bottomRight', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('top', borderStyle);
                        cssClass += getBorderRadiusClass('topRight', borderStyle);
                    }
                } else {
                    cssClass += `${getBorderRadiusClass(
                        'bottomRight',
                        borderStyle
                    )} ${getBorderRadiusClass('topRight', borderStyle)}`;
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                }
                if (!Base.isMonthsEqual(scope.date, dayOverCurrentDay)) {
                    cssClass += getBorderRadiusClass('topRight', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('bottom', borderStyle);
                    }
                }
            }
        };

        const setWeekEdgeStartClassName = () => {
            if (scope.date.getDay() === 1) {
                cssClass += ' controls-MonthView_item_startOfTheWeek_border-radius';
                if (
                    !dayOverCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayOverCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('topLeft', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                        cssClass += getBorderClass('bottom', borderStyle);
                    }
                }
                if (
                    !dayUnderCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayUnderCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderRadiusClass('topLeft', borderStyle);
                        cssClass += getBorderClass('top', borderStyle);
                    }
                }
            }
        };

        const setWeekEdgeEndClassName = () => {
            if (scope.date.getDay() === 0) {
                cssClass += ' controls-MonthView_item_endOfTheWeek_border-radius';
                if (
                    !dayOverCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayOverCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('topRight', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('bottom', borderStyle);
                        cssClass += getBorderRadiusClass('bottomRight', borderStyle);
                    }
                }
                if (
                    !dayUnderCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayUnderCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('bottomRight', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('top', borderStyle);
                        cssClass += getBorderRadiusClass('topRight', borderStyle);
                    }
                }
            }
        };

        const getClassName = (startValue, endValue, selectedStart, selectedEnd) => {
            if (scope.isCurrentMonth && (startValue || endValue)) {
                dayOverCurrentDaySelected = isSelected(dayOverCurrentDay, startValue, endValue);
                dayUnderCurrentDaySelected = isSelected(dayUnderCurrentDay, startValue, endValue);
                setSelectionStartClassName(selectedStart);
                setSelectionEndClassName(selectedEnd);
                setWeekEdgeStartClassName();
                setWeekEdgeEndClassName();
                if (Base.isEndOfMonth(scope.date)) {
                    cssClass += getBorderRadiusClass('bottomRight', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('top', borderStyle);
                        cssClass += getBorderRadiusClass('topRight', borderStyle);
                    }
                    if (!dayOverCurrentDaySelected) {
                        cssClass += getBorderRadiusClass('topRight', borderStyle);
                        cssClass += getBorderClass('top', borderStyle);
                        cssClass += getBorderClass('right', borderStyle);
                        if (counterProperty) {
                            cssClass += getBorderClass('bottom', borderStyle);
                        }
                    }
                }

                if (Base.isStartOfMonth(scope.date)) {
                    cssClass += getBorderRadiusClass('topLeft', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                    if (counterProperty) {
                        cssClass += getBorderClass('bottom', borderStyle);
                        cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                    }
                    if (!dayUnderCurrentDaySelected) {
                        cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                        cssClass += getBorderClass('bottom', borderStyle);
                        cssClass += getBorderClass('left', borderStyle);
                    }
                }

                if (!dayOverCurrentDaySelected && counterProperty) {
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                } else if (
                    !dayOverCurrentDaySelected ||
                    (dayOverCurrentDaySelected &&
                        scope.date.getMonth() !== dayOverCurrentDay.getMonth())
                ) {
                    cssClass += getBorderClass('top', borderStyle);
                }

                if (!dayUnderCurrentDaySelected && counterProperty) {
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                } else if (
                    !dayUnderCurrentDaySelected ||
                    (dayUnderCurrentDaySelected &&
                        scope.date.getMonth() !== dayUnderCurrentDay.getMonth())
                ) {
                    cssClass += getBorderClass('bottom', borderStyle);
                }

                if (scope.date.getDay() === 0) {
                    if (counterProperty) {
                        cssClass += getBorderClass('top', borderStyle);
                        cssClass += getBorderClass('bottom', borderStyle);
                        cssClass += getBorderRadiusClass('bottomRight', borderStyle);
                        cssClass += getBorderRadiusClass('topRight', borderStyle);
                    }
                    cssClass += getBorderClass('right', borderStyle);
                }

                if (scope.date.getDay() === 1) {
                    if (counterProperty) {
                        cssClass += getBorderClass('bottom', borderStyle);
                        cssClass += getBorderClass('top', borderStyle);
                        cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                        cssClass += getBorderRadiusClass('topLeft', borderStyle);
                    }
                    cssClass += getBorderClass('left', borderStyle);
                } else if (counterProperty) {
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                }
            }
        };
        if (scope.hovered && !scope.selectionProcessing) {
            const isHoveredStart = Base.isDatesEqual(scope.date, scope.hoveredStartValue);
            const isHoveredEnd = Base.isDatesEqual(scope.date, scope.hoveredEndValue);
            cssClass += ' controls-CompactDatePicker__multiHovered';
            getClassName(
                scope.hoveredStartValue,
                scope.hoveredEndValue,
                isHoveredStart,
                isHoveredEnd
            );
        } else if (scope.selected) {
            getClassName(scope.startValue, scope.endValue, scope.selectedStart, scope.selectedEnd);
        }

        return cssClass;
    }
}
