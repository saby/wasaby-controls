import * as React from 'react';

export default function getDayTemplate(BaseDayTemplate: React.FunctionComponent): React.FunctionComponent {
    function DayTemplate(props: object): React.ReactElement {
        return (
            <BaseDayTemplate
                {...props}
                date={props.value.day}
                sizeStyle="monthRangeItem"
                backgroundStyle="monthRangeItem"
                fontColorStyle="monthRangeItem"
                borderStyle="monthRangeItem"
                fontWeight="normal"
            />
        );
    }

    return DayTemplate;
}