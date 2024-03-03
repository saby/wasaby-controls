import { Fragment, memo, useCallback } from 'react';
import { Checkbox as CheckboxControl, ICheckboxOptions } from 'Controls/checkbox';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

const CUSTOM_EVENTS = ['onValueChanged'];

interface ICheckboxEditorProps extends IPropertyGridPropertyEditorProps<boolean> {
    className?: string;
    title?: string;
    size: ICheckboxOptions['size']
}

export const CheckboxEditor = memo((props: ICheckboxEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, className, title, size } = props;

    const onValueChanged = useCallback((res) => {
        onChange(res);
    }, []);

    return (
        <LayoutComponent title={title}>
            <CheckboxControl
                value={value}
                onValueChanged={onValueChanged}
                customEvents={CUSTOM_EVENTS}
                viewMode="outlined"
                caption={type.getTitle()}
                size={size}
                className={(className || '') + ' controls-Input_negativeOffset'}
                data-qa="controls-PropertyGrid__editor_checkbox"
            />
        </LayoutComponent>
    );
});
