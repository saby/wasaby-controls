import { Button as WSButton } from 'Controls/buttons';
import { useAction } from 'Controls-Actions/useAction';
import { IActionOptions } from 'Controls-Input/interface';
import { useMemo, useRef } from 'react';
import * as rk from 'i18n!Controls-Input';
import { KeyHook } from 'UICore/HotKeys';
import { IControlProps } from 'Controls/interface';
import { IButtonStyle } from './interface';

/**
 * Интерфейс для настройки иконки
 * @public
 */
export interface IIcon {
    /**
     * Путь до иконки
     */
    uri?: string;
    /**
     * Расположение иконки относительно текста
     */
    captionPosition?: 'start' | 'end';
}

/**
 * Интерфейс для стилевого оформления кнопки, работающей со слайсом формы
 * @public
 */
export interface IButtonProps {
    /**
     * Определяет текст заголовка контрола
     */
    caption?: string;
    tooltip?: string;
    /**
     * Определяет выбранное действие
     */
    action?: IActionOptions;
    /**
     * Определяет настройку для иконки
     */
    icon?: IIcon;
}

interface IProvider {
    execute: (
        action: IActionOptions | unknown,
        container: HTMLElement | undefined,
        target: HTMLElement | undefined,
        context: unknown
    ) => Promise<void>;
}

interface IStyle {
    '.style': {
        reference: string;
    };
}

/**
 * Виджет "Кнопка", который предоставляет пользователю возможность запуска действия из контекста при нажатии на него.
 * @class Controls-Input/_buttonConnected/Button
 * @implements Controls-Input/buttonConnected:IButtonProps
 * @demo Controls-Input-demo/ButtonConnected/Index
 * @public
 */
function Button(props: IButtonProps & IControlProps & IButtonStyle & IStyle) {
    const buttonRef = useRef<HTMLElement>();
    const style = useMemo(() => {
        return {
            ...props.style,
            lineHeight: 'normal',
        };
    }, [props.style]);
    const { executeAction } = useAction(props.action, buttonRef );
    const { caption = rk('Кнопка'), icon = {} } = props;

    const styleProps = useMemo(() => {
        if (props.className?.includes?.('controls-button')) {
            return {
                viewMode: 'empty',
                inlineHeight: 'empty',
                iconStyle: 'empty',
                fontSize: 'empty',
                iconSize: 'empty',
            };
        }
        // В кнопке виджете по умолчанию иконка должна быть меньше, иначе при смене стиля кнопки получаем скачки
        // https://online.sbis.ru/opendoc.html?guid=3589691d-84f1-4e0d-949c-c871a811cbf4&client=3
        return {
            iconSize: props.iconSize || 's',
        };
    }, [props.className]);

    const defaultActions = useMemo(() => {
        return [
            {
                keyCode: props.action?.hotKey?.keyCode,
            },
        ];
    }, [props.action?.hotKey?.keyCode]);
    const buttonProps = {
        ...props,
        ...styleProps,
        style,
        className: `controls-max-w-full${props.className ? ` ${props.className}` : ''}${
            props['.style']?.reference ? ` ${props['.style'].reference}` : ''
        }`,
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
