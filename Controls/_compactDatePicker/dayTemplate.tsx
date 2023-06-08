/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import * as React from 'react';

export default function getDayTemplate(
    BaseDayTemplate: React.FunctionComponent
): React.FunctionComponent {
    function DayTemplate(props: object): React.ReactElement {
        return (
            <BaseDayTemplate
                {...props}
                date={props.value.day}
                fontWeight="normal"
                sizeStyle="CompactDatePickerItem"
                fontColorStyle="CompactDatePickerItem"
                borderStyle="CompactDatePickerItem"
                backgroundStyle="CompactDatePickerItem"
            />
        );
    }

    return DayTemplate;
}
