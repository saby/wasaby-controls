import { Button as WSButton } from 'Controls/buttons';
import { IActionOptions } from 'Controls-Input/interface';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { DataContext } from 'Controls-DataEnv/context';
import { useContext, useMemo, useRef } from 'react';
import { Logger } from 'UI/Utils';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import * as rk from 'i18n!Controls-Input';
import { Bus as EventBus } from 'Env/Event';

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
    caption: string;
    /**
     * Определяет выбранное действие
     */
    action: IActionOptions;
    /**
     * Определяет настройку для иконки
     */
    icon?: IIcon;
}

const getProvider = (commandName: string): Promise<unknown> => {
    return ModulesLoader.loadAsync(commandName).then((provider) => {
        return new provider();
    });
};

const clickHandler = (
    action: IActionOptions,
    actionConfig: IActionConfig,
    container: HTMLElement,
    context: unknown
): Promise<void> => {
    if (action && actionConfig) {
        return getProvider(actionConfig.commandName).then((provider) => {
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

/**
 * Виджет "Кнопка", который предоставляет пользователю возможность запуска действия из контекста при нажатии на него.
 * @class Controls-Input/_buttonConnected/Button
 * @implements Controls-Input/buttonConnected:IButtonProps
 * @demo Controls-Input-demo/ButtonConnected/Index
 * @public
 */
function Button(props: IButtonProps) {
    const buttonRef = useRef();
    const context = useContext(DataContext);
    const actionSlice = context?.[ACTIONS_SLICE_NAME];
    const style = useMemo(() => {
        return {
            ...props.style,
            lineHeight: 'normal',
        };
    }, [props.style]);
    let actionConfig: IActionConfig;
    if (actionSlice) {
        actionConfig = actionSlice?.state?.items?.getRecordById(props.action?.id);
    } else {
        actionConfig = actions.find((action) => {
            return props.action?.id === action.type;
        }) as IActionConfig;
    }
    const { caption = rk('Название'), icon = {} } = props;
    return (
        <WSButton
            ref={buttonRef}
            {...props}
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
        />
    );
}

Button.displayName = 'Controls-Input/buttonConnected:Button';
export { Button };
