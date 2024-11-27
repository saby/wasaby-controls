import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { IColumn } from 'Controls/grid';
import { ItemsView as GridView } from 'Controls/grid';
import { getItems } from 'Controls-demo/gridReact/resources/CountriesData';

function CountryColumnItemTemplate(props): ReactElement {
    const item = props.item.contents.get('country');
    return <div>Hi, i am {item}</div>;
}

const COLUMNS: IColumn[] = [
    {
        displayProperty: 'key',
        width: '50px',
    },
    {
        reactContentTemplate: CountryColumnItemTemplate,
        width: '250px',
        displayProperty: 'country',
    },
    {
        width: '250px',
        displayProperty: 'capital',
    },
];

const ITEMS = getItems(5);

export default React.forwardRef(function Demo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <GridView columns={COLUMNS} items={ITEMS} />
        </div>
    );
});
