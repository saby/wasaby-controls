import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView } from 'Controls/list';
import { Memory } from 'Types/source';
import * as filter from 'Controls-ListEnv-demo/Filter/View/HistoryId/DataFilter';

const FilterViewOrientationDemo = React.forwardRef((_, ref) => {
    return (
        <div ref={ref} className="engineDemo__wrapper">
            <FilterView storeId="cities" detailPanelOrientation="horizontal" />
            <FilterView storeId="cities" detailPanelOrientation="horizontal" detailPanelWidth="e" />
            <ListView storeId="cities" />
        </div>
    );
});

FilterViewOrientationDemo.getLoadConfig = function () {
    return {
        cities: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                filterDescription: [
                    {
                        name: 'city',
                        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                        resetValue: null,
                        value: 1,
                        viewMode: 'basic',
                        textValue: '',
                        editorOptions: {
                            source: new Memory({
                                data: [
                                    { id: 1, title: 'Yaroslavl' },
                                    { id: 2, title: 'Moscow' },
                                    { id: 3, title: 'Kazan' },
                                ],
                                keyProperty: 'id',
                            }),
                            displayProperty: 'title',
                            keyProperty: 'id',
                            extendedCaption: 'Город',
                        },
                    },
                ],
                source: new Memory({
                    data: [
                        { id: 1, title: 'Yaroslavl' },
                        { id: 2, title: 'Moscow' },
                        { id: 3, title: 'Kazan' },
                    ],
                    keyProperty: 'id',
                    filter,
                }),
                keyProperty: 'id',
                viewMode: 'list',
                displayProperty: 'title',
            },
        },
    };
};

export default FilterViewOrientationDemo;
