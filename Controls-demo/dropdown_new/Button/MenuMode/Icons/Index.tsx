import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { Memory } from 'Types/source';

const source = new Memory({
    data: [
        {
            key: '1',
            title: 'Товары',
        },
        {
            key: '2',
            title: 'Подборка',
            icon: 'icon-ManyDocuments',
        },
        {
            key: '3',
            title: 'Загрузить',
            icon: 'icon-DownloadNew',
            node: true,
        },
        {
            key: '31',
            title: 'Из файла',
            parent: '3',
        },
        {
            key: '32',
            title: 'По шаблону',
            parent: '3',
        },
    ],
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownMenuModeSelectorIconsDemo(props, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    parentProperty="parent"
                    nodeProperty="node"
                    source={source}
                    menuPopupComponent="Controls/selectorSticky:Template"
                    historyId="DEMO_MENU_MODE_ICONS_HISTORY_ID"
                    icon="icon-AddButtonNew"
                />
            </div>
        </div>
    );
});
