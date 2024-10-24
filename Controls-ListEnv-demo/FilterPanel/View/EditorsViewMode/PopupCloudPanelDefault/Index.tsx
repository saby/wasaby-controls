import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import { Button } from 'Controls/buttons';
import { View as FilterPanel } from 'Controls-ListEnv/filterPanelConnected';
import { IColumn, IHeaderCell, View as GridView } from 'Controls/grid';
import { ListSlice } from 'Controls/dataFactory';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from 'Controls-ListEnv-demo/FilterPanel/View/EditorsViewMode/PopupCloudPanelDefault/DataFilter';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const header: IHeaderCell[] = [
    { caption: 'Отдел' },
    { caption: 'Руководитель' },
    { caption: 'Город' },
    { caption: 'Дата' },
];

const columns: IColumn[] = [
    {
        displayProperty: 'department',
    },
    {
        displayProperty: 'owner',
    },
    {
        displayProperty: 'city',
    },
    {
        displayProperty: 'date',
    },
];

const filterNames = ['folder'];

function WidgetWrapper(props, ref) {
    const slice = useSlice<ListSlice>('folderFilter');

    const addFolder = React.useCallback(() => {
        const folderItems = slice.state.filterDescription[0].editorOptions.items;
        const lastId = folderItems.at(folderItems.getCount() - 1).get('id');
        const newFolder = new Model({
            rawData: {
                id: lastId + 1,
                title: `Папка ${lastId + 1}`,
            },
            keyProperty: 'id',
        });
        folderItems.add(newFolder);
        const newFolderDescription = {
            ...slice.state.filterDescription[0],
            value: newFolder.getKey(),
        };
        slice.applyFilterDescription([newFolderDescription]);
    }, [slice]);
    return (
        <div ref={ref} className="engine-demo__Widgets_filter-container">
            <div className="tw-flex tw-flex-col">
                <Button caption="+ Папка" onClick={addFolder} />
                <FilterPanel
                    storeId="folderFilter"
                    editorsViewMode="popupCloudPanelDefault"
                    filterNames={filterNames}
                />
            </div>
            <GridView storeId="folderFilter" columns={columns} header={header} />
        </div>
    );
}

const WidgetWrapperRef = React.forwardRef(WidgetWrapper);

WidgetWrapperRef.getLoadConfig = () => {
    return {
        folderFilter: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: sourceData,
                    keyProperty: 'department',
                    filter,
                }),
                displayProperty: 'title',
                keyProperty: 'department',
                filterDescription: [
                    {
                        name: 'folder',
                        caption: 'Папка',
                        editorTemplateName: 'Controls/filterPanel:ListEditor',
                        resetValue: null,
                        value: null,
                        textValue: '',
                        markerStyle: 'primary',
                        editorOptions: {
                            source: new Memory({
                                keyProperty: 'id',
                                data: [
                                    {
                                        id: 1,
                                        title: 'Входящие',
                                    },
                                    {
                                        id: 2,
                                        title: 'Исходящие',
                                    },
                                ],
                            }),
                            emptyText: 'Все',
                            emptyKey: null,
                            displayProperty: 'title',
                            keyProperty: 'id',
                        },
                    },
                ],
            },
        },
    };
};

export default WidgetWrapperRef;
