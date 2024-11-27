/**
 * Интерфейс для настройки действия
 * @public
 */
export interface IActionOptions {
    /**
     * Параметры, которые будут переданы для обработчика действия
     */
    actionProps: Record<string, unknown>;
    /**
     * Комбинация клавиш, которая будет вызывать запуск действия
     */
    hotKey?: {
        keyCode: number;
        altKey: boolean;
        ctrlKey: boolean;
        shiftKey: boolean;
    };
    /**
     * Идентификатор действия
     */
    id: string;
}
