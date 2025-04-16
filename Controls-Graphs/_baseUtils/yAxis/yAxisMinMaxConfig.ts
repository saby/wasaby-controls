import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

export const yAxisMinMaxConfig = (data: ISingleItem[] = [], series: ISingleSeriesItem[] = []) => {
    let hasNotZeroValue = false;
    series.forEach((serieItem) => {
        if (
            data.length &&
            data.findIndex(
                (dataItem) =>
                    typeof dataItem[serieItem.valueProperty] &&
                    dataItem[serieItem.valueProperty] !== 0
            ) !== -1
        ) {
            hasNotZeroValue = true;
        }
    });
    return hasNotZeroValue
        ? {}
        : {
              tickPositions: [0],
              min: 0,
              max: 0.5,
          };
};
