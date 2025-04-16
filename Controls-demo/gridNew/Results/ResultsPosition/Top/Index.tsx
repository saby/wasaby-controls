import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 9);
}

const columns = Countries.getColumnsWithWidths(false);
columns[1].width = '224px';

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo__maxWidth800';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ResultsPositionTop" columns={columns} resultsPosition="top" />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ResultsPositionTop: {
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
