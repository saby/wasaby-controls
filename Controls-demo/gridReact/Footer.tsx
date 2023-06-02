import * as React from 'react';

import 'Controls/gridReact';
import { IColumnConfig, IFooterConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';

import { getItems, getColumns } from './resources/CountriesData';

interface IDemoProps {
    stickyFooter?: boolean;
}

function getDefaultFooter(): IFooterConfig[] {
    return [
        {
            key: 'footer_1',
        },
        {
            key: 'footer_2',
            render: <i>Ячейка подвала</i>,
        },
        {
            key: 'footer_3',
            render: <i>Ячейка подвала</i>,
        },
    ];
}

function getFooterWithColspan(): IFooterConfig[] {
    return [
        {
            key: 'count',
            render: <i>Ячейка подвала на всю строку</i>,
            startColumn: 1,
            endColumn: 4
        },
    ];
}

function FooterDemo(
    props: IDemoProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const items = React.useMemo(() => getItems(), []);
    const columns = React.useMemo<IColumnConfig[]>(() => getColumns(), []);
    const [footer, setFooter] = React.useState<IFooterConfig[]>(getDefaultFooter());

    const setFooterWithColspan = () => {
        setFooter(getFooterWithColspan);
    };

    return (
        <div ref={ref}>
            <button onClick={setFooterWithColspan}>Footer with colspan</button>
            <ScrollContainer
                className={'controlsDemo__height500 controlsDemo__width800px'}
            >
                <GridItemsView
                    items={items}
                    columns={columns}
                    footer={footer}
                    stickyFooter={props.stickyFooter === undefined}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(FooterDemo);
