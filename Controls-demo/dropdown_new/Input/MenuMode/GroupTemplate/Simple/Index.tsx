import * as React from 'react';
import { Selector } from 'Controls/dropdown';
import { groupConstants } from 'Controls/list';
import { companies } from 'Controls-demo/dropdown_new/Data';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';

const source = new Memory({
    data: companies.getRawData().map((item) => {
        if (!item.city) {
            item.city = groupConstants.hiddenGroup;
        }
        return item;
    }),
    keyProperty: 'key',
});

const selectedItems = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Наша компания',
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
    const menuItemClick = React.useCallback((item) => {
        return !item.get('node');
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Selector
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    onMenuItemClick={menuItemClick}
                    keyProperty="key"
                    displayProperty="title"
                    groupProperty="city"
                    source={source}
                    searchParam="title"
                    selectedItems={selectedItems}
                    menuHeadingCaption="Регламент"
                    menuPopupComponent="Controls/selectorSticky:Template"
                />
            </div>
        </div>
    );
});
