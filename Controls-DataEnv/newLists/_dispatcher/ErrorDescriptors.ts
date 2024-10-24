import { TAbstractAction } from './types/TAbstractAction';
import { logger } from 'Application/Env';

const CONTROL_NAME = 'Controls-DataEnv/dispatcher:Dispatcher';

/**
 * Дескриптор ошибки о наслоении при распространении действий.
 * @param {TAbstractAction} dispatchingHeadAction Первое действие, которое запустило текущее распространения по цепочке.
 * @param {TAbstractAction} newCallAction Действие переданное для распространения в момент распространения другого действия.
 * @constructor
 */
export const DISPATCH_COLLISION = (
    dispatchingHeadAction: TAbstractAction,
    newCallAction: TAbstractAction
) => {
    logger.error(
        `Ошибка использования ${CONTROL_NAME}.\n` +
            'Произошло наслоение распространения действий.\n' +
            'Во время выполнения цепочки распространения действия было вызвано распространение нового действия.\n' +
            `Действие которое с инициировало первую цепочку распространения: "${dispatchingHeadAction.type}".\n` +
            `Действие которое с инициировало вторую цепочку распространения: "${newCallAction.type}".\n` +
            'Перед вызовом распространения нового действия, необходимо дожидаться завершения предыдущего распространения.\n'
    );
};

/**
 * Дескриптор ошибки о попытке использования разрушенного Disptcher'a.
 * @constructor
 */
export const DESTROYED_INSTANCE = () => {
    logger.error(`Ошибка использования ${CONTROL_NAME}.\n${CONTROL_NAME} был уничтожен!`);
};
