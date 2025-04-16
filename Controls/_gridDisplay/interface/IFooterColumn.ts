/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Интерфейс колонок подвала таблицы
 * @remark
 * Значения опций startColumn и endColumn задаются в соответствии с GridLayout CSS, т.е. с единицы. Индексы считаются по границам колонок.
 * Например, чтобы отобразить объединенную ячейку подвала под второй и третей колонкой таблицы, нужно задать startColumn и endColumn в значения
 * 2 и 4 соответственно.
 * @public
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */
export interface IFooterColumn {
    /*
     * @cfg {Number} Индекс колонки таблицы, с которой начинается ячейка подвала. Если поле не определено,
     * тогда берется endColumn предыдущей ячейки или 1 (если это первая колонка).
     * @see endColumn
     */
    startColumn?: number;

    /*
     * @cfg {Number} Индекс колонки таблицы, на которой заканчивается ячейка подвала. Если поле не определено,
     * тогда берется startColumn текущей ячейки, увеличенный на один.
     * @see startColumn
     */
    endColumn?: number;

    /**
     * @cfg {UI/Base:TemplateFunction|string} Шаблон содержимого колонки подвала. Если поле не определено, тогда содержимое колонки будет пустым.
     * @remark
     * Подробнее о работе с шаблоном читайте в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/footer/ подвала таблицы}
     * @default Controls/grid:FooterColumnTemplate
     * @see templateOptions
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    template?: TemplateFunction | string;

    /**
     * @cfg {Object} Объект с опциями для колонки.
     * @remark
     * Позволяет передать дополнительные настройки в шаблон колонки, которые будут доступны в области видимости шаблона.
     * Необходимо использовать для кастомизации шаблона колонки, в случаях когда нужно избежать дублирования кода.
     * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
     */
    templateOptions?: { [key: string]: unknown };
}
