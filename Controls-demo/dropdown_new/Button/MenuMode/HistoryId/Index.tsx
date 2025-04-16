import * as React from 'react';
import { Button } from 'Controls/dropdown';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import { LocalStorage } from 'Browser/Storage';
import { hierarchyTasksBig } from 'Controls-demo/dropdown_new/Data';

new LocalStorage().clear();

const source = new ExplorerMemory({
    data: hierarchyTasksBig.getRawData(),
    keyProperty: 'key',
    filter: (item, query) => (query.parent ? item.get('parent') === query.parent : true),
});

export default React.forwardRef(function DropdownDemo(_, ref: React.ForwardedRef<HTMLDivElement>) {
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
                    menuPopupComponent="Controls/selectorSticky:Template"
                    historyId="TEST_HISTORY_ID_MenuMode"
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
        </div>
    );
});
