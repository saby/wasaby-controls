import { SnapshotName } from './SnapshotName';
import { TBeforeSearchSnapshot } from './snapshots/TBeforeSearch';
import { TBeforeShowOnlySelected } from './snapshots/TBeforeShowOnlySelected';
import { TBeforeOpenOperationsPanel } from './snapshots/TBeforeOpenOperationsPanel';
import { TComplexUpdate } from './snapshots/TComplexUpdate';

/**
 * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
 * -
 * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
 * Никакой поддержки и обратной совместимости не запланировано.
 *
 * Тип объекта, который хранит слепки состояний.
 * @private
 */
export type TSnapshots = Partial<{
    [SnapshotName.BeforeSearch]: TBeforeSearchSnapshot;
    [SnapshotName.BeforeShowOnlySelected]: TBeforeShowOnlySelected;
    [SnapshotName.BeforeOpenOperationsPanel]: TBeforeOpenOperationsPanel;
    [SnapshotName.ComplexUpdate]: TComplexUpdate;
}>;

/**
 * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
 * -
 * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
 * Никакой поддержки и обратной совместимости не запланировано.
 *
 * Утилитарный тип для получения типа слепка по его имени.
 * @private
 */
export type TSnapshotByName<T extends SnapshotName> = TSnapshots[T];

/**
 * НЕ ДЛЯ ПРИКЛАДНОГО ИСПОЛЬЗОВАНИЯ.
 * -
 * Состояние исключительно для внутреннего использования и может быть удалено/изменено в любое время.
 * Никакой поддержки и обратной совместимости не запланировано.
 *
 * Интерфейс хранилища слепков состояния, снимаемых в ходе распространения действия.
 * @private
 */
export interface ISnapshotsStore {
    get: <T extends SnapshotName>(name: T) => TSnapshotByName<T> | undefined;
    set: <T extends SnapshotName>(name: T, value: TSnapshotByName<T>) => void;
    delete: (name: SnapshotName) => void;
}
