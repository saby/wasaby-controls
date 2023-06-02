import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getItems, getColumns } from './resources/CountriesData';

const columns: IColumnConfig[] = getColumns();

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
            getCellProps: (item) => ({ halign: 'center' }),
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

function DemoEditorComponent(props): React.ReactElement {
    const onChange = (event) => {
        props.setHeaderType(Number(event.target.value));
    };

    return (
        <select onChange={onChange} value={props.headerType}>
            <option value={0}>Простой заголовок</option>
            <option value={1}>Заголовок с colspan</option>
            <option value={2}>Многострочный заголовок</option>
            <option value={4}>Отключить заголовок</option>
        </select>
    );
}

interface IHeaderDemoProps {
    stickyHeader?: boolean;
}

function HeaderDemo(
    props: IHeaderDemoProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const [headerType, setHeaderType] = React.useState(0);
    const items = React.useMemo(() => {
        return getItems();
    }, []);
    return (
        <div ref={ref}>
            <ScrollContainer
                className={'controlsDemo__height500 controlsDemo__width800px'}
            >
                <GridItemsView
                    items={items}
                    header={headerVariants[headerType]}
                    columns={columns}
                    stickyHeader={props.stickyHeader}
                />
            </ScrollContainer>
            <DemoEditorComponent
                headerType={headerType}
                setHeaderType={setHeaderType}
            />
        </div>
    );
}

export default React.forwardRef(HeaderDemo);
