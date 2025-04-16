const DEBUGGER_INNER_ERROR = 'ОШИБКА СИСТЕМЫ ОТЛАДКИ ИНТЕРАКТОРА СПИСКА.\n';

export const MISSING_SESSION = (): Error => {
    return Error(DEBUGGER_INNER_ERROR + 'Сессия обновления НЕ запущена!');
};
export const SESSION_ALREADY_EXISTS = (): Error => {
    return Error(DEBUGGER_INNER_ERROR + 'Сессия обновления УЖЕ запущена!');
};

export const MISSING_DISPATCHER_STORAGE = (): Error => {
    return Error(DEBUGGER_INNER_ERROR + 'Не проинициализирован _dispatchesStorage внутри сессии!');
};

export const MISSING_PHASE = (): Error => {
    return Error(
        DEBUGGER_INNER_ERROR +
            'Не проинициализирована фаза сессии обновления!\n' +
            'Все действия внутри сессии обновления обязаны быть привязаны к какой либо запущенной фазе.'
    );
};

export const PHASE_NOT_STARTED = (): Error => {
    return Error(
        DEBUGGER_INNER_ERROR +
            'Фаза сессии обновления не запущена.\n' +
            'Все действия внутри сессии обновления обязаны быть привязаны к какой либо ЗАПУЩЕННОЙ фазе.'
    );
};

export const MISSING_DISPATCH = (): Error => {
    return Error(DEBUGGER_INNER_ERROR + 'Распространение(dispatch) НЕ запущено!');
};

export const DISPATCH_ALREADY_EXISTS = (): Error => {
    return Error(DEBUGGER_INNER_ERROR + 'Распространение(dispatch) УЖЕ запущено!');
};

export const PHASE_HAS_NOT_BEEN_STARTED = (id: string): Error => {
    return Error(DEBUGGER_INNER_ERROR + `Фаза [${id}] НЕ запущена!`);
};

export const NOT_ALL_PHASES_COMPLETED = (): Error => {
    return Error(
        'КРИТИЧЕСКАЯ ОШИБКА РАБОТЫ ИНТЕРАКТОРА СПИСКА!\n' +
            'Не все фазы обновления были запущены.\n' +
            'Одна из возможных причин - переопределение приватных платформенны методов.'
    );
};

export const PHASE_HAS_BEEN_ALREADY_STARTED = (id: string): Error => {
    return Error(DEBUGGER_INNER_ERROR + `Фаза [${id}] УЖЕ запущена!`);
};

export const DEBUGGER_MISSING_IN_STORAGE = (name: string): Error => {
    return Error(
        DEBUGGER_INNER_ERROR +
            'Ошибка регистрации списочного отладчика в DebuggersStorage!\n' +
            `Отладчика с таким именем не было зарегистрировано в DebuggersStorage: ${name}.`
    );
};

export const DEBUGGER_EXISTS_IN_STORAGE = (name: string): Error => {
    return Error(
        DEBUGGER_INNER_ERROR +
            'Ошибка регистрации списочного отладчика в DebuggersStorage!\n' +
            `Дублируются имена отладчиков: ${name}.`
    );
};
