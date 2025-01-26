import { RefObject, useCallback, useContext, useEffect } from 'react';
import { detection } from 'Env/Env';
import { Bus as EventBus } from 'Env/Event';
import { RecordSet } from 'Types/collection';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import { DataContext } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import { IActionOptions } from 'Controls-Input/interface';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';

const ACTIONS_SLICE_NAME = 'Actions';

interface IProvider {
    execute: (
        action: IActionOptions | unknown,
        container: HTMLElement | null,
        target: HTMLElement | null,
        context: unknown
    ) => Promise<void>;
}

const getProvider = (commandName: string): Promise<IProvider> => {
    return ModulesLoader.loadAsync(commandName).then((provider) => {
        return new provider();
    });
};

const onClick = (
    action: IActionOptions | undefined,
    actionConfig: IActionConfig,
    container: HTMLElement | null,
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

/**
 * Хук, позволяющий выполнить действие, которое настроил пользователь.
 * @example
 * <pre class="brush: js">
 * import { useAction } from 'Controls-Actions/useAction';
 * function MyComponent(props) {
 *     const containerRef = useRef();
 *     const { clickHandler } = useAction(props.action, containerRef)
 *
 *     return <div onClick={clickHandler} ref={containerRef}>Test</div>
 * }
 * </pre>
 * @public
 */
function useAction(action: IActionOptions | undefined, containerRef: RefObject<HTMLElement> ): { executeAction: () => Promise<void> } {
    const context = useContext(DataContext);
    const actionSlice = context?.[ACTIONS_SLICE_NAME] as Slice<{ items: RecordSet<IActionConfig> }>;
    let actionConfig: IActionConfig;
    if (actionSlice) {
        actionConfig = actionSlice?.state?.items?.getRecordById(
            action?.id as string
        ) as unknown as IActionConfig;
    } else {
        actionConfig = actions.find((curAction) => {
            return action?.id === curAction.type;
        }) as IActionConfig;
    }

    useEffect(() => {
        // В сафари есть проблема с открытием ссылок. Переход по ссылке не будет осуществлен, если что-то подгружается.
        // Поэтому сами заранее подгружаем действия
        if (detection.isMobileSafari && action && actionConfig) {
            getProvider(actionConfig.commandName as string);
        }
    }, []);

    const executeAction = useCallback(async () => {
        if (!action) {
            return;
        }
        return onClick(action, actionConfig, containerRef?.current, context);
    }, [action]);

    return { executeAction };
}

export { useAction };
