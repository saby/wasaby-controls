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
        fontWeight: string
    ): string {
        let cssClass = super._prepareClass(
            scope,
            fontColorStyle,
            backgroundStyle,
            borderStyle,
            fontWeight
        );
        if (scope.selected && scope.isCurrentMonth) {
            const daysInWeek = 7;
            const getAdjacentDay = (delta: number) => {
                return new Date(
                    scope.date.getFullYear(),
                    scope.date.getMonth(),
                    scope.date.getDate() + delta
                );
            };
            const dayOverCurrentDay = getAdjacentDay(-daysInWeek);
            const dayUnderCurrentDay = getAdjacentDay(daysInWeek);
            const dayOverCurrentDaySelected = Base.hitsDisplayedRanges(
                dayOverCurrentDay,
                [[scope.startValue, scope.endValue]]
            );
            const dayUnderCurrentDaySelected = Base.hitsDisplayedRanges(
                dayUnderCurrentDay,
                [[scope.startValue, scope.endValue]]
            );
            if (scope.selectedStart) {
                if (dayUnderCurrentDaySelected) {
                    cssClass += getBorderRadiusClass('topLeft', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
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
                }
            }
            if (scope.selectedEnd) {
                if (dayOverCurrentDaySelected) {
                    cssClass += getBorderRadiusClass(
                        'bottomRight',
                        borderStyle
                    );
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
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
                }
            }
            if (scope.date.getDay() === 1) {
                if (
                    !dayOverCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayOverCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('topLeft', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                }
                if (
                    !dayUnderCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayUnderCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                }
            }
            if (scope.date.getDay() === 0) {
                if (
                    !dayOverCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayOverCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass('topRight', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                }
                if (
                    !dayUnderCurrentDaySelected ||
                    !Base.isMonthsEqual(scope.date, dayUnderCurrentDay)
                ) {
                    cssClass += getBorderRadiusClass(
                        'bottomRight',
                        borderStyle
                    );
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                }
            }
            if (Base.isEndOfMonth(scope.date)) {
                cssClass += getBorderRadiusClass('bottomRight', borderStyle);
                cssClass += getBorderClass('bottom', borderStyle);
                cssClass += getBorderClass('right', borderStyle);
                if (!dayOverCurrentDaySelected) {
                    cssClass += getBorderRadiusClass('topRight', borderStyle);
                    cssClass += getBorderClass('top', borderStyle);
                    cssClass += getBorderClass('right', borderStyle);
                }
            }

            if (Base.isStartOfMonth(scope.date)) {
                cssClass += getBorderRadiusClass('topLeft', borderStyle);
                cssClass += getBorderClass('top', borderStyle);
                cssClass += getBorderClass('left', borderStyle);
                if (!dayUnderCurrentDaySelected) {
                    cssClass += getBorderRadiusClass('bottomLeft', borderStyle);
                    cssClass += getBorderClass('bottom', borderStyle);
                    cssClass += getBorderClass('left', borderStyle);
                }
            }
            if (
                !dayOverCurrentDaySelected ||
                (dayOverCurrentDaySelected &&
                    scope.date.getMonth() !== dayOverCurrentDay.getMonth())
            ) {
                cssClass += getBorderClass('top', borderStyle);
            }

            if (
                !dayUnderCurrentDaySelected ||
                (dayUnderCurrentDaySelected &&
                    scope.date.getMonth() !== dayUnderCurrentDay.getMonth())
            ) {
                cssClass += getBorderClass('bottom', borderStyle);
            }

            if (scope.date.getDay() === 0) {
                cssClass += getBorderClass('right', borderStyle);
            }

            if (scope.date.getDay() === 1) {
                cssClass += getBorderClass('left', borderStyle);
            }
        }

        return cssClass;
    }
}
