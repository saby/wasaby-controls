import type { NewSourceController as SourceController } from 'Controls/dataSource';

/**
 * Интерфейс состояния для работы с источником данных в WEB списке.
 */
export interface ISourceState {
    sourceController?: SourceController;
}
