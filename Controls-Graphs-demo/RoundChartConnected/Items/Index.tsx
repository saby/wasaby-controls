import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { default as RoundChartConnected } from 'Controls-Graphs/RoundChartConnected';
import { Memory } from 'Types/source';
import {
    ROUND_CHART_DATA,
    ROUND_CHART_SERIES_CONFIG,
} from 'Controls-Graphs-demo/RoundChartConnected/resources/data';
import 'css!Controls-Graphs-demo/RoundChart/resources/Style';

function RoundChartConnectedItemsDemo(_, ref) {
    return (
        <div ref={ref} className="controls-Graphs-demo__RoundChart__width">
            <RoundChartConnected
                storeId="myGraph"
                legendVisible={true}
                legendHorizontalAlignment="start"
                legendVerticalPosition="bottom"
                series={ROUND_CHART_SERIES_CONFIG}
            ></RoundChartConnected>
        </div>
    );
}

const forwardedRoundChartConnectedItemsDemo = React.forwardRef(RoundChartConnectedItemsDemo);

const recordset = new RecordSet({
    rawData: ROUND_CHART_DATA,
    keyProperty: 'id',
});

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
// @ts-ignore
forwardedRoundChartConnectedItemsDemo.getLoadConfig = function () {
    return {
        myGraph: {
            dataFactoryName: 'Controls-Graphs/data:Factory',
            dataFactoryArguments: {
                source: new Memory({
                    keyProperty: 'id',
                    data: ROUND_CHART_DATA,
                }),
                items: recordset,
            },
        },
    };
};
export default forwardedRoundChartConnectedItemsDemo;
