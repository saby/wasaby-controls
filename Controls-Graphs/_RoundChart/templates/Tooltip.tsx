import { forwardRef, LegacyRef } from 'react';
import 'css!Controls-Graphs/RoundChart';
import { useTheme } from 'UICore/Contexts';
import { IColorIndex } from 'Controls-Graphs/base';

interface IRoundChartTooltipProps extends IColorIndex {
    name: string;
    value: string;
}

export default forwardRef(function Tooltip(
    props: IRoundChartTooltipProps,
    ref: LegacyRef<HTMLDivElement>
) {
    const { name, value, colorIndex } = props;
    const theme = useTheme();
    return (
        <div
            ref={ref}
            className={`controls_Graphs_theme-${theme} controls-Graphs_RoundChart_tooltip controls-Graphs_RoundChart_tooltip_background highcharts-color-${colorIndex}`}
        >
            <div className="controls-Graphs_RoundChart_tooltip_header">
                <div
                    className={`controls-Graphs_RoundChart_tooltip_point highcharts-color-${colorIndex}`}
                />
                <div className="controls-Graphs_RoundChart_tooltip_caption">{name}</div>
            </div>
            <div className="controls-fontweight-default controls-Graphs_RoundChart_tooltip_value">
                {value}
            </div>
        </div>
    );
});
