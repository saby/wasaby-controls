import { memo } from 'react';
import { RecordSet } from 'Types/collection';
import { IPropertyEditorProps } from 'Types/meta';
import { CheckboxGroupEditorItem, CheckboxGroupBase } from './CheckboxGroupBase';

export interface IStringCheckboxGroupEditor extends IPropertyEditorProps<string[]> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_properties/StringRadioGroupEditor
 * @public
 */
export const StringCheckboxGroupEditor = memo((props: IStringCheckboxGroupEditor) => {
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
