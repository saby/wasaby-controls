import { ComponentProps } from 'react';
import { EnumEditor, IEnumOption, genericMemo } from './EnumEditor';

type omit<TMetaType> = Omit<ComponentProps<typeof EnumEditor<TMetaType>>, 'options' | 'value'>;

interface IEnumStringEditorProps<TMetaType> extends omit<TMetaType> {
    value?: TMetaType | undefined;
    options?: readonly TMetaType[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_dropdown/EnumStringEditor
 * @public
 */
export const EnumStringEditor = genericMemo(
    <TMetaType extends unknown>(props: IEnumStringEditorProps<TMetaType>) => {
        const options: IEnumOption<TMetaType>[] | undefined = props.options?.map((caption) => {
            return { value: caption, caption } as {
                value: TMetaType;
                caption: string;
            };
        });
        return <EnumEditor {...props} options={options} />;
    }
);
