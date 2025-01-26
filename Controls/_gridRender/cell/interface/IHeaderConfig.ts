import { IColspanProps, IRowspanProps } from 'Controls/_gridRender/interface/CommonInterface';
import { IBaseColumnConfig } from 'Controls/_gridRender/cell/interface/IBaseColumnConfig';
import type { ICompatibleHeaderConfig } from 'Controls/gridDisplay';

/**
 * Конфигурация ячейки заголовка
 * @public
 */
export interface IHeaderConfig
    extends IBaseColumnConfig,
        IColspanProps,
        IRowspanProps,
        ICompatibleHeaderConfig {
    /**
     * Текст заголовка ячейки
     * @cfg
     */
    caption?: string;

    /**
     * Имя поля, по которому выполняется сортировка.
     * @cfg
     * @remark
     * Если в конфигурации ячейки задать это свойство, то в заголовке таблицы в конкретной ячейке будет отображаться кнопка для изменения сортировки. Клик по кнопке будет менять порядок сортировки элементов на противоположный. При этом элементы будут отсортированы по полю, имя которого указано в свойстве sortingProperty. Одновременно можно сортировать только по одному полю.
     * @example
     * <pre class="brush: js">
     *    const header: IHeaderConfig[] = [
     *       {
     *          caption: 'Цена',
     *          sortingProperty: 'price'
     *       },
     *       {
     *          caption: 'Остаток',
     *          sortingProperty: 'balance'
     *       }
     *    ];
     * }
     * </pre>
     */
    sortingProperty?: string;
}
