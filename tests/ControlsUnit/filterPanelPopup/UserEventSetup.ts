import userEvent from '@testing-library/user-event';

let instance;

// FIXME Временный модуль, удалить, как зальют правки Сани Зайцева
export function getInstance(): typeof userEvent {
    if (!instance) {
        instance = userEvent.setup({
            // в некоторых тестах символы обрабатываются в неправильном порядке, поэтому добавим задержку на ввод
            delay: 50,
        });
    }
    return instance;
}
