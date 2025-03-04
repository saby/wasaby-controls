import AdaptiveChips from 'Controls/AdaptiveChips';
import { LegacyRef, forwardRef, useState, useCallback } from 'react';
import { chipsItemCounterTemplate } from 'Controls/Chips';
import { CHIPS_ITEMS } from '../resources/data';

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
                multiSelect={false}
            />
        </div>
    );
});
