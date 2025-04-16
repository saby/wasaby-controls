import { forwardRef } from 'react';
import { View as ListView } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Button as OperationsButton } from 'Controls-ListEnv/operationsConnected';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Input as SearchInput } from 'Controls-ListEnv/searchConnected';
import { List as Template, IWorkspaceList } from 'Controls-Layout/workspace';
import { IRecord } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import SearchMemory from 'Controls-ListEnv-demo/Search/Misspell/SearchMemory';
import 'css!Controls-Layout-demo/Workspace/List/Index';

const STICKY_CONFIG: IWorkspaceList['stickyProps'] = {
    backgroundStyle: 'default',
    subPixelArtifactFix: true,
    pixelRatioBugFix: true,
};

const WorkspaceList = forwardRef((props, ref) => {
    return (
        <div className={(props.className || '') + ' controlsDemo__wrapper'} ref={ref}>
            <div className={'tw-flex tw-justify-end tw-items-baseline'}>
                <OperationsButton storeId={'list'} className={''}></OperationsButton>
                <SearchInput storeId={'list'}></SearchInput>
                <FilterView storeId={'list'} filterNames={['capital']}></FilterView>
            </div>
            <ScrollContainer>
                <Template
                    ref={ref}
                    stickyHeader={true}
                    stickyProps={STICKY_CONFIG}
                    operationsPanelConfig={{ storeId: 'list' }}
                    searchConfig={{ storeId: 'list' }}
                >
                    <div>
                        <ListView storeId={'list'}></ListView>
                    </div>
                </Template>
            </ScrollContainer>
        </div>
    );
});

Object.assign(WorkspaceList, {
    getLoadConfig: () => {
        function filter(item: IRecord, queryFilter: Record<string, string>): boolean {
            if (queryFilter.capital) {
                return queryFilter.capital === item.get('id');
            }
            if (queryFilter.title) {
                return item.get('title').indexOf(queryFilter.title) !== -1;
            }
            return true;
        }
        filter._moduleName = 'Controls-Layout-demo/Workspace/List';
        const source = new SearchMemory({
            data: [
                { id: 1, title: 'Ярославль', country: 'Russia' },
                { id: 2, title: 'Москва', country: 'Russia' },
                { id: 3, title: 'Вашингтон', country: 'USA' },
                { id: 4, title: 'Ростов', country: 'Russia' },
                { id: 5, title: 'Рим', country: 'Italy' },
                { id: 6, title: 'Новгород', country: 'Russia' },
                { id: 7, title: 'Тула', country: 'Russia' },
                { id: 8, title: 'Чикаго', country: 'USA' },
                { id: 9, title: 'Челябинск', country: 'Russia' },
                { id: 10, title: 'Неаполь', country: 'Italy' },
            ],
            keyProperty: 'id',
            searchParam: 'title',
            filter,
        });
        const dropdownConfig = {
            name: 'capital',
            value: null,
            resetValue: null,
            emptyText: 'Все города',
            isAdaptive: false,
            viewMode: 'basic',
            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
            editorOptions: {
                items: new RecordSet({
                    rawData: [
                        { id: 1, title: 'Ярославль', country: 'Russia' },
                        { id: 2, title: 'Москва', country: 'Russia' },
                        { id: 3, title: 'Вашингтон', country: 'USA' },
                        { id: 4, title: 'Ростов', country: 'Russia' },
                        { id: 5, title: 'Рим', country: 'Italy' },
                    ],
                    keyProperty: 'id',
                }),
                displayProperty: 'title',
                keyProperty: 'id',
            },
        } as IFilterItem;
        return {
            list: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source,
                    displayProperty: 'title',
                    keyProperty: 'id',
                    filterDescription: [dropdownConfig],
                    searchParam: 'title',
                },
            },
        };
    },
});

export default WorkspaceList;
