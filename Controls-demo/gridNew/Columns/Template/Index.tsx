import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import * as countryRatingNumber from 'wml!Controls-demo/gridNew/resources/CellTemplates/CountryRatingNumber';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().splice(0, 5);
}

const columns: IColumn[] = [
    {
        displayProperty: 'number',
        width: 'max-content',
        compatibleWidth: '44px',
        template: countryRatingNumber,
    },
    {
        displayProperty: 'country',
        width: '300px',
    },
    {
        displayProperty: 'capital',
        width: '100px',
    },
    {
        displayProperty: 'population',
        width: '150px',
    },
    {
        displayProperty: 'square',
        width: '150px',
    },
    {
        displayProperty: 'populationDensity',
        width: 'max-content',
        compatibleWidth: '60px',
    },
];

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View
                className="controlsDemo__inline-flex"
                storeId="ColumnsTemplate"
                columns={columns}
            />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnsTemplate: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
            },
        },
    };
};
