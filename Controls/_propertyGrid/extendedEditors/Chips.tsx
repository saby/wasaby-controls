/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';
import { SelectedKey } from 'Controls/source';
import { delimitProps } from 'UICore/Jsx';

type EditorValueType = number;
interface ChipsEditorProps extends IEditorProps<EditorValueType> {
    multiSelect: boolean;
}

const SelectedKeysContent = React.forwardRef((contentProps, forwardedRef) => {
    return (
        <Async
            forwardedRef={forwardedRef}
            templateName={'Controls/Chips:Control'}
            templateOptions={{
                selectedKeys: contentProps.selectedKeys,
                onSelectedKeysChanged: contentProps.onSelectedkeyschanged,
                ...contentProps.forwardedProps,
            }}
            {...contentProps.editorAttrs}
        />
    );
});

/**
 * Редактор для перечисляемого типа данных. В основе редактора используется контрол {@link Controls/Chips:Control}.
 * @class Controls/_propertyGrid/extendedEditors/ChipsEditor
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/Chips/SingleSelection/Demo
 * @demo Controls-demo/PropertyGridNew/Editors/Chips/MultiSelect/Demo
 * @public
 */
function ChipsEditor(props: ChipsEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs, editorProps } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_chips_control ws-flexbox',
    ]);

    const { clearProps } = delimitProps(props);

    const onSelectedKeysChanged = (event, value: number) => {
        onPropertyValueChanged(value);
    };

    const editor = props.multiSelect ? (
        <Async
            forwardedRef={ref}
            templateName={'Controls/Chips:Control'}
            templateOptions={{
                selectedKeys: value,
                onSelectedKeysChanged,
                ...clearProps,
            }}
            {...editorAttrs}
        />
    ) : (
        <SelectedKey
            selectedKey={value}
            onSelectedkeychanged={(value) => onSelectedKeysChanged(null, value)}
            customEvents={['onSelectedkeychanged']}
            content={SelectedKeysContent}
            forwardedProps={props}
            editorAttrs={editorAttrs}
        />
    );

    if (props.jumpingLabel) {
        return (
            <Async
                templateName="wml!Controls/_propertyGrid/JumpingLabelContainer"
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

const _ = React.forwardRef(ChipsEditor);
export default _;
