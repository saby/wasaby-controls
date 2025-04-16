import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

const COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '50px',
    },
    {
        key: 'title',
        width: '1fr',
        displayProperty: 'title',
    },
    {
        key: 'subtitle',
        width: '250px',
        displayProperty: 'subtitle',
    },
];

const ITEMS = new RecordSet({
    keyProperty: 'key',
    rawData: [
        {
            key: 0,
            title: 'При клике средней кнопокой по записи',
            subtitle: 'открывается вкладка ya.ru',
            openUrl: 'https://ya.ru/',
        },
    ],
});

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo__width800px'}>
            <GridView columns={COLUMNS} items={ITEMS} urlProperty={'openUrl'} />
        </div>
    );
});
