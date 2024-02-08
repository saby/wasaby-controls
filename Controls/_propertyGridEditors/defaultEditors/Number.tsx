/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import { useJumpingLabel } from 'Controls/_propertyGridEditors/useJumpingLabel';
import { Constants } from 'Controls/propertyGrid';
import 'css!Controls/propertyGridEditors';

type EditorValueType = number;
interface NumberEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
    inputConfig: unknown;
}

/**
 * Редактор численного типа данных.
 * @class Controls/_propertyGridEditors/defaultEditors/NumberEditor
 * @implements Controls/propertyGridEditors:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Number/Demo
 *
 * @public
 */

/*
 * Editor for the number type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 */

function NumberEditor(props: NumberEditorProps, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { jumpingLabel, editorClasses } = useJumpingLabel(
        props,
        Constants.DEFAULT_EDITORS.number
    );
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        `controls-PropertyGrid__editor_number_control ${editorClasses}`,
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

    if (jumpingLabel) {
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
