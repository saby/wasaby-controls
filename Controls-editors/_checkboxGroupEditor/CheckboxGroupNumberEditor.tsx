import { memo } from 'react';
import { CheckboxGroupBase, CheckboxGroupEditorItem } from './CheckboxGroupBase';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

export interface ICheckboxGroupNumberEditorProps extends IPropertyGridPropertyEditorProps<number[]> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_checkboxGroupEditor/CheckboxGroupNumberEditor
 * @public
 */
export const CheckboxGroupNumberEditor = memo((props: ICheckboxGroupNumberEditorProps) => {
    const value =
        props.value?.map((item) => {
            return item.toString();
        }) || [];

    const options = new RecordSet<CheckboxGroupEditorItem>({
        keyProperty: 'id',
        rawData: props.options.map((caption, i) => {
            return {
                id: i.toString(),
                title: caption,
            };
        }),
    });

    const onChange = (value: string[]) => {
        props.onChange(
            value.map((item) => {
                return parseInt(item, 10);
            })
        );
    };

    return <CheckboxGroupBase {...props} options={options} value={value} onChange={onChange} />;
});
