import * as React from 'react';
import { Button } from 'Controls/dropdown';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownDemo(_, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    groupProperty="group"
                    source={source}
                    searchParam="title"
                    menuHeadingCaption="Регламент"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    caption="Создать"
                />
            </div>
        </div>
    );
});
