import { ITooltipPoint, IChartContext } from 'Controls-Graphs/base';
import tooltipPositionResolver from './tooltipPositionResolver';

export const preparedTooltipPositionResolver = () => {
    return {
        tooltip: {
            positioner(pointWidth: number, pointHeight: number, point: ITooltipPoint): object {
                const chart = this.chart as unknown as IChartContext;
                return tooltipPositionResolver(chart, pointWidth, pointHeight, point);
            },
        },
    };
};
