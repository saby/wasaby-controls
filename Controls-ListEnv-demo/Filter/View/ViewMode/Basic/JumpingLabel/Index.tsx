import * as React from 'react';
import { IColumn, IHeaderCell, View as GridView } from 'Controls/grid';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { Memory } from 'Types/source';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { lookupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/Caption/Index';
import { dropdownSingleSelectConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index';
import * as filter from 'Controls-ListEnv-demo/Filter/View/ViewMode/Extended/DataFilter';
import { IFilterItem } from 'Controls/filter';

const columns: IColumn[] = [
    {
        displayProperty: 'department',
    },
    {
        displayProperty: 'owner',
    },
    {
        displayProperty: 'salary',
    },
    {
        displayProperty: 'city',
    },
    {
        displayProperty: 'date',
    },
];

const header: IHeaderCell[] = [
    { caption: 'Отдел' },
    { caption: 'Руководитель' },
    { caption: 'Зарплата' },
    { caption: 'Город' },
    { caption: 'Дата' },
];

const lookupJumpingConfig = {
    ...lookupConfig,
    jumpingLabel: true,
    caption: 'Город',
    resetValue: null,
};

const dropdownConfig = {
    ...dropdownSingleSelectConfig,
    jumpingLabel: true,
} as IFilterItem;

const JumpingLabelDemo = React.forwardRef((_, ref) => {
    return (
        <div ref={ref}>
            <FilterView storeId="extendedData" alignment="left" />
            <GridView
                storeId="extendedData"
                columns={columns}
                header={header}
                className="engine-demo__Widgets_filterList"
            />
        </div>
    );
});

JumpingLabelDemo.getLoadConfig = () => {
    return {
        extendedData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: sourceData,
                    keyProperty: 'department',
                    filter,
                }),
                root: null,
                historyId: 'ViewMode-Extended__HistoryId',
                keyProperty: 'department',
                displayProperty: 'title',
                filterDescription: [lookupJumpingConfig, dropdownConfig],
            },
        },
    };
};

export default JumpingLabelDemo;
