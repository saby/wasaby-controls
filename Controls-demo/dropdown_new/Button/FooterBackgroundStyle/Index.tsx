import * as React from 'react';
import { Button } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';

const items = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Запись 1',
        },
        {
            key: '2',
            title: 'Запись 2',
        },
        {
            key: '3',
            title: 'Запись 3',
        },
        {
            key: '4',
            title: 'Запись 4',
        },
    ],
    keyProperty: 'key',
});

export default React.forwardRef(function DropdownDemo(props, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Button
                    keyProperty="key"
                    displayProperty="title"
                    items={items}
                    caption="Создать"
                    footerContentTemplate={FooterContentTemplate}
                    menuFooterBackgroundStyle="unaccented"
                />
            </div>
        </div>
    );
});

function FooterContentTemplate() {
    return <div className="controls-padding_left-m">Настроить</div>;
}
