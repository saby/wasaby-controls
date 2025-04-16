export type TItemCfg = {
    label: string;
    labelFontSize?: string;
};

export const getDataLabelsConfig = ({ label, labelFontSize }: TItemCfg, type: string): object => {
    if (label && type === 'pie') {
        return {
            enabled: true,
            format: '<span>{point.label}</span>',
            distance: '-40%',
            style: {
                color: 'var(--text-color)',
                fontSize: `var(--font-size_${labelFontSize || 'xs'})`,
                fontWeight: 'normal',
                textOutline: 'none',
            },
        };
    }
    return {
        enabled: false,
    };
};
