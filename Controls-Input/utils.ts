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
    s: {
        fontSize: 'm',
        inlineHeight: 'm',
    },
    m: {
        fontSize: 'l',
        inlineHeight: 'l',
    },
    l: {
        fontSize: 'xl',
        inlineHeight: 'xl',
    },
};

interface ISizeProps {
    className?: string;
}

export function getSizeProps(props: ISizeProps = {}): ISizeValue {
    if (props.className) {
        // В полях ввода нет локальных css переменных, поэтому пока что парсим размеры самостоятельно
        const size = props.className.match(/controls-input_size-(\w)/)?.[1] || 's';
        return (
            VALUE_TO_OBJECT[size]
        );
    }
    return VALUE_TO_OBJECT['s'];
}
