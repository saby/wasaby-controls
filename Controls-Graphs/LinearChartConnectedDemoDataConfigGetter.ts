import { RecordSet } from 'Types/collection';

const getGraphData = () =>
    Array.from({ length: 50 }).map((_, idx) => ({
        id: idx + 1,
        x: idx,
        y: Math.abs(Math.sin(idx + 1)) * (idx % 2 === 0 ? 1 : -1),
    }));

export const dataFactory = {
    loadData: () =>
        new Promise((resolve) =>
            resolve(
                new RecordSet({
                    keyProperty: 'id',
                    rawData: getGraphData(),
                })
            )
        ),
};

function sourceConfigGetter(): object {
    return {
        items: {
            dataFactoryName: 'Controls-Graphs/LinearChartConnectedDemoDataConfigGetter:dataFactory',
            dataFactoryArguments: {},
        },
    };
}

export default sourceConfigGetter;
