/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';
import { delimitProps } from 'UICore/Jsx';
import { useReadonly } from 'UI/Contexts';

type EditorValueType = string[] | number[];
interface DropdownEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для массива в виде выпадающего списка.
 * @class Controls/_propertyGrid/extendedEditors/DropdownEditor
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Dropdown/Index
 * @public
 */
function DropdownEditor(props: DropdownEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_dropdown_control',
    ]);
    const readOnly = useReadonly(props);

    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/dropdown:Selector'}
            templateOptions={{
                ...clearProps,
                selectedKeys: value,
                onSelectedKeysChanged: onPropertyValueChanged,
            }}
            customEvents={['onSelectedKeysChanged']}
            {...editorAttrs}
        />
    );

    if (props.jumpingLabel) {
        return (
            <Async
                templateName={`${
                    readOnly
                        ? 'wml!Controls/_propertyGrid/JumpingLabelContainer'
                        : 'Controls/jumpingLabel:SelectionContainer'
                }`}
                templateOptions={{
                    caption: props.caption,
                    required: props.required,
                    selectedKeys: value,
                    contrastBackground: true,
                    content: editor,
                }}
                {...editorWrapperAttrs}
            />
        );
    }

    return editor;
}

const DropdownEditorRef = React.forwardRef(DropdownEditor);

DropdownEditorRef.defaultProps = {
    editorMode: 'Input',
    propertyValue: [],
} as Partial<DropdownEditorProps>;

export default DropdownEditorRef;
