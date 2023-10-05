/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';
import { Enum } from 'Types/collection';

export interface IPropertyGridButton {
    id: string;
    tooltip: string;
    icon: string;
}

type EditorValueType = Enum<string>;
interface FlatEnumEditorProps extends IEditorProps<EditorValueType> {
    buttons: IPropertyGridButton[];
    validationStatus: boolean;
}

/**
 * Редактор для набора логических значений.
 *
 * @class Controls/_propertyGrid/extendedEditors/FlatEnumEditor
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/BooleanGroup/Demo
 * @public
 */
function FlatEnumEditor(props: FlatEnumEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props, () => true);
    const [selectedKey, setSelectedKey] = React.useState(value.getAsValue());
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_enum_control ws-flexbox',
    ]);

    const editor = (
        <div {...editorAttrs}>
            {props.buttons.map((button, index) => {
                return (
                    <Async
                        forwardedRef={ref}
                        templateName={'Controls/ToggleButton'}
                        templateOptions={{
                            value: button.id === selectedKey,
                            validationStatus: props.validationStatus,
                            fontSize: 'm',
                            inlineHeight: 'default',
                            viewMode: 'pushButton',
                            contrastBackground: true,
                            icons: [button.icon + ' icon-small'],
                            iconSize: 's',
                            iconStyle: 'secondary',
                            tooltip: button.tooltip,
                            onValueChanged: () => {
                                setSelectedKey(button.id);
                                value.setByValue(button.id);
                                onPropertyValueChanged(value);
                            },
                        }}
                        data-qa={`controls-PropertyGrid__flatEnumEditor_${button.id}`}
                        className={`controls-PropertyGrid__editor_enum_item${
                            index === props.buttons.length - 1 ? '-last' : ''
                        }`}
                    />
                );
            })}
        </div>
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

const _ = React.forwardRef(FlatEnumEditor);
export default _;
