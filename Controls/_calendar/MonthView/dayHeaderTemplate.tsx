/**
 * @kaizen_zone d2a998fc-24d6-438a-a155-71c7a06ce971
 */
import * as React from 'react';

interface IDayHeaderTemplateProps {
    value: { caption: string };
    newMode: boolean;
    sizeStyle?: string;
}

export default function DayHeaderTemplate(props: IDayHeaderTemplateProps): React.ReactElement {
    return (
        <div
            className={
                `controls-MonthViewVDOM__item controls-MonthViewVDOM__item_style-${
                    props.sizeStyle || 'default'
                }` +
                ' controls-MonthView__weekdays-item controls-MonthView__weekdays-item' +
                (props.newMode !== true ? ' controls-MonthViewVDOM__item-old' : '')
            }
        >
            {props.value.caption}
        </div>
    );
}
