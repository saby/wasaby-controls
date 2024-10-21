import * as React from 'react';
import { Selector } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import { RecordSet } from 'Types/collection';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
    parentProperty: 'parent',
});

const selectedItems = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Разработка',
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
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    selectedItems={selectedItems}
                    menuHeadingCaption="Регламент"
                    multiSelect={true}
                    menuMode="selector"
                />
            </div>
        </div>
    );
});
