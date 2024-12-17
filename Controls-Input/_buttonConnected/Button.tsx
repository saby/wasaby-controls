import { Button as WSButton } from 'Controls/buttons';
import { IActionOptions } from 'Controls-Input/interface';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { DataContext } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { Logger } from 'UI/Utils';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import * as rk from 'i18n!Controls-Input';
import { Bus as EventBus } from 'Env/Event';
import { KeyHook } from 'UICore/HotKeys';
import { IControlProps } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { IButtonStyle, parseStyleInClassName } from './Utils';

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
    return ModulesLoader.loadAsync(commandName)
        .then((provider) => {
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
            EventBus.channel('buttonConnected').notify(
                'execute',
                actionConfig,
                context
            );
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
    }
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
        actionConfig = actionSlice?.state?.items?.getRecordById(props.action?.id as string) as unknown as IActionConfig;
    } else {
        actionConfig = actions.find((action) => {
            return props.action?.id === action.type;
        }) as IActionConfig;
    }
    const {caption = rk('Название'), icon = {}} = props;

    // todo Удалить когда кнопки будут поправлены. Все эти стили должны закладываться за счет css классов
    // https://online.sbis.ru/opendoc.html?guid=e216703f-5fa7-4a1d-9d7a-b0139b16df6e&client=3
    const styleProps = useMemo(() => {
        const defaultStyle = {
            viewMode: props.viewMode || 'outlined',
            buttonStyle: props.buttonStyle || 'primary',
            inlineHeight: props.inlineHeight || 'm',
            iconSize: props.iconSize || 's',
            iconStyle: props.iconStyle || 'default',
        };
        if (props['.style']?.reference) {
            return parseStyleInClassName(props['.style'].reference, defaultStyle);
        }
        return defaultStyle;
    }, [props['.style'], props.viewMode, props.buttonStyle, props.inlineHeight]);

    const defaultActions = useMemo(() => {
        return [
            {
                keyCode: props.action?.actionProps?.hotkey as number
            }
        ];
    }, [props.action?.actionProps?.hotkey]);

    const Content = useCallback(() => {
        return (
            <WSButton
                ref={buttonRef}
                {...props}
                {...styleProps}
                style={style}
                className={`controls-max-w-full${props.className ? ` ${props.className}` : ''}`}
                caption={caption}
                icon={icon.uri}
                captionPosition={icon.captionPosition}
                onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await clickHandler(props.action, actionConfig, buttonRef.current, context);
                }}
                onKeyDown={async (e) => {
                    const hotKeys = defaultActions.map((e) => {
                        return e.keyCode;
                    });
                    if (hotKeys.includes(e.nativeEvent.keyCode)) {
                        e.preventDefault();
                        e.stopPropagation();
                        await clickHandler(props.action, actionConfig, buttonRef.current, context);
                    }
                }}
            />
        );
    }, [props, style, caption, icon, actionConfig, context]);

    if (props.action?.actionProps?.hotkey) {
        return <KeyHook defaultActions={defaultActions} context="global">
            <Content/>
        </KeyHook>;
    }

    return <Content/>;
}

Button.displayName = 'Controls-Input/buttonConnected:Button';
export { Button };
