import * as React from 'react';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView } from 'Controls/list';
import 'Controls-ListEnv-demo/FilterPanelPopup/Sticky/HistoryId/EmptyHistory/HistorySourceDemo';

const FilterPanelPopupDemo = React.forwardRef(function (_, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__ml2">
            <div>
                <FilterView
                    storeId="historyData"
                    alignment="left"
                    detailPanelOrientation="horizontal"
                    detailPanelEmptyHistoryTemplate={() => <div>В истории еще нет записей</div>}
                />
                <FilterView
                    storeId="historyData"
                    alignment="left"
                    detailPanelOrientation="horizontal"
                />
                <ListView storeId="historyData" />
            </div>
        </div>
    );
});

FilterPanelPopupDemo.getLoadConfig = (): Record<string, IDataConfig<IListDataFactoryArguments>> => {
    return {
        historyData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [
                        { id: 'Yaroslavl', title: 'Yaroslavl' },
                        { id: 'Moscow', title: 'Moscow' },
                        { id: 'Kazan', title: 'Kazan' },
                    ],
                    keyProperty: 'id',
                    filter,
                }),
                historyId: 'favoriteDialogHistoryId',
                keyProperty: 'id',
                displayProperty: 'title',
                filterDescription: [
                    {
                        name: 'city',
                        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                        resetValue: [],
                        value: ['Moscow'],
                        viewMode: 'basic',
                        textValue: '',
                        editorOptions: {
                            source: new Memory({
                                keyProperty: 'id',
                                data: [
                                    { id: 'Yaroslavl', title: 'Yaroslavl' },
                                    { id: 'Moscow', title: 'Moscow' },
                                    { id: 'Kazan', title: 'Kazan' },
                                ],
                            }),
                            displayProperty: 'title',
                            keyProperty: 'id',
                            multiSelect: true,
                        },
                    },
                ],
            },
        },
    };
};

export default FilterPanelPopupDemo;
