import { memo } from 'react';
import { SizeEditorField } from 'Controls-editors/sizeEditor';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { IComponent } from 'Meta/types';
import * as rk from 'i18n!Controls-editors';

interface ILineHeightEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent?: IComponent<object>;
}

const DEFAULT_HEIGHT = '18px';
const UNIT_ITEMS = [
    {
        key: 'px',
        title: rk('Пиксели (px)'),
    },
];

/**
 * Реакт компонент, редактор для настройки высоты строки
 * @class Controls-editors/_style/LineHeightEditor
 * @public
 */
export const LineHeightEditor = memo((props: ILineHeightEditorProps) => {
    const value = props.value ?? DEFAULT_HEIGHT;
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
