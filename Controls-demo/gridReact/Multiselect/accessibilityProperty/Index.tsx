import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { MultiSelectAccessibility } from 'Controls/list';

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
    const data = getData(5);
    data[0].checkboxState = MultiSelectAccessibility.disabled;
    data[1].checkboxState = MultiSelectAccessibility.disabled;
    data[2].checkboxState = MultiSelectAccessibility.hidden;
    data[3].checkboxState = MultiSelectAccessibility.enabled;
    data[4].checkboxState = MultiSelectAccessibility.enabled;
    return new RecordSet({
        keyProperty: 'key',
        rawData: data,
    });
}

const ITEMS = getItems();

export default React.forwardRef(function StickyCallbackDemo(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const getRowProps = React.useCallback(() => {
        return {};
    }, []);

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <ScrollContainer className={'controlsDemo__height300 controlsDemo__width800px'}>
                <GridView
                    columns={COLUMNS}
                    items={ITEMS}
                    getRowProps={getRowProps}
                    multiSelectAccessibilityProperty={'checkboxState'}
                    multiSelectVisibility={'visible'}
                />
            </ScrollContainer>
        </div>
    );
});
