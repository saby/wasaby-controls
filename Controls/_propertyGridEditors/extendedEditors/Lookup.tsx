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
interface LookupEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для поля выбора из справочника.
 * @class Controls/_propertyGridEditors/extendedEditors/LookupEditor
 * @implements Controls/propertyGridEditors:IEditor
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Lookup/Index
 */
function LookupEditor(props: LookupEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, []);
    const { clearProps } = delimitProps(props);
    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/lookup:Input'}
            templateOptions={{
                ...clearProps,
                selectedKeys: value,
            }}
            onSelectedKeysChanged={onPropertyValueChanged}
            customEvents={['onSelectedKeysChanged']}
            {...editorAttrs}
        />
    );

    if (props.jumpingLabel) {
        return (
            <Async
                templateName="Controls/jumpingLabel:SelectionContainer"
                templateOptions={{
                    caption: props.caption,
                    required: props.required,
                    selectedKeys: value,
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

const LookupEditorRef = React.forwardRef(LookupEditor);

LookupEditorRef.defaultProps = {
    propertyValue: [],
} as Partial<LookupEditorProps>;

export default LookupEditorRef;
