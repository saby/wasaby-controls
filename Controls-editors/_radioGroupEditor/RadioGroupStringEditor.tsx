import { memo } from 'react';
import { RadioGroupEditor, RadioGroupEditorItem } from './RadioGroupEditor';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

export interface IRadioGroupStringEditorProps extends IPropertyGridPropertyEditorProps<string> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_radioGroupEditor/RadioGroupStringEditor
 * @public
 */
export const RadioGroupStringEditor = memo((props: IRadioGroupStringEditorProps) => {
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
