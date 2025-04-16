import { render } from 'react-dom';
import Tooltip from '../templates/Tooltip';
import { createRef } from 'react';
import ILinearChartTooltipProps from '../interfaces/ILinearChartTooltipProps';

export interface ITooltipFormatterProps {
    x: number;
    points: {
        y: number;
        colorIndex: number;
        series: {
            name: string;
        };
    }[];
}

export const tooltipFormatter = (props: ITooltipFormatterProps): string => {
    const tooltipProps: ILinearChartTooltipProps = {
        title: String(props.x),
        points: props.points.map((item) => ({
            value: item.y,
            colorIndex: item.colorIndex,
            caption: item?.series?.name,
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
