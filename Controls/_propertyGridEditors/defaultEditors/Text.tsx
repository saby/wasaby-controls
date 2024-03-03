/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { useJumpingLabel } from 'Controls/_propertyGridEditors/useJumpingLabel';
import { Constants } from 'Controls/propertyGrid';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import { delimitProps } from 'UICore/Jsx';
import 'css!Controls/propertyGridEditors';

type EditorValueType = string;
interface TextEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
    inputClassName: string;
}

/**
 * Редактор для многострочного типа данных.
 * @class Controls/_propertyGridEditors/defaultEditors/TextEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less переменные тем оформления}
 *
 * @implements Controls/propertyGridEditors:IEditor
 * @implements Controls/input:IText
 * @implements Controls/interface:IInputPlaceholder
 * @implements Controls/input:IFieldTemplate
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Text/Index
 */

/*
 * Editor for multiline string type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 */
function TextEditor(props: TextEditorProps, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { jumpingLabel, editorClasses } = useJumpingLabel(props, Constants.DEFAULT_EDITORS.text);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        `controls-PropertyGrid__editor_text_control ${editorClasses}`,
        props.inputClassName,
    ]);
    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/input:Area'}
            templateOptions={{
                valueChangedCallback: onChange,
                inputCompletedCallback: onPropertyValueChanged,
                ...clearProps,
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

const TextEditorRef = React.forwardRef(TextEditor);

TextEditorRef.defaultProps = {
    propertyValue: '',
} as Partial<TextEditorProps>;

export default TextEditorRef;
