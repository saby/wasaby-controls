import { Fragment, memo, useCallback } from 'react';
import { IComponent, Meta } from 'Types/meta';
import { Control as CheckboxGroupControl } from 'Controls/CheckboxGroup';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { IBasePropertyEditorProps } from 'Controls-editors/properties';

export type CheckboxGroupEditorItem = { id: string; title: string };

interface ICheckboxGroupBaseProps
    extends IBasePropertyEditorProps<string[], Meta<string[]> | Meta<number[]>> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: RecordSet<CheckboxGroupEditorItem>;
}

export const CheckboxGroupBase = memo((props: ICheckboxGroupBaseProps) => {
    const { value, onChange, options: items, LayoutComponent = Fragment } = props;

    const onValueChanged = useCallback(
        (e) => {
            onChange(e);
        },
        [value]
    );

    return (
        <LayoutComponent>
            <CheckboxGroupControl
                validationStatus="valid"
                selectedKeys={value || []}
                onSelectedKeysChanged={onValueChanged}
                customEvents={['onSelectedKeysChanged']}
                items={items}
                data-qa="controls-PropertyGrid__editor_radio-group"
            />
        </LayoutComponent>
    );
});
