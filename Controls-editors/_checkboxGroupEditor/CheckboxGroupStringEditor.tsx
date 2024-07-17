import { memo } from 'react';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { CheckboxGroupBase, CheckboxGroupEditorItem } from './CheckboxGroupBase';

export interface ICheckboxGroupStringEditorProps extends IPropertyGridPropertyEditorProps<string[]> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_checkboxGroupEditor/CheckboxGroupStringEditor
 * @public
 */
export const CheckboxGroupStringEditor = memo((props: ICheckboxGroupStringEditorProps) => {
    const options = new RecordSet<CheckboxGroupEditorItem>({
        keyProperty: 'id',
        rawData: props.options.map((caption) => {
            return {
                id: caption,
                title: caption,
            };
        }),
    });

    return <CheckboxGroupBase {...props} options={options} />;
});
