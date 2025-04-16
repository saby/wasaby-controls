import { useCallback, useMemo } from 'react';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Button as DropdownButton } from 'Controls/dropdown';

import { KeyUnits } from './constants';

import * as rk from 'i18n!Controls-editors';

export interface IUnitItems {
    key: string;
    title: string;
}

interface IUnitSelectorProps {
    caption: string;
    items: IUnitItems[] | undefined;
    units: string[];
    activeUnit: KeyUnits;
    className: string;
    onChange: (newUnit: string) => void;
}

const DROPDOWN_EVENTS = ['onSelectedKeyChanged'];
const UNIT_ITEMS_DEFAULT: IUnitItems[] = [
    { key: KeyUnits.pixel, title: rk('Фиксированная (px)') },
    { key: KeyUnits.percent, title: rk('Относительная (%)') },
    { key: KeyUnits.fit, title: rk('По контенту') },
    { key: KeyUnits.fill, title: rk('Заполнить') },
];

function SizeEditorUnit(props: IUnitSelectorProps): JSX.Element {
    const { caption, items, units, activeUnit, className, onChange } = props;

    const unitItems = useMemo(() => {
        const rawData = items ? items : UNIT_ITEMS_DEFAULT.filter(({ key }) => units.includes(key));

        return new RecordSet({
            keyProperty: 'key',
            rawData: rawData.map((item) =>
                item.key === activeUnit
                    ? { ...item, icon: 'icon-markList1', iconStyle: 'danger', iconSize: 's' }
                    : item
            ),
        });
    }, [items, units, activeUnit]);

    const readOnly = useMemo(() => unitItems.getCount() <= 1, [unitItems]);

    const onMenuItemActivate = useCallback(
        (item: Model) => {
            onChange(item.getKey());
        },
        [onChange]
    );

    return (
        <div className={`${className} controls-PropertyGrid-sizeEditor__select`}>
            {/* @ts-ignore */}
            <DropdownButton
                items={unitItems}
                caption={caption}
                keyProperty="key"
                displayProperty="title"
                customEvents={DROPDOWN_EVENTS}
                viewMode="link"
                closeButtonVisibility={false}
                headerTemplate={null}
                buttonStyle="unaccented"
                fontColorStyle="unaccented"
                inlineHeight="m"
                readOnly={readOnly}
                onMenuItemActivate={onMenuItemActivate}
            />
        </div>
    );
}

export default SizeEditorUnit;
