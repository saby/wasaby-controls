import * as React from 'react';
import { Button, GroupTemplate as MenuGroupTemplate } from 'Controls/dropdown';
import * as ExplorerMemory from 'Controls-demo/Explorer/ExplorerMemory';
import { RecordSet } from 'Types/collection';
const actionsSmall = new RecordSet({
    keyProperty: 'key',
    rawData: [
        {
            key: '1',
            title: 'Распечатать',
            icon: 'icon-Print',
            node: null,
            group: 'test',
        },
        {
            key: '2',
            title: 'Выгрузить',
            icon: 'icon-DownloadNew',
            node: true,
            group: 'test',
        },
        {
            key: '3',
            title: 'Копировать',
            icon: 'icon-Copy',
            node: null,
            group: 'test',
        },
    ],
});
const source = new ExplorerMemory({
    data: actionsSmall.getRawData(),
    keyProperty: 'key',
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
                    groupProperty="group"
                    groupTemplate="Controls-demo/dropdown_new/Button/MenuMode/GroupProperty/GroupTemplate/Index:GroupTemplate"
                    source={source}
                    searchParam="title"
                    menuHeadingCaption="Регламент"
                    menuPopupComponent="Controls/selectorSticky:Template"
                    caption="Создать"
                    onMenuItemActivate={menuItemActivate}
                />
            </div>
        </div>
    );
});

export function GroupTemplate(props) {
    return <MenuGroupTemplate {...props} showText={true} />;
}
