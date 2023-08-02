import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Checkbox as CheckboxControl } from 'Controls/checkbox';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IBooleanEditorCheckboxProps extends IPropertyEditorProps<boolean> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: boolean | undefined;
    className?: string;
    title?: string;
}

export const BooleanEditorCheckbox = memo((props: IBooleanEditorCheckboxProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, className, title } = props;

    const onValueChanged = useCallback(() => {
        onChange(!value);
    }, [value]);

    return (
        <LayoutComponent title={title}>
            <CheckboxControl
                value={value}
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                viewMode="outlined"
                caption={type.getTitle()}
                className={className || ''}
                data-qa="controls-PropertyGrid__editor_checkbox"
            />
        </LayoutComponent>
    );
});
