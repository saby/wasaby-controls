/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import { delimitProps } from 'UICore/Jsx';
import 'css!Controls/propertyGridEditors';

type EditorValueType = string;
interface InputMaskEditor extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для поля ввода значения с заданным форматом.
 * @class Controls/_propertyGridEditors/extendedEditors/InputMaskEditor
 * @implements Controls/propertyGridEditors:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/InputMask/Index
 * @public
 */
function InputMaskEditor(props: InputMaskEditor, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, []);
    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/input:Mask'}
            templateOptions={{
                valueChangedCallback: (value, formattedValue) => onChange(null, value),
                inputCompletedCallback: onPropertyValueChanged,
                ...clearProps,
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
                    ...props.captionOptions,
                }}
                {...editorWrapperAttrs}
            />
        );
    }

    return editor;
}

const _ = React.forwardRef(InputMaskEditor);
export default _;
