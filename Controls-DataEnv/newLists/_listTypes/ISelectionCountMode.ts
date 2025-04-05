/**
 * Варианты выбора элементов
 * @variant all Подсчитываются все виды записей.
 * @variant node Подсчитываются только узлы.
 * @variant leaf Подсчитываются только листья.
 */
export type TSelectionCountMode = 'all' | 'leaf' | 'node';

/**
 * Интерфейс для контролов, поддерживающих подсчет записей определённого типа.
 */
export interface ISelectionCountModeOptions {
    /**
     * Тип подсчитываемых записей.
     */
    selectionCountMode?: TSelectionCountMode;
}
