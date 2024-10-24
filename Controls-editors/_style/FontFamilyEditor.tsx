import { memo, useMemo, CSSProperties } from 'react';
import { ComboboxEditor } from 'Controls-editors/properties';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import { Model } from 'Types/entity';
import { ItemTemplate as MenuItemTemplate } from 'Controls/menu';
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

// Подключение гугл шрифтов, как временное решение
const GOOGLE_FONTS =
    "@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');" +
    "@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');";

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
    const { bold = false, fontSize, showDefault = true } = props;
    const fontCollection = useMemo(() => {
        return showDefault ? FONTS : FONTS.slice(1);
    }, [showDefault]);
    const value = (props.value as string) ?? undefined;
    const items = useMemo(() => {
        return fontCollection.map((fontFamily) => {
            return {
                value: fontFamily === DEFAULT_FONT ? undefined : fontFamily,
                caption: fontFamily,
                bold,
                fontSize,
            };
        });
    }, [bold, fontSize, fontCollection]);

    return (
        <>
            <style>{GOOGLE_FONTS}</style>
            <ComboboxEditor
                items={items}
                {...props}
                value={value}
                itemTemplate={ItemTemplate}
                fontSize={fontSize}
                fontFamily={value === DEFAULT_FONT ? undefined : value}
                fontWeight={bold ? 'bold' : 'normal'}
            />
        </>
    );
});
