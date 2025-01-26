// TODO: Перенести тип в Controls-DataEnv
import type { IEmptyViewConfig } from 'Controls/gridRender';

type THeaderVisibility = 'visible' | 'hasdata';
type TRowSeparatorSize = 's' | 'l' | null;
type TRowSeparatorVisibility = 'all' | 'items' | 'edges';

/**
 * Интерфейс опций, которые логически не должны быть на интеракторе,
 * но сейчас должны быть заданы на нем, для проксирования в коллекцию.
 *
 * !!!ВНИМАНИЕ!!!
 * КАЖДАЯ ОПЦИЯ МОЖЕТ БЫТЬ ДОБАВЛЕНА ТОЛЬКО С ССЫЛКОЙ НА ЗАДАЧУ,
 * ГДЕ СФОРМУЛИРОВАНО КАКОЙ ПЛАСТ ЛОГИКИ ДОЛЖЕН УЙТИ С КОЛЛЕКЦИИ ВО ВЬЮ
 * @private
 * */
export interface IStateThatShouldGoIntoViewLayer {
    /**
     * @deprecated НЕ ИСПОЛЬЗОВАТЬ.
     * Интерактор не должен конфигурировать шапку на коллекции, т.к. предполагается отказ от
     * этой коллекциив сторону массива и отдельных опций, за которые отвечает интерактор.
     * Решение какую запись стикать, а какую нет не входит в его обязанности.
     *
     * https://online.sbis.ru/opendoc.html?guid=a962063f-f674-44d5-b31f-a1f0848f217e&client=3
     */
    stickyHeader?: boolean;
    headerVisibility?: THeaderVisibility;

    /**
     * https://online.sbis.ru/opendoc.html?guid=42b5e265-c380-4503-ad90-9df46426d313&client=3
     */
    rowSeparatorSize?: TRowSeparatorSize;
    rowSeparatorVisibility?: TRowSeparatorVisibility;
    /**
     * https://online.sbis.ru/opendoc.html?guid=18702801-b618-459e-b078-72b4ffdb48df&client=3
     */
    emptyTemplate?: unknown;
    emptyTemplateOptions?: object;
    emptyView?: IEmptyViewConfig[];
    emptyViewConfig?: object;
}
