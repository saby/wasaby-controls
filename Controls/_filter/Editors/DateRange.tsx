import * as React from 'react';
import Async from 'Controls/Container/Async';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDateRangeEditorOptions } from 'Controls/filterDateRangeEditor';

export interface IDateRangeEditorProps extends IDateRangeEditorOptions {
    onTextValueChanged?: Function;
    onRangeChanged?: Function;
}

export default React.forwardRef(function DateRangeEditor(
    props: IDateRangeEditorProps,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    return (
        <Async
            forwardedRef={ref}
            templateName="Controls/filterDateRangeEditor"
            onTextValueChanged={() => {
                const event = new SyntheticEvent(null, {
                    type: 'textValueChanged',
                });
                (props.onTextvaluechanged || props.onTextValueChanged)(event, ...arguments);
            }}
            onRangeChanged={() => {
                const event = new SyntheticEvent(null, {
                    type: 'rangeChanged',
                });
                (props.onRangechanged || props.onRangeChanged)(event, ...arguments);
            }}
            customEvents={['onTextValueChanged', 'onRangeChanged']}
            templateOptions={{
                prevArrowVisible: props.prevArrowVisible,
                nextArrowVisible: props.nextArrowVisible,
                prevArrowAlignment: props.prevArrowAlignment,
                nextArrowAlignment: props.nextArrowAlignment,
                value: props.value,
                resetValue: props.resetValue,
                resetStartValue: props.resetStartValue,
                resetEndValue: props.resetEndValue,
                type: props.type,
                emptyCaption: props.emptyCaption,
                captionFormatter: props.captionFormatter,
                selectionType: props.selectionType,
                ranges: props.ranges,
                minRange: props.minRange,
                editorMode: props.editorMode,
                editorTemplateName: props.editorTemplateName,
                datePopupType: props.datePopupType,
                chooseMonths: props.chooseMonths,
                chooseQuarters: props.chooseQuarters,
                chooseHalfyears: props.chooseHalfyears,
                chooseYears: props.chooseYears,
                validators: props.validators,
                validateValueBeforeChange: props.validateValueBeforeChange,
                validationStatus: props.validationStatus,
                fontSize: props.fontSize,
                fontWeight: props.fontWeight,
                fontColorStyle: props.fontColorStyle,
                readOnly: props.readOnly,
                theme: props.theme,
                _date: props._date,
                _displayDate: props._displayDate,
            }}
        ></Async>
    );
});
