import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import { Memory } from 'Types/source';
import { LocalStorage } from 'Browser/Storage';

const source = new Memory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
});

new LocalStorage().clear();

export default React.forwardRef(function DropdownDemo(props, ref) {
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
                    historyId="demo_history_id"
                    caption="Создать"
                />
            </div>
        </div>
    );
});
