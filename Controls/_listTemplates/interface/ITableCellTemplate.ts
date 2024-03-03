/**
 * @kaizen_zone 0905a500-8f7f-40a7-b7ab-79828ca54b5f
 */
import { TImageFit, TImageViewMode } from 'Controls/interface';
import { TemplateFunction } from 'UI/Base';

/**
 * Шаблон отображения ячейки в {@link Controls/grid:View таблице} и {@link Controls/treeGrid:View дереве}, с возможностью настройки подвала, контента и изображения.
 *
 * @class Controls/listTemplates/TableCellTemplate
 * @mixes Controls/grid:ColumnTemplate
 *
 * @see Controls/columns:View
 *
 * @public
 */
export interface ITableCellTemplateOptions {
    /**
     * URL заглушки, если не получилось посчитать URL изображения
     */
    fallbackImage: string;

    /**
     * Название поле записи в котором лежит ссылка на картинку
     */
    imageProperty: string;

    /**
     * Режим встраивания изображения.
     */
    imageFit: TImageFit;

    /**
     * Режим вывода изображения.
     */
    imageViewMode?: TImageViewMode;

    /**
     * Шаблон отображения содержимого ячейки
     */
    contentTemplate: TemplateFunction | string;

    /**
     * Шаблон отображения подвала ячейки
     */
    footerTemplate: TemplateFunction | string;
}
