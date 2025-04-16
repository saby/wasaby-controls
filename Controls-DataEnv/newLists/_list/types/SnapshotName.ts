/**
 * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
 * -
 * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
 * Никакой поддержки и обратной совместимости не запланировано.
 *
 * Названия слепков состояния, снимаемых в ходе распространения действия.
 * @private
 */
export enum SnapshotName {
    BeforeSearch = 'BeforeSearch',
    BeforeShowOnlySelected = 'BeforeShowOnlySelected',
    BeforeOpenOperationsPanel = 'BeforeOpenOperationsPanel',
    ComplexUpdate = 'ComplexUpdate',
}
