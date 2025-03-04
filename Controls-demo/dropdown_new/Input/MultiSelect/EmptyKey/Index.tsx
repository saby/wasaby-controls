import * as React from 'react';
import { Selector } from 'Controls/dropdown';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import { RecordSet } from 'Types/collection';

const emptyKey = ['-1', '-2'];

const source = new ExplorerMemory({
    data: [
        { key: '-1', title: 'Контактное лицо' },
        { key: '-2', title: 'Лицо, принимающее решение' },
        { key: '1', title: 'Продажа компьютеров' },
        { key: '2', title: 'ТО компьютеров' },
        { key: '3', title: 'Лицензии' },
        { key: '4', title: 'Программы' },
    ],
    keyProperty: 'key',
    parentProperty: 'parent',
    filter: () => true,
});

const selectedItems = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Продажа компьютеров',
        },
    ],
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownDemo(props, ref) {
    const [selectedKeys, setSelectedKeys] = React.useState(['1']);
    const selectedKeysChanged = React.useCallback(
        (newSelectedKeys) => {
            setSelectedKeys(newSelectedKeys);
        },
        [setSelectedKeys]
    );
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Selector
                    emptyKey={emptyKey}
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    keyProperty="key"
                    displayProperty="title"
                    source={source}
                    selectedItems={selectedItems}
                    multiSelect={true}
                />
            </div>
        </div>
    );
});
