import type { IEmptyViewConfig } from 'Controls/gridRender';

/**
 * Состояние для поддержки пустого представления
 */
export interface IEmptyViewState {
    /**
     * Конфигурация ячеек пустого представления
     */
    emptyView?: IEmptyViewConfig[];

    emptyViewConfig?: object;
}
