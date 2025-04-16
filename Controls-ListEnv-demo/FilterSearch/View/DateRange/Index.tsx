import * as React from 'react';
import { View } from 'Controls-ListEnv/filterSearchConnected';
import { Memory } from 'Types/source';
import 'css!Controls-ListEnv-demo/FilterSearch/filter';

const FilterSearchDemo = React.forwardRef((props, ref) => {
    return (
        <div
            className="controlsDemo__wrapper controls-ListEnv-demo-FilterSearch-maxWidth"
            ref={ref}
        >
            <View
                storeId="dateMenuData"
                searchParam="title"
                alignment={'right'}
                contrastBackground={true}
            />
        </div>
    );
});

FilterSearchDemo.getLoadConfig = function () {
    return {
        dateMenuData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                historyId: 'DEMO_FILTER_VIEW_DATE_MENU_ITEMS_HISTORY_ID',
                displayProperty: 'title',
                searchParam: 'title',
                filterDescription: [
                    {
                        name: 'date',
                        value: null,
                        type: 'dateRange',
                        itemTemplate:
                            'wml!Controls-ListEnv-demo/Filter/View/Editors/DateRangeValidation/resources/DateRange',
                        validators: [
                            'Controls-ListEnv-demo/Filter/View/Editors/DateRangeValidation/Validator:Validator.dateRange',
                        ],
                        editorOptions: {
                            _date: new Date(2022, 0, 30),
                            _displayDate: new Date(2022, 0, 30),
                            emptyCaption: 'Весь период',
                            editorMode: 'Selector',
                            chooseHalfyears: true,
                            chooseYears: true,
                            resetStartValue: null,
                            resetEndValue: null,
                        },
                    },
                ],
            },
        },
    };
};

export default FilterSearchDemo;
