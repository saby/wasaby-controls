/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';
import { SyntheticEvent } from 'UI/Events';
import { constants } from 'Env/Env';

type EditorValueType = string;
interface StringEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для строкового типа данных.
 * @class Controls/_propertyGrid/defaultEditors/StringEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/String/Index
 */

/*
 * Editor for string type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 */
function StringEditor(props: StringEditorProps, ref) {
    const { value, onChange, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_string_control',
    ]);

    const onKeydown = (event: SyntheticEvent) => {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            onPropertyValueChanged(event, value);
        }
    };

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/input:Text'}
            templateOptions={{
                valueChangedCallback: onChange,
                inputCompletedCallback: onPropertyValueChanged,
                ...props,
                value,
            }}
            onKeyDown={onKeydown}
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

const _ = React.forwardRef(StringEditor);
export default _;
