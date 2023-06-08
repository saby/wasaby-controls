import { memo } from 'react';
import { TumblerEditor, TumblerEditorItem } from './TumblerEditor';
import { RecordSet } from 'Types/collection';
import { IPropertyEditorProps } from 'Types/meta';

export interface IStringTumblerEditorProps extends IPropertyEditorProps<string> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_properties/TumblerEditor/StringTumblerEditor
 * @public
 */
export const StringTumblerEditor = memo((props: IStringTumblerEditorProps) => {
    const options = new RecordSet<TumblerEditorItem>({
        rawData: props.options.map((caption) => {
            return {
                id: caption,
                title: caption,
            };
        }),
    });

    return <TumblerEditor {...props} options={options} />;
});
