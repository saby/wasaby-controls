import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { CheckboxCircleMarker } from 'Controls/list';

import { getData } from 'Controls-demo/gridReact/resources/CountriesData';
import { RecordSet } from 'Types/collection';

const COLUMNS: IColumnConfig[] = [
    {
        key: 'key',
        displayProperty: 'key',
        width: '50px',
    },
    {
        key: 'country',
        width: '1fr',
        displayProperty: 'country',
    },
    {
        key: 'capital',
        width: '250px',
        displayProperty: 'capital',
    },
];

function getItems() {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(5),
    });
}

const ITEMS = getItems();

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const getRowProps = React.useCallback(() => {
        return {
            multiSelectRender: <CheckboxCircleMarker />,
        };
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    getRowProps={getRowProps}
                    multiSelectVisibility={'visible'}
                />
            </ScrollContainer>
        </div>
    );
});
