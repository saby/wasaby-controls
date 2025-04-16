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
                        caption: 'Период',
                        name: 'dateRange',
                        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
                        viewMode: 'frequent',
                        textValue: 'Весь период',
                        value: null,
                        resetValue: null,
                        emptyText: 'Весь период',
                        type: 'dateMenu',
                        editorOptions: {
                            closeButtonVisibility: 'hidden',
                            excludedPeriods: ['yesterday', 'quarter', 'year'],
                            userPeriods: [
                                {
                                    key: 'Overdue',
                                    title: 'Просроченные',
                                    frequent: true,
                                },
                            ],
                            displayProperty: 'title',
                            keyProperty: 'key',
                        },
                    },
                ],
            },
        },
    };
};

export default FilterSearchDemo;
