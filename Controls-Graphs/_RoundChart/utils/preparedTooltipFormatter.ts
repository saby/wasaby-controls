import { tooltipFormatter } from './tooltipFormatter';

export const preparedTooltipFormatter = () => {
    return {
        tooltip: {
            formatter(): string {
                return tooltipFormatter(this);
            },
        },
    };
};
