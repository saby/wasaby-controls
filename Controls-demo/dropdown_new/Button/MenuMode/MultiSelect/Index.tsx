import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import { LocalStorage } from 'Browser/Storage';
import { MultiSelectAccessibility } from 'Controls/display';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData().map((item) => {
        return {
            ...item,
            multiSelectAccessibility: item.node
                ? MultiSelectAccessibility.hidden
                : MultiSelectAccessibility.enabled,
        };
    }),
    parentProperty: 'parent',
    keyProperty: 'key',
    filter: (item, query) => (query.parent ? item.get('parent') === query.parent : true),
});

new LocalStorage().clear();

export default React.forwardRef(function DropdownDemo(props, ref) {
    const menuItemActivate = React.useCallback((item) => {
        return item.get('node') !== true;
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
                    multiSelect={true}
                    menuPopupComponent="Controls/selectorSticky:Template"
                    multiSelectAccessibilityProperty="multiSelectAccessibility"
                    historyId="TEST_HISTORY_ID_MenuMode"
                    caption="Создать"
                    itemTemplate="Controls-demo/dropdown_new/Button/MenuMode/MultiSelect/ItemTemplate"
                    expanderPosition="custom"
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
        </div>
    );
});
