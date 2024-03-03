import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View as ExplorerView } from 'Controls/explorer';

import * as ExplorerMemory from 'Controls-ListEnv-demo/Search/DataHelpers/ExplorerMemory';
import { Gadgets } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';

const columns = Gadgets.getSearchColumns();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <ExplorerView storeId="ViewModeSearch" columns={columns} />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ViewModeSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExplorerMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: Gadgets.getSearchData(),
                    }),
                    root: null,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    searchStartingWith: 'root',
                    multiSelectVisibility: 'visible',
                    searchParam: 'title',
                    searchNavigationMode: 'expand',
                    viewMode: 'search',
                    searchValue: 'sat',
                },
            },
        };
    },
});
