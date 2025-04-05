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

    /**
     * Объект с опциями для настройки пустого представления.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    emptyViewConfig?: object;
}
