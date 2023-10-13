import { Fragment, memo, useCallback, useMemo } from 'react';
import { IComponent, Meta } from 'Types/meta';
import { Control as CheckboxGroupControl } from 'Controls/CheckboxGroup';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { IBasePropertyEditorProps } from 'Controls-editors/properties';

const CUSTOM_EVENTS = ['onSelectedKeysChanged'];

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

    const selectedKeys = useMemo(() => value || [], [value]);

    return (
        <LayoutComponent>
            <CheckboxGroupControl
                validationStatus="valid"
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onValueChanged}
                customEvents={CUSTOM_EVENTS}
                items={items}
                data-qa="controls-PropertyGrid__editor_radio-group"
            />
        </LayoutComponent>
    );
});
