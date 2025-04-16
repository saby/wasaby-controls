import * as React from 'react';
import { Button } from 'Controls/dropdown';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import { hierarchyTasks } from 'Controls-demo/dropdown_new/Data';

const source = new ExplorerMemory({
    data: hierarchyTasks.getRawData(),
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownStickyFooterDemo(_, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    source={source}
                    keyProperty="key"
                    displayProperty="title"
                    nodeProperty="node"
                    parentProperty="parent"
                    caption="Создать"
                    menuStickyFooter={false}
                    dropdownClassName="ControlsDemo-DropdownSelector__scroll" // для скрола в меню
                    footerContentTemplate={FooterContentTemplate}
                />
            </div>
        </div>
    );
});

function FooterContentTemplate() {
    return <div>Прикладной контент в подвале</div>;
}
