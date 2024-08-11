import { memo } from 'react';
import { EnumComboboxEditor } from 'Controls-editors/properties';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import * as rk from 'i18n!Controls-editors';

interface IFontFamilyEditorProps extends IPropertyGridPropertyEditorProps<string | undefined> {
    LayoutComponent?: IComponent<object>;
}

// Доступные шрифты
const FONTS = [
    rk('По умолчанию'),
    'Arial',
    'Courier New',
    'Garamond',
    'Georgia',
    'Inter',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];

const options = FONTS.map((fontFamily) => {
    return { value: fontFamily, caption: fontFamily };
});

/**
 * Реакт компонент, редактор для выбора семейства шрифта
 * @class Controls-editors/_style/FontFamilyEditor
 * @public
 */
export const FontFamilyEditor = memo((props: IFontFamilyEditorProps) => {
    const value = props.value ?? FONTS[0];

    return (
        <EnumComboboxEditor<string>
            isEmptyText={false}
            options={options}
            {...props}
            value={value}
        />
    );
});
