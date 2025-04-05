import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
});

const menuPopupOptions = {
    templateOptions: {
        breadCrumbsVisibility: 'visible',
    },
};

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
                    menuHeadingCaption="Выберите объект"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    menuPopupOptions={menuPopupOptions}
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
        </div>
    );
});
