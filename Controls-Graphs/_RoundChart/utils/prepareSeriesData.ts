import { ISingleItem, IValueProperty, IValueFormatter, ISeries } from 'Controls-Graphs/base';
import { UNIQ_ROUND_CHART_ID, BASE_DONUT_INNER_SIZE } from '../constants';
import { TRoundChartType } from '../interfaces/IRoundChartProps';
import { getColorIndex } from './getColorIndex';

export const prepareSeriesData = (
    data: ISingleItem[],
    valueProperty: IValueProperty['valueProperty'],
    type: TRoundChartType,
    valueFormatter?: IValueFormatter['valueFormatter'],
    series?: ISeries['series']
) => {
    return !!series?.length
        ? series.map((seriesItem, seriesIndex) => {
              return {
                  id: UNIQ_ROUND_CHART_ID,
                  name: 'RoundChart',
                  innerSize: type === 'donut' ? BASE_DONUT_INNER_SIZE : 0,
                  data: !!data?.length
                      ? data.map((dataItem, index) => {
                            if (valueFormatter) {
                                return valueFormatter(dataItem, index);
                            }
                            return {
                                y: dataItem[seriesItem.valueProperty || valueProperty],
                                colorIndex: getColorIndex(
                                    dataItem.colorIndex || dataItem[seriesItem.colorProperty],
                                    index + 1,
                                    false
                                ),
                                name: dataItem[seriesItem.displayProperty],
                                id: dataItem.id,
                            };
                        })
                      : [],
              };
          })
        : [];
};
