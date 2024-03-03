import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

const FilterDemo = React.forwardRef(function FilterEditorsDemo(props, ref) {
    return (
        <div className="controlsDemo__wrapper">
            <FilterView
                ref={ref}
                storeId="dateData"
                detailPanelTemplateName="Controls/filterPanelPopup:Sticky"
            />
        </div>
    );
});

FilterDemo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        dateData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                displayProperty: 'title',
                filterDescription: [
                    {
                        caption: 'Дата отправки',
                        name: 'dateEditor',
                        editorTemplateName:
                            'Controls-ListEnv/filterPanelExtEditors:DateRangeInputEditor',
                        resetValue: [],
                        viewMode: 'extended',
                        value: [],
                        editorOptions: {
                            closeButtonVisibility: 'hidden',
                            extendedCaption: 'Дата',
                        },
                    },
                ],
            },
        },
    };
};

export default FilterDemo;
