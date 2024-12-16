import { Button as WSButton } from 'Controls/buttons';
import { IActionOptions } from 'Controls-Input/interface';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { DataContext } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import { useCallback, useContext, useMemo, useRef, useEffect } from 'react';
import { Logger } from 'UI/Utils';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import * as rk from 'i18n!Controls-Input';
import { Bus as EventBus } from 'Env/Event';
import { KeyHook } from 'UICore/HotKeys';
import { IControlProps } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { IButtonStyle } from './interface';
import { detection } from 'Env/Env';

const ACTIONS_SLICE_NAME = 'Actions';

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

const getProvider = (commandName: string): Promise<IProvider> => {
    return ModulesLoader.loadAsync(commandName).then((provider) => {
        return new provider();
    });
};

const clickHandler = (
    action: IActionOptions | undefined,
    actionConfig: IActionConfig,
    container: HTMLElement | undefined,
    context: unknown
): Promise<void> | void => {
    if (action && actionConfig) {
        return getProvider(actionConfig.commandName as string).then((provider: IProvider) => {
            EventBus.channel('buttonConnected').notify('execute', actionConfig, context);
            return provider.execute(
                action.actionProps || actionConfig.commandOptions,
                container,
                container,
                context
            );
        });
    } else {
        Logger.warn('Controls-Input/buttonConnected:Button: не найден контекст действий');
    }
};

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
    const context = useContext(DataContext);
    const actionSlice = context?.[ACTIONS_SLICE_NAME] as Slice<{ items: RecordSet<IActionConfig> }>;
    const style = useMemo(() => {
        return {
            ...props.style,
            lineHeight: 'normal',
        };
    }, [props.style]);
    let actionConfig: IActionConfig;
    if (actionSlice) {
        actionConfig = actionSlice?.state?.items?.getRecordById(
            props.action?.id as string
        ) as unknown as IActionConfig;
    } else {
        actionConfig = actions.find((action) => {
            return props.action?.id === action.type;
        }) as IActionConfig;
    }
    const { caption = rk('Кнопка'), icon = {} } = props;

    useEffect(() => {
        // В сафари есть проблема с открытием ссылок. Переход по ссылке не будет осуществлен, если что-то подгружается.
        // Поэтому сами заранее подгружаем действия
        if (detection.isMobileSafari && props.action && actionConfig) {
            getProvider(actionConfig.commandName as string);
        }
    }, []);

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
            await clickHandler(props.action, actionConfig, buttonRef.current, context);
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
                await clickHandler(props.action, actionConfig, buttonRef.current, context);
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
