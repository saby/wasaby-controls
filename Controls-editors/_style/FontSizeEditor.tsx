import { memo } from 'react';
import { SizeEditorField } from 'Controls-editors/sizeEditor';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import * as rk from 'i18n!Controls-editors';

interface IFontSizeEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
}

const DEFAULT_SIZE = '14px';
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
    const value = props.value ?? DEFAULT_SIZE;
    return (
        <SizeEditorField
            showBorder={true}
            showUnit={true}
            showIterateButtons={true}
            inputAlign="left"
            unitItems={UNIT_ITEMS}
            {...props}
            value={value}
        />
    );
});
