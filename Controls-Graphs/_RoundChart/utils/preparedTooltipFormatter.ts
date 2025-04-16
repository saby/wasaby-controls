import { tooltipFormatter } from './tooltipFormatter';
import FormatterProps from '../interfaces/IRoundChartTooltipFormatterContext';

export const preparedTooltipFormatter = () => {
    return {
        tooltip: {
            formatter(): string {
                return tooltipFormatter(this as unknown as FormatterProps);
            },
        },
    };
};
