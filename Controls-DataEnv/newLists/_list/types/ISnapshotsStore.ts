import { SnapshotName } from './SnapshotName';
import { TBeforeSearchSnapshot } from './snapshots/TBeforeSearch';
import { TBeforeShowOnlySelected } from './snapshots/TBeforeShowOnlySelected';
import { TBeforeOpenOperationsPanel } from './snapshots/TBeforeOpenOperationsPanel';
import { TComplexUpdate } from './snapshots/TComplexUpdate';

/**
 * Не для прикладного использования.
 * --
 * Тип объекта, который хранит слепки состояний.
 */
export type TSnapshots = Partial<{
    [SnapshotName.BeforeSearch]: TBeforeSearchSnapshot;
    [SnapshotName.BeforeShowOnlySelected]: TBeforeShowOnlySelected;
    [SnapshotName.BeforeOpenOperationsPanel]: TBeforeOpenOperationsPanel;
    [SnapshotName.ComplexUpdate]: TComplexUpdate;
}>;

/**
 * Не для прикладного использования.
 * --
 * Утилитарный тип для получения типа слепка по его имени.
 */
export type TSnapshotByName<T extends SnapshotName> = TSnapshots[T];

/**
 * Не для прикладного использования.
 * --
 * Интерфейс хранилища слепков состояния, снимаемых в ходе распространения действия.
 */
export interface ISnapshotsStore {
    get: <T extends SnapshotName>(name: T) => TSnapshotByName<T> | undefined;
    set: <T extends SnapshotName>(name: T, value: TSnapshotByName<T>) => void;
    delete: (name: SnapshotName) => void;
}
