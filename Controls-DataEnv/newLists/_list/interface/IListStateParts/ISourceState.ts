import type { NewSourceController as SourceController } from 'Controls/dataSource';
import type { ISourceOptions } from 'Controls-DataEnv/interface';

/**
 * Интерфейс состояния для работы с источником данных в WEB списке.
 */
export interface ISourceState extends Required<ISourceOptions> {
    sourceController?: SourceController;
}
