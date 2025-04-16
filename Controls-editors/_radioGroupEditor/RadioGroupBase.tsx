import { Fragment, memo, useCallback } from 'react';
import { IComponent, Meta } from 'Meta/types';
import { Control as RadioGroupControl } from 'Controls/RadioGroup';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { RecordSet } from 'Types/collection';
import { IBasePropertyEditorProps } from 'Controls-editors/properties';

export type RadioGroupEditorItem = { id: string; title: string };

interface IRadioGroupEditorBaseProps
    extends IBasePropertyEditorProps<string, Meta<string> | Meta<number>> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    options?: RecordSet<RadioGroupEditorItem>;
}

export const RadioGroupEditorBase = memo((props: IRadioGroupEditorBaseProps) => {
    const { value, onChange, options: items, LayoutComponent = Fragment } = props;

    const onValueChanged = useCallback(
        (e, val) => {
            onChange(val);
        },
        [value]
    );

    return (
        <LayoutComponent>
            <RadioGroupControl
                selectedKey={value}
                onSelectedKeyChanged={onValueChanged}
                customEvents={['onSelectedKeyChanged']}
                items={items}
                data-qa="controls-PropertyGrid__editor_radio-group"
            />
        </LayoutComponent>
    );
});
