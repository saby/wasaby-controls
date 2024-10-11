import { memo, useMemo, CSSProperties, useCallback } from 'react';
import { ComboboxEditor } from 'Controls-editors/properties';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { Model } from 'Types/entity';
import { ItemTemplate as MenuItemTemplate } from 'Controls/menu';
import { GoogleFonts } from './GoogleFonts';
import * as rk from 'i18n!Controls-editors';

interface IFontFamilyEditorProps extends IPropertyGridPropertyEditorProps<unknown> {
    LayoutComponent?: IComponent<object>;
    fontSize?: string;
    bold?: boolean;
    showDefault?: boolean;
}

const DEFAULT_FONT = rk('По умолчанию');

// Доступные шрифты
const FONTS: string[] = [
    DEFAULT_FONT,
    'Arial',
    'Courier New',
    'Garamond',
    'Georgia',
    'Inter',
    'Montserrat',
    'Open Sans',
    'Oswald',
    'PT Sans',
    'PT Serif',
    'Roboto',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];

interface IItemTemplateProps {
    item: { contents: Model };
}

function useFontStyle(fontFamily: string, bold: boolean): CSSProperties {
    return useMemo(() => {
        return {
            fontWeight: bold ? 'bold' : 'normal',
            fontFamily: fontFamily === DEFAULT_FONT ? undefined : fontFamily,
        };
    }, [bold, fontFamily]);
}

function ItemContentTemplate({ item }: IItemTemplateProps): JSX.Element {
    const { contents } = item;
    const fontFamily = contents.get('caption');
    const fontSize = contents.get('fontSize');
    const bold = contents.get('bold');
    const style = useFontStyle(fontFamily, bold);
    const className = fontSize ? `controls-fontsize-${fontSize}` : '';

    return (
        <div style={style} className={className}>
            {fontFamily}
        </div>
    );
}

function ItemTemplate(props: IItemTemplateProps): JSX.Element {
    return <MenuItemTemplate {...props} contentTemplate={ItemContentTemplate} />;
}

/**
 * Реакт компонент, редактор для выбора семейства шрифта
 * @class Controls-editors/_style/FontFamilyEditor
 * @public
 */
export const FontFamilyEditor = memo((props: IFontFamilyEditorProps) => {
    const { bold = false, fontSize, showDefault = true, onChange } = props;
    const fontCollection = useMemo(() => {
        return showDefault ? FONTS : FONTS.slice(1);
    }, [showDefault]);
    const value = (props.value as string) ?? DEFAULT_FONT;
    const items = useMemo(() => {
        return fontCollection.map((fontFamily) => {
            return {
                value: fontFamily,
                caption: fontFamily,
                bold,
                fontSize,
            };
        });
    }, [bold, fontSize, fontCollection]);

    const onChangeCallback = useCallback(
        (rawValue: unknown) => {
            if (onChange) {
                const newValue = rawValue === DEFAULT_FONT ? null : rawValue;
                onChange(newValue);
            }
        },
        [onChange]
    );

    return (
        <>
            <GoogleFonts />
            <ComboboxEditor
                items={items}
                {...props}
                onChange={onChangeCallback}
                value={value}
                itemTemplate={ItemTemplate}
                fontSize={fontSize}
                fontFamily={value === DEFAULT_FONT ? undefined : value}
                fontWeight={bold ? 'bold' : 'normal'}
            />
        </>
    );
});
