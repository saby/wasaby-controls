import { memo } from 'react';
import { IPropertyEditorProps } from 'Types/meta';
import { RadioGroupEditorBase } from './RadioGroupBase';
import { RadioGroupEditorItem } from './RadioGroupEditor';
import { RecordSet } from 'Types/collection';

interface INumberRadioGroupEditorProps extends IPropertyEditorProps<number> {
    value: number | undefined;
    onChange: (val: number) => void;
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с помощью радиогруп
 * @class Controls-editors/_properties/NumberRadioGroupEditor
 * @public
 */
export const NumberRadioGroupEditor = memo((props: INumberRadioGroupEditorProps) => {
    const value = typeof props.value === 'number' ? props.value.toString() : undefined;

    const options = new RecordSet<RadioGroupEditorItem>({
        rawData: props.options.map((caption, i) => {
            return {
                id: i.toString(),
                title: caption,
            };
        }),
    });

    const onChange = (val: string) => {
        props.onChange(parseInt(val, 10));
    };

    return <RadioGroupEditorBase {...props} options={options} value={value} onChange={onChange} />;
});
