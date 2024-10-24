/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { NewSourceController as SourceController } from 'Controls/dataSource';

/**
 * Интерфейс состояния для работы ViewModel с источником данных.
 */
export interface IListSourceState {
    sourceController?: SourceController;
}
