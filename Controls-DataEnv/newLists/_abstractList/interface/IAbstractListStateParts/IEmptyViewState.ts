import type { IEmptyViewConfig } from 'Controls/gridRender';
import type { TemplateFunction } from 'UI/Base';

/**
 * Состояние для поддержки пустого представления
 */
export interface IEmptyViewState {
    /**
     * Конфигурация ячеек пустого представления
     */
    emptyView?: IEmptyViewConfig[] | TemplateFunction;

    emptyViewConfig?: object;
}
