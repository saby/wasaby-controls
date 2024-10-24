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
interface PhoneEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для поля ввода номера телефона.
 * @class Controls/_propertyGridEditors/extendedEditors/PhoneEditor
 * @implements Controls/propertyGridEditors:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/PhoneEditor/Index
 * @public
 */
function PhoneEditor(props: PhoneEditorProps, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, []);
    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/input:Phone'}
            templateOptions={{
                valueChangedCallback: (value) => onChange(null, value),
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
                templateName="wml!Controls/_propertyGridEditors/JumpingLabelContainer"
                templateOptions={{
                    caption: props.caption,
                    required: props.required,
                    content: editor,
                    ...props.captionOptions,
                }}
                {...editorWrapperAttrs}
            />
        );
    }

    return editor;
}

const _ = React.forwardRef(PhoneEditor);
export default _;
