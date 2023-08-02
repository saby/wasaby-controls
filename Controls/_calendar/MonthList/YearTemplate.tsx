/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import ExtDataModel from './ExtDataModel';

interface IYearTemplateProps extends TInternalProps, IControlProps {
    extData: ExtDataModel;
    headerTemplate: React.ReactElement;
    bodyTemplate: React.ReactElement;
    dayHeaderTemplate: React.ReactElement;
    dayTemplate: React.ReactElement;
    monthCaptionTemplate: React.ReactElement;
    _dateToDataString: Function;
    _formatMonth: Function;
    _getMonth: Function;
    date: Date;
    startValue: Date;
    endValue: Date;
}

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default React.forwardRef(function YearTemplate(
    props: IYearTemplateProps,
    ref: React.Ref
): React.ReactElement {
    return (
        <div
            className={`controls-MonthList__year controls_calendar_theme-${props.theme} ${
                props.className || ''
            }`}
            ref={ref}
        >
            <div className="controls-MonthList__year-header">
                <div className="controls-MonthList__month-header">
                    {!!props.headerTemplate && (
                        <props.headerTemplate date={props.date} extData={props.extData} />
                    )}
                </div>
            </div>

            <div
                className="controls-MonthList__year-months"
                data-qa="controls-MonthList__year-months"
                data-date={props._dateToDataString(props.date)}
            >
                {!!props.bodyTemplate ? (
                    <props.bodyTemplate
                        date={props.date}
                        extData={props.extData}
                        startValue={props.startValue}
                        endValue={props.endValue}
                        _dateToDataString={props._dateToDataString}
                    />
                ) : (
                    MONTHS.map((month) => {
                        return (
                            <React.Fragment key={`month-${month}`}>
                                <props.monthTemplate
                                    startValue={props.startValue}
                                    endValue={props.endValue}
                                    date={props._getMonth(props.date.getFullYear(), month)}
                                    extData={props.extData?.[month]}
                                    _formatMonth={props._formatMonth}
                                    dayTemplate={props.dayTemplate}
                                    dayHeaderTemplate={props.dayHeaderTemplate}
                                    monthCaptionTemplate={props.monthCaptionTemplate}
                                />
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </div>
    );
});
