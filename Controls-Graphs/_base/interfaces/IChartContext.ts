import IChartAxis from './IChartAxis';

export default interface IChartContext {
    value: number;
    chart: object;
    axis: IChartAxis;
    len: number;
    yAxis: [
        {
            tickPositions: number[];
            setTitle: Function;
        },
    ];
    plotTop: number;
    plotLeft: number;
    plotHeight: number;
    plotWidth: number;
    x?: number;
    y?: number;
    points?: { y?: number; series?: { name: string }; colorIndex?: string }[];

    reflow(): Function;

    update(config: object): Function;

    destroy(): Function;
}
