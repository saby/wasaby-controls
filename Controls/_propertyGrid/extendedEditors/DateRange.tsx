/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';
import { useState } from 'react';

type EditorValueType = Date[];
interface DateRangeEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для поля выбора периода дат.
 * @extends Controls/dateRange:Input
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/DateRangeEditor/Index
 * @public
 */
function DateRangeEditor(props: DateRangeEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const [startDateValue, endDateValue] = getPropertyValueByOptions(value);
    const [startValue, setStartValue] = useState(startDateValue);
    const [endValue, setEndValue] = useState(endDateValue);

    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_dateRange_control',
    ]);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/dateRange:Input'}
            templateOptions={{
                startValue,
                endValue,
                onStartvaluechanged: (e, value) => setStartValue(value),
                onEndvaluechanged: (e, value) => setEndValue(value),
                onInputcompleted: (e, start, end) => onPropertyValueChanged([start, end]),
                ...props,
            }}
            {...editorAttrs}
        />
    );

    if (props.jumpingLabel) {
        return (
            <Async
                templateName="wml!Controls/_propertyGrid/JumpingLabelContainer"
                templateOptions={{
                    caption: props.caption,
                    required: props.required,
                    content: editor,
                }}
                {...editorWrapperAttrs}
            />
        );
    }

    return editor;
}

function getPropertyValueByOptions(value: Date[] | null): Date[] {
    return value || [null, null];
}

const _ = React.forwardRef(DateRangeEditor);
export default _;
