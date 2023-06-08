/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';

type EditorValueType = number;
interface NumberEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
    inputConfig: unknown;
}

/**
 * Редактор численного типа данных.
 * @class Controls/_propertyGrid/defaultEditors/NumberEditor
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Number/Demo
 *
 * @public
 */

/*
 * Editor for the number type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 */

function NumberEditor(props: NumberEditorProps, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_number_control',
    ]);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/input:Number'}
            templateOptions={{
                valueChangedCallback: (value, stringValue) => onChange(null, value),
                inputCompletedCallback: onPropertyValueChanged,
                ...(props.inputConfig ? props.inputConfig : props),
                value,
            }}
            {...editorAttrs}
        />
    );

    if (props.jumpingLabel) {
        return (
            <Async
                templateName="Controls/jumpingLabel:InputContainer"
                templateOptions={{
                    caption: props.caption,
                    required: props.required,
                    value,
                    contrastBackground: true,
                    content: editor,
                }}
                {...editorWrapperAttrs}
            />
        );
    }

    return editor;
}

const NumberEditorRef = React.forwardRef(NumberEditor);

NumberEditorRef.defaultProps = {
    propertyValue: null,
} as Partial<NumberEditorProps>;

export default NumberEditorRef;
