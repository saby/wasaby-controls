import { memo, useMemo } from 'react';
import { SizeEditorField, IConstraint } from 'Controls-editors/sizeEditor';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import * as rk from 'i18n!Controls-editors';

interface IFontSizeEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
    maxPixelValue?: number;
}

// 1 pt = 4 / 3 px
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const PT = 4 / 3;
const DEFAULT_PIXEL_VALUE = 14;
const UNIT_ITEMS = [
    {
        key: 'px',
        title: rk('Пиксели (px)'),
    },
    {
        key: 'pt',
        title: rk('Пункты (pt)'),
    },
    {
        key: 'em',
        title: rk('Размер шрифта (em)'),
    },
];

/**
 * Реакт компонент, редактор для настройки размера шрифта
 * @class Controls-editors/_style/FontSizeEditor
 * @public
 */
export const FontSizeEditor = memo((props: IFontSizeEditorProps) => {
    const value = props.value ?? `${DEFAULT_PIXEL_VALUE}px`;
    const maxPixelValue = props.maxPixelValue;
    const constraints: Record<string, IConstraint> | undefined = useMemo(() => {
        if (maxPixelValue === undefined) {
            return;
        }

        return {
            px: { min: 1, max: maxPixelValue },
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            pt: { min: 1, max: Math.floor(maxPixelValue / PT) },
            em: { min: 1, max: Math.floor(maxPixelValue / DEFAULT_PIXEL_VALUE) },
        };
    }, [maxPixelValue]);

    return (
        <SizeEditorField
            showBorder={true}
            showUnit={true}
            showIterateButtons={true}
            inputAlign="left"
            unitItems={UNIT_ITEMS}
            {...props}
            value={value}
            defaultValue={`${DEFAULT_PIXEL_VALUE}px`}
            constraints={constraints}
        />
    );
});
