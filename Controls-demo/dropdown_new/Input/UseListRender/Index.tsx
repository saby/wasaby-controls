import * as React from 'react';
import { Selector, ItemTemplate as DropdownItemTemplate } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';

const items = new RecordSet({
    rawData: [
        {
            key: '1',
            title: 'Наша компания',
            city: null,
        },
        {
            key: '2',
            title: 'Все юридические лица',
            city: null,
        },
        {
            key: '3',
            title: 'Инори, ООО',
            city: 'г. Ярославль',
        },
        {
            key: '4',
            title: '"Компания "Тензор" ООО',
            city: 'г. Ярославль',
        },
        {
            key: '5',
            title: 'Ромашка, ООО',
            city: 'г. Москва',
        },
        {
            key: '6',
            title: 'Сбербанк-Финанс, ООО',
            city: 'г. Пермь',
        },
        {
            key: '7',
            title: 'Петросоюз-Континент, ООО',
            city: 'г. Самара',
        },
        {
            key: '8',
            title: 'Альфа Директ сервис, ОАО',
            city: 'г. Москва',
        },
        {
            key: '9',
            title: 'АК "ТРАНСНЕФТЬ", ОАО',
            city: 'г. Москва',
        },
        {
            key: '10',
            title: 'Иванова Зинаида Михайловна, ИП',
            city: 'г. Ярославль',
        },
    ],
    keyProperty: 'key',
});

function ContentItemTemplate(props) {
    return (
        <div className="ws-flexbox">
            <div className="controls-padding_right-s">{props.item.contents.get('title')}</div>
            <div className="controls-text-label controls-fontsize-s">
                {props.item.contents.get('city')}
            </div>
        </div>
    );
}

function ItemTemplate(props) {
    return (
        <DropdownItemTemplate
            {...props}
            contentTemplate={ContentItemTemplate}
        ></DropdownItemTemplate>
    );
}

export default React.forwardRef(function DropdownDemo(props, ref) {
    const [selectedKeys, setSelectedKeys] = React.useState(['1']);
    const selectedKeysChanged = React.useCallback(
        (newSelectedKeys) => {
            setSelectedKeys(newSelectedKeys);
        },
        [setSelectedKeys]
    );
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flexRow">
            <div className="controlsDemo__ml2">
                <Selector
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={selectedKeysChanged}
                    emptyText="Не выбрано"
                    keyProperty="key"
                    displayProperty="title"
                    items={items}
                    useMenuListRender={true}
                    itemTemplate={ItemTemplate}
                />
            </div>
        </div>
    );
});
