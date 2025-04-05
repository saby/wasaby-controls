import { ISingleItem, IValueFormatter, ISeries } from 'Controls-Graphs/base';
import { UNIQ_ROUND_CHART_ID, BASE_DONUT_INNER_SIZE } from '../constants';
import { TRoundChartType } from '../interfaces/IRoundChartProps';
import { getColorIndex } from './getColorIndex';
import { getDataLabelsConfig } from './getDataLabelsConfig';

export const prepareSeriesData = (
    data: ISingleItem[],
    type: TRoundChartType,
    valueFormatter?: IValueFormatter['valueFormatter'],
    series?: ISeries['series']
) => {
    return !!series?.length
        ? series.map((seriesItem) => {
              return {
                  id: UNIQ_ROUND_CHART_ID,
                  name: 'RoundChart',
                  innerSize: type === 'donut' ? BASE_DONUT_INNER_SIZE : 0,
                  data: !!data?.length
                      ? data.map((dataItem, index) => {
                            if (valueFormatter) {
                                return valueFormatter(dataItem, { index });
                            }
                            return {
                                y: dataItem[seriesItem.valueProperty],
                                colorIndex: getColorIndex(
                                    typeof dataItem.colorIndex === 'number'
                                        ? dataItem.colorIndex
                                        : dataItem[seriesItem.colorProperty as string],
                                    index + 1,
                                    false
                                ),
                                name: dataItem[seriesItem.displayProperty as string],
                                id: dataItem.id,
                                label: dataItem[seriesItem.labelProperty as string],
                                dataLabels: getDataLabelsConfig(
                                    {
                                        label: (dataItem[seriesItem.labelProperty as string] ||
                                            '') as string,
                                    },
                                    type
                                ),
                            };
                        })
                      : [],
              };
          })
        : [];
};
