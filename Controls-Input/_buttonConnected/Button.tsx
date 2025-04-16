import { Button as WSButton } from 'Controls/buttons';
import { useAction } from 'Controls-Actions/useAction';
import { IActionOptions } from 'Controls-Input/interface';
import { useMemo, useRef } from 'react';
import * as rk from 'i18n!Controls-Input';
import { KeyHook } from 'UICore/HotKeys';
import { IComponentProps } from 'Controls/interface';
import { IButtonStyle, IBaseButtonProps, IStyle } from './interface';
import { useConnectedButtonProps } from './useConnectedButtonProps';

/**
 * Интерфейс для стилевого оформления кнопки, работающей со слайсом формы
 * @public
 */
export interface IButtonProps extends IBaseButtonProps {
    action?: IActionOptions;
}

/**
 * Виджет "Кнопка", который предоставляет пользователю возможность запуска действия из контекста при нажатии на него.
 * @class Controls-Input/_buttonConnected/Button
 * @implements Controls-Input/buttonConnected:IButtonProps
 * @demo Controls-Input-demo/ButtonConnected/Index
 * @public
 */
function Button(props: IButtonProps & IComponentProps & IButtonStyle & IStyle) {
    const buttonRef = useRef<HTMLElement>();
    const style = useMemo(() => {
        return {
            ...props.style,
            lineHeight: 'normal',
            // Не нужно навешивать pointer-events когда указано действие, либо когда мы в редакторе
            pointerEvents:
                props.action || props.className?.includes('FrameEditor__supervisor')
                    ? undefined
                    : 'none',
        };
    }, [props.style, props.action]);

    const { executeAction } = useAction(props.action, buttonRef);
    const { caption = rk('Кнопка'), icon = {} } = props;

    const styleProps = useConnectedButtonProps(props);

    const defaultActions = useMemo(() => {
        return [
            {
                keyCode: props.action?.hotKey?.keyCode,
            },
        ];
    }, [props.action?.hotKey?.keyCode]);
    const buttonProps = useMemo(() => {
        return {
            ...props,
            ...styleProps,
            style,
            caption,
            icon: icon.uri,
            captionPosition: icon.captionPosition,
            onClick: async (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                await executeAction();
            },
            onKeyDown: async (e: KeyboardEvent) => {
                const hotKey = {
                    keyCode: props.action?.hotKey?.keyCode,
                    altKey: props.action?.hotKey?.altKey || false,
                    ctrlKey: props.action?.hotKey?.ctrlKey || false,
                    shiftKey: props.action?.hotKey?.shiftKey || false,
                };
                if (
                    hotKey.keyCode === e.nativeEvent.keyCode &&
                    hotKey.altKey === e.nativeEvent.altKey &&
                    hotKey.ctrlKey === e.nativeEvent.ctrlKey &&
                    hotKey.shiftKey === e.nativeEvent.shiftKey
                ) {
                    e.preventDefault();
                    e.stopPropagation();
                    await executeAction();
                }
            },
        };
    }, [props, styleProps, style, caption, icon.uri, icon.captionPosition, executeAction]);

    if (props.action?.hotKey?.keyCode) {
        return (
            <KeyHook defaultActions={defaultActions} context="global" ref={buttonRef}>
                <WSButton {...buttonProps} />
            </KeyHook>
        );
    }

    return <WSButton ref={buttonRef} {...buttonProps} />;
}

Button.displayName = 'Controls-Input/buttonConnected:Button';
export { Button };
