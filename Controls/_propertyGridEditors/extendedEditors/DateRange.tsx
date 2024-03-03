/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import { useEffect, useState } from 'react';
import { delimitProps } from 'UICore/Jsx';
import 'css!Controls/propertyGridEditors';

type EditorValueType = Date[];
interface DateRangeEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для поля выбора периода дат.
 * @class Controls/_propertyGridEditors/extendedEditors/DateRangeEditor
 * @implements Controls/propertyGridEditors:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/DateRangeEditor/Index
 * @public
 */
function DateRangeEditor(props: DateRangeEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const [startDateValue, endDateValue] = getPropertyValueByOptions(value);
    const [startValue, setStartValue] = useState(startDateValue);
    const [endValue, setEndValue] = useState(endDateValue);

    useEffect(() => {
        setStartValue(startDateValue);
    }, [startDateValue]);

    useEffect(() => {
        setEndValue(endDateValue);
    }, [endDateValue]);

    const { editorAttrs, editorWrapperAttrs, editorProps } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_dateRange_control',
    ]);

    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/dateRange:Input'}
            templateOptions={{
                startValue,
                endValue,
                onStartValueChanged: (e, value) => setStartValue(value),
                onEndValueChanged: (e, value) => setEndValue(value),
                onInputCompleted: (e, start, end) => onPropertyValueChanged([start, end]),
                ...clearProps,
            }}
            {...editorAttrs}
        />
    );

    if (props.jumpingLabel) {
        return (
            <Async
                templateName="wml!Controls/_propertyGridEditors/JumpingLabelContainer"
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

const DateRangeEditorRef = React.forwardRef(DateRangeEditor);

DateRangeEditorRef.defaultProps = {
    propertyValue: [null, null],
};
export default DateRangeEditorRef;
