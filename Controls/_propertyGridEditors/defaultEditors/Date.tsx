/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import * as React from 'react';
import Async from 'Controls/Container/Async';
import { IEditorProps } from 'Controls/_propertyGridEditors/IEditor';
import { usePropertyValue } from 'Controls/_propertyGridEditors/usePropertyValue';
import { getEditorClasses } from 'Controls/_propertyGridEditors/editorUtils';
import { Base as dateUtils } from 'Controls/dateUtils';
import { delimitProps } from 'UICore/Jsx';
import 'css!Controls/propertyGridEditors';

type EditorValueType = Date;
interface DateEditorProps extends IEditorProps<EditorValueType> {
    validationStatus: boolean;
}

/**
 * Редактор для данных с типом "дата".
 * @class Controls/_propertyGridEditors/defaultEditors/DateEditor
 * @implements Controls/propertyGridEditors:IEditor
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

    const { clearProps } = delimitProps(props);

    const editor = (
        <Async
            forwardedRef={ref}
            templateName={'Controls/date:Input'}
            templateOptions={{
                ...clearProps,
                value,
                onValueChanged: (event, value) => {
                    onPropertyValueChanged(value);
                },
            }}
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

const DateEditorRef = React.forwardRef(DateEditor);

DateEditorRef.defaultProps = {
    propertyValue: null,
} as Partial<DateEditorProps>;

export default DateEditorRef;
