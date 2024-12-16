import { Button } from 'Controls/dropdown';
import { IActionOptions } from 'Controls-Input/interface';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { DataContext } from 'Controls-DataEnv/context';
import { useContext, useMemo, useRef, useCallback } from 'react';
import { Logger } from 'UI/Utils';
import type { IActionConfig } from 'Controls-Actions/actions';
import * as rk from 'i18n!Controls-Input';
import { Bus as EventBus } from 'Env/Event';
import ActionsSource from './Button/ActionsSource';

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

export const clickHandler = (
    action: IActionOptions,
    container: HTMLElement,
    context: unknown
): Promise<void> => {
    const actions: IActionConfig[] = ModulesLoader.loadSync('Controls-Actions/actions');
    const actionConfig: IActionConfig = actions.find(({ type }) => {
        return action.id === type;
    }) as IActionConfig;
    if (action.id && actionConfig) {
        return getProvider(actionConfig.commandName).then((provider) => {
            EventBus.channel('buttonConnected').notify('execute', actionConfig, context);
            return provider.execute(
                { ...actionConfig.commandOptions, ...action.actionProps },
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
 * @class Controls-Input/_dropdownConnected/Button
 * @implements Controls-Input/dropdownConnected:IButtonProps
 * @demo Controls-Input-demo/DropdownConnected/Button/Index
 * @public
 */
function DropdownButtonConnected(props: IButtonProps) {
    const buttonRef = useRef();
    const context = useContext(DataContext);
    const style = useMemo(() => {
        return {
            ...props.style,
            lineHeight: 'normal',
        };
    }, [props.style]);

    const source = useMemo(() => {
        return new ActionsSource({
            keyProperty: 'id',
            data: props.variants?.items || [],
        });
    }, [props.variants]);

    const onMenuItemActivate = useCallback(
        async (item) => {
            await clickHandler(item.get('action'), buttonRef.current, context);
        },
        [buttonRef.current, context]
    );

    const { caption = rk('Создать задачу'), icon = {} } = props;
    return (
        <Button
            ref={buttonRef}
            {...props}
            style={style}
            className={`controls-max-w-full${props.className ? ` ${props.className}` : ''}`}
            caption={caption}
            icon={icon.uri}
            captionPosition={icon.captionPosition}
            source={source}
            sourceProperty="actionSubMenu"
            onMenuItemActivate={onMenuItemActivate}
            parentProperty="parent"
            nodeProperty="node"
        />
    );
}

DropdownButtonConnected.displayName = 'Controls-Input/dropdownConnected:Button';
export default DropdownButtonConnected;
