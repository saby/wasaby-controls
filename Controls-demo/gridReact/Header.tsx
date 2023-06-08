import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

const columns: IColumnConfig[] = [
    {
        displayProperty: 'key',
        key: 'c1',
        width: '50px',
    },
    {
        displayProperty: 'country',
        key: 'c2',
        width: '200px',
    },
    {
        displayProperty: 'capital',
        key: 'c3',
        width: '200px',
    },
];

const headerVariants: IHeaderConfig[][] = [
    [
        {
            caption: '№',
            key: 'h1',
        },
        {
            caption: 'Страна',
            key: 'h2',
        },
        {
            caption: 'Столица',
            key: 'h3',
        },
    ],
    [
        {
            caption: '№',
            startColumn: 1,
            endColumn: 2,
            key: 'h1',
        },
        {
            caption: 'Географические данные',
            startColumn: 2,
            endColumn: 4,
            key: 'h2',
        },
    ],
    [
        {
            caption: '№',
            startRow: 1,
            endRow: 3,
            startColumn: 1,
            endColumn: 2,
            key: 'h1',
        },
        {
            caption: 'Географические данные',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 4,
            halign: 'center',
            key: 'h2',
        },
        {
            caption: 'Страна',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3,
            key: 'h3',
        },
        {
            caption: 'Столица',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4,
            key: 'h4',
        },
    ],
    null,
];

const items = new RecordSet({
    keyProperty: 'key',
    rawData: [
        { key: 1, country: 'Бразилия', capital: 'Бразилиа' },
        { key: 2, country: 'Россия', capital: 'Москва' },
        { key: 3, country: 'Индия', capital: 'Нью-Дели' },
        { key: 4, country: 'Китайская Народная Республика', capital: 'Пекин' },
        {
            key: 5,
            country: 'Южная Африканская Республика',
            capital: 'Претория',
        },
    ],
});

function DemoEditorComponent(props): React.ReactElement {
    const onChange = (event) => {
        props.setHeaderType(Number(event.target.value));
    };

    return (
        <>
            <select onChange={onChange} value={props.headerType}>
                <option value={0}>Простой заголовок</option>
                <option value={1}>Заголовок с colspan</option>
                <option value={2}>Многострочный заголовок</option>
                <option value={4}>Отключить заголовок</option>
            </select>
            <div>{props.headerType}</div>
        </>
    );
}

export default React.forwardRef(
    (props, ref: React.ForwardedRef<HTMLDivElement>) => {
        const [headerType, setHeaderType] = React.useState(0);

        return (
            <div ref={ref}>
                <GridItemsView
                    items={items}
                    header={headerVariants[headerType]}
                    columns={columns}
                />
                <DemoEditorComponent
                    headerType={headerType}
                    setHeaderType={setHeaderType}
                />
            </div>
        );
    }
);
