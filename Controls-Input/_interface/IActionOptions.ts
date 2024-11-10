/**
 * Интерфейс для настройки действия
 * @public
 */
export interface IActionOptions {
    /**
     * Параметры, которые будут переданы для обработчика действия
     */
    actionProps: unknown;
    /**
     * Идентификатор действия
     */
    id: string;
}
