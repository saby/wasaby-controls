import { memo } from 'react';
import { RadioGroupEditor, RadioGroupEditorItem } from './RadioGroupEditor';
import { RecordSet } from 'Types/collection';
import { IPropertyEditorProps } from 'Types/meta';

export interface IStringRadioGroupEditorProps extends IPropertyEditorProps<string> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_properties/StringRadioGroupEditor
 * @public
 */
export const StringRadioGroupEditor = memo((props: IStringRadioGroupEditorProps) => {
    const options = new RecordSet<RadioGroupEditorItem>({
        rawData: props.options.map((caption) => {
            return {
                id: caption,
                title: caption,
            };
        }),
    });

    return <RadioGroupEditor {...props} options={options} />;
});
