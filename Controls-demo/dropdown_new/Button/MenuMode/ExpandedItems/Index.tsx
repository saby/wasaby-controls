import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import { Memory } from 'Types/source';

const source = new Memory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
});

const EXPANDED_ITEMS = ['1', '14'];

export default React.forwardRef(function DropdownDemo(props, ref) {
    const menuItemActivate = React.useCallback((item) => {
        return !(item.get('node') === false || item.get('node') === true);
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    menuHeadingCaption="Регламент"
                    menuMode="selector"
                    historyId="demo_history_id"
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                    menuExpandedItems={EXPANDED_ITEMS}
                />
            </div>
        </div>
    );
});
