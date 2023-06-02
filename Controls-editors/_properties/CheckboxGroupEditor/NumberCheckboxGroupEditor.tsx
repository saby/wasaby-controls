import { memo } from 'react';
import { CheckboxGroupBase } from './CheckboxGroupBase';
import { RecordSet } from 'Types/collection';
import { IPropertyEditorProps } from 'Types/meta';
import { RadioGroupEditorItem } from '../RadioGroupEditor/RadioGroupEditor';

export interface INumberCheckboxGroupEditor extends IPropertyEditorProps<number[]> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_properties/StringRadioGroupEditor
 * @public
 */
export const NumberCheckboxGroupEditor = memo((props: INumberCheckboxGroupEditor) => {
    const value = props.value?.map(item => {
        return item.toString();
    }) || [];

    const options = new RecordSet<RadioGroupEditorItem>({
        keyProperty: 'id',
        rawData: props.options.map((caption, i) => {
            return {
                id: i.toString(),
                title: caption,
            };
        }),
    });

    const onChange = (value: string[]) => {
        props.onChange(value.map(item => {
            return parseInt(item, 10);
        }));
    };

    return <CheckboxGroupBase {...props} options={options} value={value} onChange={onChange} />;
});
