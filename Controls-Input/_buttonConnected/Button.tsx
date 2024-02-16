import { Button as WSButton, IButtonOptions } from 'Controls/buttons';
import { IActionOptions } from 'Controls-Input/interface';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { DataContext } from 'Controls-DataEnv/context';
import { useContext } from 'react';
import { Logger } from 'UI/Utils';
import * as rk from 'i18n!Controls-Input';

const ACTIONS_SLICE_NAME = 'Actions';

/**
 * Интерфейс для стилевого оформления кнопки, работающей со слайсом формы
 * @public
 */
export interface IButtonProps extends IButtonOptions {
    action: IActionOptions;
    icon?: {
        uri?: string;
        captionPosition?: 'start' | 'end';
    };
}

const getProvider = (commandName: string): Promise<unknown> => {
    return ModulesLoader.loadAsync(commandName).then((provider) => {
        return new provider();
    });
};

const clickHandler = (
    action: IActionOptions,
    actionConfig: Record<string, unknown>
): Promise<void> => {
    if (action && actionConfig) {
        return getProvider(actionConfig.get('commandName')).then((provider) => {
            return provider.execute(actionConfig.get('commandOptions'), action.actionProps);
        });
    } else {
        Logger.warn('Controls-Input/buttonConnected:Button:: не найден контекст действий');
    }
};

/**
 * Виджет "Кнопка", который предоставляет пользователю возможность запуска действия из контекста при нажатии на него.
 * @param props
 * @constructor
 */
function Button(props: IButtonProps) {
    const actionSlice = useContext(DataContext)?.[ACTIONS_SLICE_NAME];
    const actionConfig = actionSlice?.state?.items?.getRecordById(props.action?.id);
    const { caption = rk('Название'), icon = {} } = props;
    return (
        <WSButton
            {...props}
            caption={caption}
            icon={icon.uri}
            captionPosition={icon.captionPosition}
            onClick={async () => {
                await clickHandler(props.action, actionConfig);
            }}
        />
    );
}

Button.displayName = 'Controls-Input/buttonConnected:Button';
export { Button };
