import { logger } from 'Application/Env';
import { IBaseColumnConfig } from 'Controls-DataEnv/listTypes';

const INTERACTOR_USER_ERROR_PREFIX =
    'ПРИКЛАДНАЯ ОШИБКА использования Controls-DataEnv/abstractList (ListSlice/Фабрика списка)!\n';
const INTERACTOR_INNER_ERROR_PREFIX = 'Исключение в Controls-DataEnv/abstractList!\n';

const INTERACTOR_WRONG_OPTION_CONFIG_PREFIX = (optionName: string) =>
    `Неверная конфигурация опции ${optionName}!\n`;

/**
 * Дескриптор ошибки о коллизии обновлений интерактора
 */
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

/**
 * Дескриптор ошибки о неверных или пустых аргументах метода загрузки(loadData).
 */
export const MISSING_ARGS_IN_LOAD_DATA = (): Error => {
    return Error(INTERACTOR_USER_ERROR_PREFIX + 'Не заданы аргументы фабрики.');
};

/**
 * Дескриптор ошибки о неопределенном обязательном свойстве isLatestInteractorVersion.
 */
export const MISSING_VERSION_IN_LOAD_DATA = (): Error => {
    return Error(
        INTERACTOR_USER_ERROR_PREFIX +
            'Не задан обязательный параметр абстрактной фабрики isLatestInteractorVersion.'
    );
};

/**
 * Дескриптор ошибки о наличии дубликатов в массиве, который предполагает наличие только уникальных элементов.
 */
export const DUPLICATES_IN_ARRAY = (targetName?: string) => {
    logger.warn(
        INTERACTOR_USER_ERROR_PREFIX +
            `В опцию ${targetName} был передан массив, содержащий дубли элементов.` +
            '\nНеобходимо предварительно убрать их в своем коде.'
    );
};

/**
 * Дескриптор ошибки о проваленной валидации опции. Общая ошибка, без детализации.
 */
export const INIT_VALIDATION_FAILED = (value: unknown) => {
    let msg = INTERACTOR_INNER_ERROR_PREFIX + 'Значение опции невалидно!\n';
    try {
        msg += JSON.stringify(value);
    } catch (_e) {
        msg += String(value);
    }
    logger.error(msg);
};

/**
 * Дескриптор ошибки о проваленной неверном формате опции header/columns.
 */
export const WRONG_COLUMNS_CONFIG = (value: unknown[], type: 'warn' | 'error' = 'warn') => {
    logger[type](
        INTERACTOR_USER_ERROR_PREFIX +
            INTERACTOR_WRONG_OPTION_CONFIG_PREFIX('header/columns') +
            'В одной из конфигураций не задан ключ\n' +
            '[\n' +
            value
                .map((o) => `\t{ key: ${((o || {}) as IBaseColumnConfig).key as unknown}, ... }\n`)
                .join('') +
            ']\n'
    );
};

/**
 * Дескриптор ошибки о неверно заданных опциях типа "колонки"(любые: заголовки,колонки данных, подвалы и т.п.).
 */
export const COLUMNS_IS_RS = () => {
    logger.warn(
        'Controls-DataEnv/abstractList: В качестве конфигурации для columns передан RecordSet, хотя ожидался массив'
    );
};

/**
 * Дескриптор ошибки о том, что в emptyView передан неверный рендер.
 */
export const WRONG_EMPTY_VIEW_CONFIG = (type: 'warn' | 'error' = 'warn') => {
    logger[type](
        INTERACTOR_USER_ERROR_PREFIX +
            INTERACTOR_WRONG_OPTION_CONFIG_PREFIX('emptyView') +
            'Переданный шаблон в опции render не является реакт элементом\n'
    );
};

/**
 * Дескриптор ошибки о том, что задан viewMode не являющийся поисковым отображением при наличии непустого searchValue.
 */
export const WRONG_SEARCH_VIEW_MODE_INIT = (type: 'warn' | 'error' = 'error') => {
    logger[type](
        INTERACTOR_USER_ERROR_PREFIX +
            INTERACTOR_WRONG_OPTION_CONFIG_PREFIX('viewMode') +
            `При наличии непустого searchValue, viewMode должен иметь значение search.\n`
    );
};

/**
 * Дескриптор ошибки EMPTY_EXECUTING_ACTIONS_ON_REJECT
 */
export const EMPTY_EXECUTING_ACTIONS_ON_REJECT = () => {
    logger.error('Ошибка отмены обновления слайса.\n' + 'Ничего в данный момент не исполняется');
};

/**
 * Дескриптор ошибки MISSING_SEARCH_PARAM
 */
export const MISSING_SEARCH_PARAM = () => {
    throw new Error('ListSlice::Не указан searchParam в слайсе списка. Поиск не будет запущен');
};

/**
 * Дескриптор ошибки LOAD_DATA_ERROR
 */
export const LOAD_DATA_ERROR = (error: Error) => {
    logger.error('Controls-DataEnv/list:ListSlice load error', error);
};

/**
 * Дескриптор ошибки DEPRECATED_USED
 */
export const DEPRECATED_USED = (
    type: 'error' | 'warn',
    deprecatedName: string,
    newName?: string,
    version?: string
) => {
    let msg = `Свойство/метод/опция ${deprecatedName} устарело`;

    if (version) {
        msg += ` и будет удалено в версию ${version}.\n`;
    } else {
        msg += '.\n';
    }

    if (newName) {
        msg += `Вместо него необходимо использовать ${newName}.`;
    }

    logger[type](msg);
};

/**
 * Дескриптор ошибки OBJ_IS_NOT_COLLECTION
 */
export const OBJ_IS_NOT_COLLECTION = () => {
    logger.error(
        'Controls-DataEnv/abstractList:AbstractListSlice',
        new Error(
            'Controls-DataEnv/abstractList:AbstractListSlice setCollection: коллекция должна быть наследником Controls/display:Collection'
        )
    );
};

/**
 * Дескриптор ошибки ANY
 */
export const ANY = (...args: unknown[]) => {
    logger.error('Controls-DataEnv/abstractList:AbstractListSlice', ...args);
};
