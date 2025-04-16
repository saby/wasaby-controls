import { LegacyRef, forwardRef } from 'react';
import 'css!Controls-Graphs/LinearChart';

interface ITooltipProps {
    title: string;
    points: {
        colorIndex: string;
        caption: string;
        value: string;
    }[];
}

export default forwardRef(function LinearChartTooltip(
    tooltipProps: ITooltipProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const { title, points } = tooltipProps;
    return (
        <div ref={ref} className="controls-Graphs-tooltip controls-padding-xs">
            <div className="tw-w-full controls-margin_bottom-2xs controls-fontweight-bold">
                {title}
            </div>
            {points.map((item) => {
                return (
                    <div
                        key={`controls-Graphs-tooltip-${item.colorIndex}`}
                        className="tw-flex tw-justify-between tw-items-center"
                    >
                        <div>
                            <div
                                className={`controls-margin_right-l highcharts-color-${item.colorIndex}`}
                            ></div>
                            <div className="controls-margin_right-l">{item.caption}:</div>
                        </div>
                        <div>{item.value}</div>
                    </div>
                );
            })}
        </div>
    );
});
