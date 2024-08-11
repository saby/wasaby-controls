import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import {
    overrideOrigSourceMethod,
    resetHistory,
} from 'Controls-demo/dropdown_new/Button/MenuMode/Utils';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
    parentProperty: 'parent',
});

overrideOrigSourceMethod();

export default React.forwardRef(function DropdownDemo(props, ref) {
    React.useEffect(() => {
        return function resetHistoryMethod() {
            resetHistory();
        };
    });

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
                />
            </div>
        </div>
    );
});
