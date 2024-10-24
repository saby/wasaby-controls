import { logger } from 'Application/Env';

export const UPDATE_STATE_COLLISION = () => {
    logger.error(
        'Прикладная ошибка использования ListSlice.\n' +
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
