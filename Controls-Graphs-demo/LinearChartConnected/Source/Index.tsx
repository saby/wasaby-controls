import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { default as LinearChartConnected } from 'Controls-Graphs/LinearChartConnected';
import { Memory } from 'Types/source';
import {
    LINEAR_CHART_DATA,
    LINEAR_CHART_SERIES_CONFIG,
} from 'Controls-Graphs-demo/LinearChartConnected/resources/data';

function LinearChartConnectedItemsDemo(_, ref) {
    return (
        <div ref={ref} className="controls-Graphs-demo__LinearChart">
            <LinearChartConnected
                storeId="myGraph"
                legendVisible={true}
                legendHorizontalAlignment="start"
                legendVerticalPosition="bottom"
                series={LINEAR_CHART_SERIES_CONFIG}
            ></LinearChartConnected>
        </div>
    );
}

const forwardedLinearChartConnectedItemsDemo = React.forwardRef(LinearChartConnectedItemsDemo);

const recordset = new RecordSet({
    rawData: LINEAR_CHART_DATA,
    keyProperty: 'id',
});

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
// @ts-ignore
forwardedLinearChartConnectedItemsDemo.getLoadConfig = function () {
    return {
        myGraph: {
            dataFactoryName: 'Controls-Graphs/data:Factory',
            dataFactoryArguments: {
                source: new Memory({
                    keyProperty: 'id',
                    data: LINEAR_CHART_DATA,
                }),
            },
        },
    };
};
export default forwardedLinearChartConnectedItemsDemo;
