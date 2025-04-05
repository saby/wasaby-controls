import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { default as ColumnChartConnected } from 'Controls-Graphs/ColumnChartConnected';
import { Memory } from 'Types/source';
import {
    COLUMN_CHART_DATA,
    COLUMN_CHART_SERIES_CONFIG,
} from 'Controls-Graphs-demo/ColumnChartConnected/resources/data';

function ColumnChartConnectedItemsDemo(_, ref) {
    return (
        <div ref={ref} className="controls-Graphs-demo__ColumnChart">
            <ColumnChartConnected
                storeId="myGraph"
                legendVisible={true}
                legendHorizontalAlignment="start"
                legendVerticalPosition="bottom"
                series={COLUMN_CHART_SERIES_CONFIG}
            ></ColumnChartConnected>
        </div>
    );
}

const forwardedColumnChartConnectedItemsDemo = React.forwardRef(ColumnChartConnectedItemsDemo);

const recordset = new RecordSet({
    rawData: COLUMN_CHART_DATA,
    keyProperty: 'id',
});

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
// @ts-ignore
forwardedColumnChartConnectedItemsDemo.getLoadConfig = function () {
    return {
        myGraph: {
            dataFactoryName: 'Controls-Graphs/data:Factory',
            dataFactoryArguments: {
                source: new Memory({
                    keyProperty: 'id',
                    data: COLUMN_CHART_DATA,
                }),
                items: recordset,
            },
        },
    };
};
export default forwardedColumnChartConnectedItemsDemo;
