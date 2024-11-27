/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import 'css!Controls/propertyGridEditors';

type EditorValueType = boolean;
interface BooleanEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
    tooltip: string | null;
}

/**
 * Редактор для логического типа данны в виде обычного чекбоксах.
 * @class Controls/_propertyGridEditors/defaultEditors/BooleanEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_propertyGrid.less переменные тем оформления}
 *
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Boolean/Index
 * @see Controls/propertyGrid:Logic
 */

/*
 * Editor for boolean type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGridEditors:IEditor
 *
 * @public
 */

function BooleanEditor(props: BooleanEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props);
    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-Input_negativeOffset',
        'controls-PropertyGrid__editor_boolean_control',
    ]);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/checkbox:Checkbox'}
            templateOptions={{
                value,
                validationStatus: props.validationStatus,
                tooltip: props.tooltip,
            }}
            onValueChanged={onPropertyValueChanged}
            customEvents={['onValueChanged']}
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

const _ = React.forwardRef(BooleanEditor);
export default _;
