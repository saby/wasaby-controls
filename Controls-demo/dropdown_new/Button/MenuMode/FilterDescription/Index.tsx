import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { itemsWithUsed } from './Data';
import { Memory } from 'Types/source';

const source = new Memory({
    data: itemsWithUsed,
    keyProperty: 'key',
});

const filterDescription = [
    {
        name: 'used',
        value: null,
        resetValue: null,
        emptyText: 'Все',
        viewMode: 'frequent',
        editorOptions: {
            source: new Memory({
                data: [
                    {
                        key: true,
                        title: 'Используемые',
                    },
                ],
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            displayProperty: 'title',
        },
    },
];

const menuPopupOptions = {
    templateOptions: {
        filterDescription,
        filterDescriptionEmptyText: 'Все',
    },
};

export default React.forwardRef(function DropdownDemo(props, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    icon="icon-AddButtonNew"
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    menuPopupOptions={menuPopupOptions}
                />
            </div>
        </div>
    );
});
