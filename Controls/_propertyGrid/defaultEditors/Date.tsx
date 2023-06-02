/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGrid/IEditor';
import { usePropertyValue } from 'Controls/_propertyGrid/usePropertyValue';
import { Base as dateUtils } from 'Controls/dateUtils';
import { getEditorClasses } from 'Controls/_propertyGrid/editorUtils';

type EditorValueType = Date;
interface DateEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для данных с типом "дата".
 * @class Controls/_propertyGrid/defaultEditors/DateEditor
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 * @demo Controls-demo/PropertyGridNew/Editors/DateEditor/Index
 * @public
 */

function DateEditor(props: DateEditorProps, ref) {
    const { value, onPropertyValueChanged } = usePropertyValue(props, (value) => {
        return value === null || dateUtils.isValidDate(value);
    });

    const { editorAttrs, editorWrapperAttrs } = getEditorClasses(props, [
        'controls-PropertyGrid__editor_date_control',
    ]);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/date:Input'}
            templateOptions={{
                onValueChanged: (event, value) => {
                    onPropertyValueChanged(value);
                },
                ...props,
                value,
            }}
            {...editorAttrs}
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

const _ = React.forwardRef(DateEditor);
export default _;
