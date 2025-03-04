import { tooltipFormatter } from './tooltipFormatter';

export const prepareTooltipFormatter = () => {
    return {
        tooltip: {
            formatter(): string | boolean {
                return tooltipFormatter(this);
            },
        },
    };
};
