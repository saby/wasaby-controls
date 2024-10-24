import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import { Memory } from 'Types/source';
import {
    overrideOrigSourceMethod,
    resetHistory,
} from 'Controls-demo/dropdown_new/Button/MenuMode/MemorySource/Utils';

const source = new Memory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
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
