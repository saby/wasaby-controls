import { useMemo } from 'react';
import { clsx } from 'clsx';
import { IBasicButtonProps } from 'Controls/buttons';
import { IComponentProps } from 'Controls/interface';
import { IStyle, IButtonStyle } from './interface';

export function useConnectedButtonProps(
    props: IStyle & IComponentProps & IButtonStyle
): Partial<IBasicButtonProps> {
    const classNameFromProps = props.className;
    const reference = props['.style']?.reference;
    const iconSize = props.iconSize || 's';
    const buttonProps: Partial<IBasicButtonProps> = useMemo(() => {
        const className = clsx(classNameFromProps, reference);
        if (classNameFromProps?.includes?.('controls-button')) {
            return {
                viewMode: 'empty',
                inlineHeight: 'empty',
                iconStyle: 'empty',
                fontSize: 'empty',
                iconSize: 'empty',
                className,
            };
        }
        return {
            iconSize,
            className,
        };
    }, [classNameFromProps, reference, iconSize]);
    return buttonProps;
}
