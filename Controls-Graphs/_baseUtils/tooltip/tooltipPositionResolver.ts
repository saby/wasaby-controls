import { IChartContext, ITooltipPoint } from 'Controls-Graphs/base';

export default function (
    chart: IChartContext,
    pointWidth: number,
    pointHeight: number,
    point: ITooltipPoint,
    yStablePosition?: boolean
): object {
    const { plotTop, plotLeft, plotHeight, plotWidth }: IChartContext = chart;
    const chartBottom = plotHeight + plotTop;
    const chartRight = plotWidth + plotLeft;
    const bottomOffset = 25;
    const offset = 10;
    const offsetMultiplier = 2;
    let y = point.plotY < bottomOffset ? bottomOffset : point.plotY;
    let x = point.plotX + plotLeft + offset;
    const isLeftExcess = x - pointWidth < plotLeft;
    const isRightExcess = x + pointWidth > chartRight;
    if (y + pointHeight > chartBottom) {
        y = chartBottom - pointHeight;
    }
    const topOffset = 14;
    if (y < topOffset) {
        y = topOffset;
    }
    if (yStablePosition) {
        y = plotHeight - pointHeight;
    }
    if (isRightExcess) {
        x = x - pointWidth - offset * offsetMultiplier;
    }
    if (isLeftExcess && isRightExcess) {
        x = plotLeft;
    }
    return { x, y };
}
