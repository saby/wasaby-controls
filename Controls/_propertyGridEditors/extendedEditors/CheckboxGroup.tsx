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

type EditorValueType = string[] | number[];
interface CheckboxGroupEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для массива в виде группы чекбоксов.
 * @class Controls/_propertyGridEditors/extendedEditors/CheckboxGroupEditor
 * @implements Controls/propertyGridEditors:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/CheckboxGroup/Index
 * @public
 */
function CheckboxGroupEditor(props: CheckboxGroupEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs, editorProps } = getEditorClasses(props, [
        'controls-Input_negativeOffset',
    ]);

    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/CheckboxGroup:Control'}
            templateOptions={{
                ...clearProps,
                selectedKeys: value,
                validationStatus: props.validationStatus,
            }}
            onSelectedKeysChanged={onPropertyValueChanged}
            customEvents={['onSelectedKeysChanged']}
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

const _ = React.forwardRef(CheckboxGroupEditor);
export default _;
