import { logger } from 'Application/Env';
import { IBaseColumnConfig } from 'Controls-DataEnv/listTypes';

const INTERACTOR_USER_ERROR_PREFIX =
    'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n';
const INTERACTOR_INNER_ERROR_PREFIX = 'Исключение в Controls-DataEnv/abstractList!\n';

export const UPDATE_STATE_COLLISION = () => {
    logger.error(
        INTERACTOR_USER_ERROR_PREFIX +
            'Коллизия обновлений.\n' +
            'Асинхронные обновления состояний наложились друг на друга.\n' +
            'Некоторые из возможных причин: \n' +
            '\t1) расширяющий прикладной Slice не ждет списочный ListSlice._beforeApplyState или не возвращает его результат;\n' +
            '\t2) множественный вызов ListSlice._beforeApplyState изнутри расширяющего метода(в рамках одного цикла обновления);\n' +
            '\t3) не обработана отмена обновления ListSlice.\n' +
            '\tВ случае, если до вызова ListSlice._beforeApplyState присутствует прикладная асинхронная операция,\n' +
            '\tследует обернуть ее в CancelablePromise и отменять его в protected методе _onRejectBeforeApplyState.\n' +
            '\tОбязателен вызов родительского ListSlice._onRejectBeforeApplyState.\n'
    );
};

export const MISSING_ARGS_IN_LOAD_DATA = (): Error => {
    return Error(INTERACTOR_USER_ERROR_PREFIX + 'Не заданы аргументы фабрики.');
};

export const MISSING_VERSION_IN_LOAD_DATA = (): Error => {
    return Error(
        INTERACTOR_USER_ERROR_PREFIX +
            'Не задан обязательный параметр абстрактной фабрики isLatestInteractorVersion.'
    );
};

export const DUPLICATES_IN_ARRAY = (targetName?: string) => {
    logger.warn(
        INTERACTOR_USER_ERROR_PREFIX +
            `В опцию ${targetName} был передан массив, содержащий дубли элементов.` +
            '\nНеобходимо предварительно убрать их в своем коде.'
    );
};

export const INIT_VALIDATION_FAILED = (value: unknown) => {
    let msg = INTERACTOR_INNER_ERROR_PREFIX + 'Значение опции невалидно!\n';
    try {
        msg += JSON.stringify(value);
    } catch (_e) {
        msg += String(value);
    }
    logger.error(msg);
};

export const WRONG_COLUMNS_CONFIG = (value: unknown[], type: 'warn' | 'error' = 'warn') => {
    logger[type](
        INTERACTOR_USER_ERROR_PREFIX +
            'Неверная конфигурация опции header/columns!\n' +
            'В одной из конфигураций не задан ключ\n' +
            '[\n' +
            value
                .map((o) => `\t{ key: ${((o || {}) as IBaseColumnConfig).key as unknown}, ... }\n`)
                .join('') +
            ']\n'
    );
};

export const PROMISE_REGISTRATION_DUPLICATE = (key: string) => {
    return `Controls-DataEnv/abstractList:AsyncOperationsOrchestrator: Обнаружена повторная регистрация Promise с ключом ${key}`;
};

export const EMPTY_EXECUTING_ACTIONS_ON_REJECT = () => {
    logger.error('Ошибка отмены обновления слайса.\n' + 'Ничего в данный момент не исполняется');
};
