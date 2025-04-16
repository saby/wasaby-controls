import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { itemsWithUsed } from './Data';
import { Memory } from 'Types/source';

const source = new Memory({
    data: itemsWithUsed,
    keyProperty: 'key',
    filter: (item, query: { used?: boolean }) => {
        if (query.used) {
            return item.get('used') === query.used;
        } else {
            return true;
        }
    },
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
        breadCrumbsVisibility: 'visible',
        filterDescription,
        filterDescriptionEmptyText: 'Все',
    },
};

export default React.forwardRef(function DropdownDemo(props, ref) {
    const menuItemActivate = React.useCallback((item) => {
        return item.get('node') !== true;
    }, []);

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
                    searchPlaceholder="Регламент"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    menuPopupOptions={menuPopupOptions}
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
        </div>
    );
});
