import ILinearChartTooltipFormatterProps from '../interfaces/ILinearChartTooltipFormatterProps';
import { render } from 'react-dom';
import Tooltip from '../templates/Tooltip';
import { createRef } from 'react';
import ILinearChartTooltipProps from '../interfaces/ILinearChartTooltipProps';

export const tooltipFormatter = (props: ILinearChartTooltipFormatterProps): string => {
    const tooltipProps: ILinearChartTooltipProps = {
        title: String(props.x),
        points: props.points.map((item) => ({
            value: item.y,
            colorIndex: item.colorIndex,
            caption: item.series.name,
        })),
    };
    const container = document.createElement('div');
    document.body.append(container);
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '-10000px';
    const ref = createRef<HTMLDivElement>();
    render(
        <div ref={ref}>
            <Tooltip {...tooltipProps} />
        </div>,
        container
    );
    const html = ref.current?.innerHTML || '';
    container.remove();
    return html;
};
