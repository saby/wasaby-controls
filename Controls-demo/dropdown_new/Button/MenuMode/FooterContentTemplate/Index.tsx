import * as React from 'react';
import { Button as DropdownButton } from 'Controls/dropdown';
import { Button } from 'Controls/buttons';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
    filter: () => true,
});

export default React.forwardRef(function DropdownDemo(props, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <DropdownButton
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    searchParam="title"
                    menuHeadingCaption="Регламент"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    caption="Создать"
                    footerContentTemplate={FooterContentTemplate}
                />
            </div>
        </div>
    );
});

function FooterContentTemplate() {
    return (
        <div className="controlsDemo__dropdown-button__footerContentTemplate">
            <Button caption="+ Задача" viewMode="linkButton" />
        </div>
    );
}
