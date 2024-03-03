import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { View as ExplorerView } from 'Controls/explorer';
import { EmptyTemplate, IColumn } from 'Controls/grid';
import * as ExplorerMemory from 'Controls-ListEnv-demo/Search/DataHelpers/ExplorerMemory';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Gadgets } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import 'css!Controls-ListEnv-demo/Search/Explorer/Search';
import { CrudEntityKey } from 'Types/source';

const columns: IColumn[] = [
    {
        displayProperty: 'title',
        width: '1fr',
    },
    {
        displayProperty: 'code',
        width: '150px',
    },
    {
        displayProperty: 'price',
        width: '150px',
    },
];

const DemoEmptyTemplate = React.forwardRef(function DemoEmptyTemplate(
    props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    return (
        <EmptyTemplate
            ref={ref}
            {...props}
            topSpacing="xl"
            bottomSpacing="l"
            contentTemplate={'Не найдено'}
        />
    );
});

// В демо примере демонстрируется поведение списка при значении опции searchNavigationMode: 'readonly'
function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const onSelectedKeysChanged = React.useCallback((keys: CrudEntityKey[]) => {
        setSelectedKeys(keys);
    }, []);

    const [itemClickCounter, setItemClickCounter] = React.useState(0);
    const onItemClick = React.useCallback(() => {
        setItemClickCounter(itemClickCounter + 1);
    }, [itemClickCounter]);

    return (
        <div ref={ref}>
            <SearchInput storeId="SearchNavigationModeReadonly" />
            <ExplorerView
                storeId="SearchNavigationModeReadonly"
                className="demo-Explorer ControlsDemo-Explorer"
                columns={columns}
                emptyTemplate={DemoEmptyTemplate}
                onItemClick={onItemClick}
                onSelectedKeysChanged={onSelectedKeysChanged}
                customEvents={['onSelectedKeysChanged', 'onItemClick']}
            />
            <div data-qa="demo-item-click-counter">{itemClickCounter}</div>
            <div data-qa="demo-checkbox-click-counter">{selectedKeys.length}</div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchNavigationModeReadonly: {
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
                    searchValue: 'sata',
                    searchNavigationMode: 'readonly',
                    viewMode: 'search',
                },
            },
        };
    },
});
