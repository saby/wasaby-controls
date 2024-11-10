/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import { SyntheticEvent } from 'UI/Events';
import { constants } from 'Env/Env';
import { delimitProps } from 'UICore/Jsx';
import { useJumpingLabel } from 'Controls/_propertyGridEditors/useJumpingLabel';
import { Constants } from 'Controls/propertyGrid';
import 'css!Controls/propertyGridEditors';

type EditorValueType = string;
interface StringEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для строкового типа данных.
 * @class Controls/_propertyGridEditors/defaultEditors/StringEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less переменные тем оформления}
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/String/Index
 */

/*
 * Editor for string type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 */
function StringEditor(props: StringEditorProps, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { jumpingLabel, editorClasses } = useJumpingLabel(
        props,
        Constants.DEFAULT_EDITORS.string
    );
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        `controls-PropertyGrid__editor_string_control ${editorClasses}`,
    ]);

    const { clearProps } = delimitProps(props);

    const onKeydown = (event: SyntheticEvent) => {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            onPropertyValueChanged(value);
        }
    };

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/input:Text'}
            templateOptions={{
                valueChangedCallback: onChange,
                inputCompletedCallback: onPropertyValueChanged,
                ...clearProps,
                value,
            }}
            onKeyDown={onKeydown}
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
                    ...props.captionOptions,
                }}
                {...editorWrapperAttrs}
            />
        );
    }

    return editor;
}

const StringEditorRef = React.forwardRef(StringEditor);

StringEditorRef.defaultProps = {
    propertyValue: '',
} as Partial<StringEditorProps>;

export default StringEditorRef;
