import { Button as WSButton, IButtonOptions } from 'Controls/buttons';
import { IActionOptions } from 'Controls-Buttons/interface';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { DataContext } from 'Controls-DataEnv/context';
import { useContext } from 'react';
import { Logger } from 'UI/Utils';

const ACTIONS_SLICE_NAME = 'Actions';

export interface IButtonProps extends IButtonOptions {
    action: IActionOptions;
}

/**
 * Виджет "Кнопка", который предоставляет пользователю возможность запуска действия из контекста при нажатии на него.
 * @param props
 * @constructor
 */
function Button(props: IButtonProps) {
    const actionSlice = useContext(DataContext)?.[ACTIONS_SLICE_NAME];
    const actionConfig = actionSlice?.state?.items?.getRecordById(props.action?.id);
    return (
        <WSButton
            {...props}
            onClick={async () => {
                await clickHandler(props.action, actionConfig);
            }}
        />
    );
}

const clickHandler = (
    action: IActionOptions,
    actionConfig: Record<string, unknown>
): Promise<void> => {
    if (action && actionConfig) {
        return getProvider(actionConfig.get('commandName')).then((provider) => {
            return provider.execute(actionConfig.get('commandOptions'), action.actionProps);
        });
    } else {
        Logger.warn('Controls-Buttons/buttonConnected:Button:: не найден контекст действий');
    }
};

const getProvider = (commandName: string): Promise<unknown> => {
    return ModulesLoader.loadAsync(commandName).then((provider) => {
        return new provider();
    });
};

Button.displayName = 'Controls-Buttons/buttonConnected:Button';
export { Button };
