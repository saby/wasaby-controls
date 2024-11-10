import { memo, useMemo } from 'react';
import { TumblerEditor, TumblerEditorItem } from './TumblerEditor';
import { RecordSet } from 'Types/collection';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

export interface IStringTumblerEditorProps extends IPropertyGridPropertyEditorProps<string> {
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_toggle/TumblerEditor/TumblerEditorString
 * @public
 */
export const TumblerEditorString = memo((props: IStringTumblerEditorProps) => {
    const options = useMemo(
        () =>
            new RecordSet<TumblerEditorItem>({
                rawData: props.options.map((caption) => {
                    return {
                        id: caption,
                        title: caption,
                    };
                }),
                keyProperty: 'id',
            }),
        []
    );

    return <TumblerEditor {...props} options={options} />;
});
