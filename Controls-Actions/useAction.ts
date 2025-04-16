import { RefObject, useCallback, useContext, useEffect } from 'react';
import { detection } from 'Env/Env';
import { Bus as EventBus } from 'Env/Event';
import { RecordSet } from 'Types/collection';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import { ActionStarter } from 'UI/Actions';
import { DataContext } from 'Controls-DataEnv/context';
import { Slice } from 'Controls-DataEnv/slice';
import { IActionOptions } from 'Controls-Input/interface';
import { default as actions, IActionConfig } from 'Controls-Actions/actions';
import { Feature } from 'Feature/feature';
import { Confirmation } from 'Controls/popup';
import { Permission } from 'Permission/access';
import * as rk from 'i18n!Controls-Actions';

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
        return getProvider(actionConfig.commandName as string)
            .then((provider: IProvider) => {
                EventBus.channel('buttonConnected').notify('execute', actionConfig, context);
                return provider.execute(
                    action.actionProps || actionConfig.commandOptions,
                    container,
                    container,
                    context
                );
            })
            .catch(() => {
                Confirmation.openPopup({
                    markerStyle: 'danger',
                    message: rk('Произошла ошибка при выполнении действия'),
                    type: 'ok',
                });
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
function useAction(
    action: IActionOptions | undefined,
    containerRef: RefObject<HTMLElement>
): { executeAction: () => Promise<void> } {
    const [isFeatureEnabled] = Feature.get(['new-actions']);
    // запуск действия прикладного объекта посредством UI/Actions - нового функционала по работе с действиями
    if (isFeatureEnabled) {
        const executeAction = useCallback(async () => {
            if (!action) {
                return;
            }
            const actionStarter = new ActionStarter(action);
            return actionStarter.start();
        }, [action]);

        return { executeAction };
    }

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
        let isRights = true;
        if (actionConfig.rights?.length) {
            Permission.get(actionConfig.rights.map((right) => right.zone ?? right)).every(
                (zone, index) => {
                    const rightInfo = actionConfig.rights[index];
                    let restriction;
                    let requiredLevel;

                    if (typeof rightInfo === 'object') {
                        restriction = rightInfo?.restriction;
                        requiredLevel = rightInfo?.requiredLevel;
                    }
                    if (restriction) {
                        isRights = zone.isModify() && zone.getRestriction(restriction).isRead();
                    } else if (requiredLevel === 'read') {
                        isRights = zone.isRead() || zone.getRestriction(restriction).isRead();
                    } else {
                        isRights = zone.isModify();
                    }
                }
            );
        }
        if (isRights) {
            return onClick(action, actionConfig, containerRef?.current, context);
        } else {
            Confirmation.openPopup({
                markerStyle: 'danger',
                message: rk('Произошла ошибка при выполнении действия'),
                type: 'ok',
            });
        }
    }, [action]);

    return { executeAction };
}

export { useAction };
