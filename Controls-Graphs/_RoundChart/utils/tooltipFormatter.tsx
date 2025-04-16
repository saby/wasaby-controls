import { render } from 'react-dom';
import { createRef } from 'react';
import { number as formatNumber } from 'Types/formatter';
import Tooltip from '../templates/Tooltip';
import IRoundChartTooltipFormatterContext from '../interfaces/IRoundChartTooltipFormatterContext';
import 'css!Controls-Graphs/RoundChart';

export const tooltipFormatter = (formatterContext: IRoundChartTooltipFormatterContext): string => {
    const tooltipProps = {
        name: formatterContext.key,
        colorIndex: formatterContext.colorIndex,
        value: formatNumber(formatterContext.y, { useGrouping: true }),
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
