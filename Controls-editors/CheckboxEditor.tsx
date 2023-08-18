import { Fragment, memo, useCallback } from 'react';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface ICheckboxEditorProps extends IPropertyGridPropertyEditorProps<boolean> {
    className?: string;
    title?: string;
}

export const CheckboxEditor = memo((props: ICheckboxEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, className, title } = props;

    const onValueChanged = useCallback((res) => {
        onChange(res);
    }, []);

    return (
        <LayoutComponent title={title}>
            <CheckboxControl
                value={value}
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                viewMode="outlined"
                caption={type.getTitle()}
                className={(className || '') + ' controls-Input_negativeOffset'}
                data-qa="controls-PropertyGrid__editor_checkbox"
            />
        </LayoutComponent>
    );
});
