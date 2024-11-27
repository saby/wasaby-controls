import AdaptiveChips from 'Controls/AdaptiveChips';
import { LegacyRef, forwardRef, useState, useCallback } from 'react';
import { RecordSet } from 'Types/collection';
import { chipsItemCounterTemplate } from 'Controls/Chips';

const CHIPS_ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: '1',
            icon: 'icon-Birthday',
            iconStyle: 'success',
            counter: 1,
        },
        {
            id: '2',
            icon: 'icon-ChangeAccount',
            iconStyle: 'danger',
            counter: 0,
        },
        {
            id: '3',
            caption: 'Нарушения',
        },
        {
            id: '4',
            caption: 'Поощрения',
            counter: 4,
        },
        {
            id: '5',
            caption: 'Зарплата',
            counter: 352000,
        },
        {
            id: '6',
            caption: 'Контакты',
            counter: 17,
        },
    ],
});

export default forwardRef(function AdaptiveChipsDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    const [selectedKeys, setSelectedKeys] = useState(['6']);
    const onSelectedKeysChanged = useCallback((_: Event, keys: string[]) => {
        setSelectedKeys(keys);
    }, []);

    return (
        <div ref={ref} className="controls-margin_top-2xl tw-flex tw-justify-center">
            <AdaptiveChips
                className="controlsDemo_fixedWidth400"
                items={CHIPS_ITEMS}
                itemTemplate={chipsItemCounterTemplate}
                selectedKeys={selectedKeys}
                onSelectedKeysChanged={onSelectedKeysChanged}
            />
        </div>
    );
});
