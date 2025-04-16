import * as React from 'react';
import ComboBox from 'Controls/ComboBox';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';

const items = [
    { key: 1, title: 'Ярославль', add: false },
    { key: 2, title: 'Москва', add: false },
    { key: 3, title: 'Санкт-Петербург', add: true },
];

const source = new Memory({
    keyProperty: 'key',
    data: items,
});

const selectedItems = new RecordSet({
    rawData: [{ ...items[2] }],
    keyProperty: 'key',
});

export default React.forwardRef(function ComboboxValueDemo(_, ref) {
    const [selectedKey, setSelectedKey] = React.useState<number>(3);

    const selectedKeyChanged = React.useCallback(
        (value) => {
            setSelectedKey(value);
        },
        [setSelectedKey]
    );

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2 demo-ComboboxBorderVisibility__visible">
                <ComboBox
                    source={source}
                    displayProperty="title"
                    keyProperty="key"
                    selectedKey={selectedKey}
                    selectedItems={selectedItems}
                    onSelectedKeyChanged={selectedKeyChanged}
                />
            </div>
        </div>
    );
});
