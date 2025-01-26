export default interface ILinearChartTooltipProps {
    title: string;
    points: {
        caption: string;
        colorIndex: number;
        value: number;
    }[];
}
