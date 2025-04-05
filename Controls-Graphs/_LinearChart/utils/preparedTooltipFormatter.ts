import { tooltipFormatter, ITooltipFormatterProps } from './tooltipFormatter';

export const prepareTooltipFormatter = () => {
    return {
        tooltip: {
            formatter(): string | boolean {
                return tooltipFormatter(this as unknown as ITooltipFormatterProps);
            },
        },
    };
};
