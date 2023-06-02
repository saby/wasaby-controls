/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';

export interface IPropertyGridButton {
    id: string;
    tooltip: string;
    icon: string;
}

type EditorValueType = boolean[];
interface BooleanGroupEditorProps extends IEditorProps<EditorValueType> {
    buttons: IPropertyGridButton[];
    validationStatus: boolean;
}

/**
 * Редактор для набора логических значений.
 *
 * @extends Controls/ToggleButton
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/BooleanGroup/Demo
 * @public
 */
function BooleanGroupEditor(props: BooleanGroupEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_booleanGroup_control ws-flexbox',
    ]);

    const editor = (
        <div {...editorAttrs}>
            {props.buttons.map((button, index) => {
                return (
                    <Async
                        forwardedRef={ref}
                        templateName={'Controls/ToggleButton'}
                        templateOptions={{
                            value: value[index],
                            validationStatus: props.validationStatus,
                            fontSize: 'm',
                            inlineHeight: 'default',
                            viewMode: 'pushButton',
                            contrastBackground: true,
                            icons: [button.icon],
                            iconSize: 's',
                            iconStyle: 'secondary',
                            tooltip: button.tooltip,
                            onValueChanged: (event, newValue) => {
                                const result = value.slice();
                                result[index] = newValue;
                                onPropertyValueChanged(result);
                            },
                        }}
                        data-qa={`controls-PropertyGrid__booleanGroupEditor_${button.id}`}
                        className={`controls-PropertyGrid__editor_booleanGroup_item${
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

const _ = React.forwardRef(BooleanGroupEditor);
export default _;
