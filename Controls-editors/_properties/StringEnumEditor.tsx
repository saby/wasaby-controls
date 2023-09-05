import { ComponentProps, memo } from 'react';
import { EnumEditor } from './EnumEditor';

interface IStringEnumEditorProps extends Omit<ComponentProps<typeof EnumEditor>, 'options'> {
    value: string | undefined;
    options?: readonly string[];
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк,
 * с совпадающим значением и заголовком
 * @class Controls-editors/_properties/StringEnumEditor
 * @public
 */
export const StringEnumEditor = memo((props: IStringEnumEditorProps) => {
    const options = props.options?.map((caption) => {
        return { value: caption, caption };
    });
    return <EnumEditor {...props} options={options} />;
});
