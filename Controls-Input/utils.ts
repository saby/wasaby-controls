import { IComponentProps, TFontColorStyle } from 'Controls/interface';
import { IInputStyle } from './inputConnected';
import * as translate from 'i18n!Controls-Input';

interface ISizeValue {
    fontSize: string;
    inlineHeight: string;
}

const SIZE_VALUE_MAP: Record<number | string, ISizeValue> = {
    12: { fontSize: 'xs', inlineHeight: 'xs' },
    13: { fontSize: 's', inlineHeight: 's' },
    14: { fontSize: 'm', inlineHeight: 'm' },
    15: { fontSize: 'l', inlineHeight: 'l' },
    16: { fontSize: 'xl', inlineHeight: 'xl' },
    17: { fontSize: '2xl', inlineHeight: '2xl' },
    18: { fontSize: '3xl', inlineHeight: '2xl' },
    19: { fontSize: '4xl', inlineHeight: '2xl' },
    20: { fontSize: '4xl', inlineHeight: '2xl' },
    s: { fontSize: 'm', inlineHeight: 'm' },
    m: { fontSize: 'l', inlineHeight: 'l' },
    l: { fontSize: 'xl', inlineHeight: 'xl' },
};

interface IParsedProps extends ISizeValue {
    contrastBackground?: boolean;
    fontColorStyle?: TFontColorStyle;
}

export function getStyleProps(props: IComponentProps = {}): IParsedProps {
    const { size, contrastBackground, fontColorStyle } = parseClassNameForStyleProps(
        props.className
    );

    const mappedSize = SIZE_VALUE_MAP[size];

    return {
        fontSize: mappedSize.fontSize,
        inlineHeight: mappedSize.inlineHeight,
        contrastBackground,
        fontColorStyle,
    };
}

export function parseClassNameForStyleProps(className: string | undefined): IInputStyle {
    const parsed: IInputStyle = {
        size: 's',
        contrastBackground: false,
        fontColorStyle: 'default',
    };

    if (!className) {
        return parsed;
    }

    const regex =
        /\bcontrols-input_size-(\w+)\b|\bcontrols-input_color-(\w+)\b|\bcontrols-input_filled\b/g;

    for (const match of className.matchAll(regex)) {
        if (match[1]) {
            parsed.size = match[1];
        } else if (match[2]) {
            parsed.fontColorStyle = match[2];
        } else if (match[0] === 'controls-input_filled') {
            parsed.contrastBackground = true;
        }
    }

    return parsed;
}

export const getDefaultPlaceholder = () => translate('Подсказка');
