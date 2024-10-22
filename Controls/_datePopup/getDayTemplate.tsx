import * as React from 'react';

export default function getDayTemplate(
    BaseDayTemplate: React.FunctionComponent
): React.FunctionComponent | React.Component {
    function DayTemplate(props: object): React.ReactElement {
        const isSelectedStart = (): boolean => {
            return (
                props.value.selectedStart &&
                (!props.value.selectedStart || !props.value.selectedEnd)
            );
        };

        const isSelectedEnd = (): boolean => {
            return (
                props.value.selectedEnd && (!props.value.selectedStart || !props.value.selectedEnd)
            );
        };

        return (
            <BaseDayTemplate
                {...props}
                date={props.value.day}
                sizeStyle="monthRangeItem"
                backgroundStyle="monthRangeItem"
                fontColorStyle="monthRangeItem"
                borderStyle="monthRangeItem"
                fontWeight="normal"
                contentTemplate={() => {
                    return (
                        <>
                            <div>{props.value.day}</div>
                            {isSelectedStart() ? (
                                <div className="controls-PeriodDialog-MonthsRange__month__day_selected__container controls-PeriodDialog-MonthsRange__month__day_selected__container-start">
                                    <div className="controls-PeriodDialog-MonthsRange__month__day_selected controls-PeriodDialog-MonthsRange__month__day_selected-start"></div>
                                </div>
                            ) : null}
                            {isSelectedEnd() ? (
                                <div className="controls-PeriodDialog-MonthsRange__month__day_selected__container controls-PeriodDialog-MonthsRange__month__day_selected__container-end">
                                    <div className="controls-PeriodDialog-MonthsRange__month__day_selected controls-PeriodDialog-MonthsRange__month__day_selected-end"></div>
                                </div>
                            ) : null}
                        </>
                    );
                }}
            />
        );
    }

    return DayTemplate;
}
