interface ISizeValue {
    fontSize: string;
    inlineHeight: string;
}

const VALUE_TO_OBJECT: Record<number | string, ISizeValue> = {
    12: {
        fontSize: 'xs',
        inlineHeight: 'xs',
    },
    13: {
        fontSize: 's',
        inlineHeight: 's',
    },
    14: {
        fontSize: 'm',
        inlineHeight: 'm',
    },
    15: {
        fontSize: 'l',
        inlineHeight: 'l',
    },
    16: {
        fontSize: 'xl',
        inlineHeight: 'xl',
    },
    17: {
        fontSize: '2xl',
        inlineHeight: '2xl',
    },
    18: {
        fontSize: '3xl',
        inlineHeight: '2xl',
    },
    19: {
        fontSize: '4xl',
        inlineHeight: '2xl',
    },
    20: {
        fontSize: '4xl',
        inlineHeight: '2xl',
    },
    'controls-input_size-s': {
        fontSize: 'm',
        inlineHeight: 'm',
    },
    'controls-input_size-m': {
        fontSize: 'l',
        inlineHeight: 'l',
    },
    'controls-input_size-l': {
        fontSize: 'xl',
        inlineHeight: 'xl',
    },
};

interface ISizeProps {
    '.style': {
        reference?: string;
        'font-size_input_local'?: number;
    };

    [name: string]: unknown;
}

export function getSizeProps(props: ISizeProps = {}): ISizeValue {
    if (props['.style']) {
        const size = props['.style'];
        return (
            VALUE_TO_OBJECT[(size['font-size_input_local'] || size.reference) as string | number] ||
            VALUE_TO_OBJECT['controls-input_size-s']
        );
    }
    return VALUE_TO_OBJECT['controls-input_size-s'];
}
