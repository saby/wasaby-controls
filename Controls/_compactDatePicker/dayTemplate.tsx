/**
 * @kaizen_zone 749640be-fd30-447f-996f-b97df77e6aa2
 */
import * as React from 'react';
import { Base as dateUtil } from 'Controls/dateUtils';

function CompactDatePickerDayContentTemplate(props) {

    const isSelectedStart = (): boolean => {
        if (props.rangeModel.startValue > props.rangeModel.endValue) {
            return false;
        }
        return (dateUtil.isDatesEqual(props.value.date, props.rangeModel.startValue)) &&
            (!dateUtil.isDatesEqual(props.rangeModel.startValue, props.rangeModel.endValue) ||
                props.value.selectionProcessing);
    };

    const isSelectedEnd = (): boolean => {
        if (props.rangeModel.startValue > props.rangeModel.endValue) {
            return false;
        }
        return (dateUtil.isDatesEqual(props.value.date, props.rangeModel.endValue) &&
                !dateUtil.isDatesEqual(props.rangeModel.startValue, props.rangeModel.endValue)) ||
            (!props.value.selectionProcessing && props.value.selectedEnd) &&
            !dateUtil.isDatesEqual(props.rangeModel.startValue, props.rangeModel.endValue);
    };

    return (
        <>
            { props.value.day }
            { isSelectedStart() ?
                <div className="controls-CompactDatePicker__month-list__item_selected__container">
                    <div className="controls-CompactDatePicker__month-list__item_selected controls-CompactDatePicker__month-list__item_selected-start">

                    </div>
                </div> : null
            }
            { isSelectedEnd() ?
                <div className="controls-CompactDatePicker__month-list__item_selected__container">
                    <div className="controls-CompactDatePicker__month-list__item_selected controls-CompactDatePicker__month-list__item_selected-end">

                    </div>
                </div> : null
            }
        </>
    );
}

export default function getDayTemplate(
    BaseDayTemplate: React.FunctionComponent,
    rangeModel,
    dayTemplateOptions
): React.FunctionComponent {
    function DayTemplate(props: object): React.ReactElement {
        return (
            <BaseDayTemplate
                {...props}
                date={props.value.day}
                { ...dayTemplateOptions }
                fontWeight="normal"
                sizeStyle="CompactDatePickerItem"
                fontColorStyle="CompactDatePickerItem"
                borderStyle="CompactDatePickerItem"
                backgroundStyle="CompactDatePickerItem"
                contentTemplate={(props) => {
                    return <CompactDatePickerDayContentTemplate {...props} rangeModel={rangeModel}/>;
                }}
            />
        );
    }

    return DayTemplate;
}
