/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import MonthView from '../MonthView';
import ExtDataModel from './ExtDataModel';

interface IMonthTemplateProps extends TInternalProps, IControlProps {
    extData: ExtDataModel;
    headerTemplate: React.ReactElement;
    bodyTemplate: React.ReactElement;
    dayHeaderTemplate: React.ReactElement;
    dayTemplate: React.ReactElement;
    monthProps: object;
    date: Date;
    startValue: Date;
    endValue: Date;
    dateId: string;
    newMode: boolean;
}

export default React.forwardRef(function MonthTemplate(
    props: IMonthTemplateProps,
    ref: React.Ref
): React.ReactElement {
    return (
        <div
            className={`controls-MonthList__month controls_calendar_theme-${props.theme} ${
                props.className || ''
            }`}
            ref={ref}
        >
            <div className="controls-MonthList__month-header">
                {!!props.headerTemplate && (
                    <props.headerTemplate date={props.date} extData={props.extData} />
                )}
            </div>
            <div className="controls-MonthList__month-body">
                {!!props.bodyTemplate ? (
                    <props.bodyTemplate
                        monthProps={props.monthProps}
                        date={props.date}
                        extData={props.extData}
                        startValue={props.startValue}
                        endValue={props.endValue}
                        holidaysData={props.holidaysData}
                    />
                ) : (
                    <MonthView
                        newMode={props.newMode}
                        startValue={props.startValue}
                        endValue={props.endValue}
                        className="controls-MonthList__month-body"
                        data-date={props.dateId}
                        showWeekdays={false}
                        month={props.date}
                        daysData={props.extData}
                        holidaysData={props.holidaysData}
                        dayTemplate={props.dayTemplate}
                        dayHeaderTemplate={props.dayHeaderTemplate}
                    />
                )}
            </div>
        </div>
    );
});
