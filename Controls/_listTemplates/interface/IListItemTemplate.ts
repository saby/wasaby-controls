/**
 * @kaizen_zone 0905a500-8f7f-40a7-b7ab-79828ca54b5f
 */
import { TemplateFunction } from 'UI/Base';
import { IItemImage, TImageFit } from 'Controls/interface';
import type { CollectionItem } from 'display';


/**
 * Шаблон отображения записи в {@link Controls/list:View плоском списке}, с возможностью настройки заголовка, подвала, контента и изображения.
 *
 * @class Controls/listTemplates/ListItemTemplate
 * @mixes Controls/list:ItemTemplate
 *
 * @see Controls/columns:View
 *
 * @public
 */
export interface IListItemTemplateOptions extends IItemImage {
    /**
     * Название поле записи в котором лежит ссылка на картинку
     */
    imageProperty: string;

    /**
     * Режим встраивания изображения.
     */
    imageFit: TImageFit;

    /**
     * Цвет конечного значения градиента, который накладывается поверх изображения.
     * @sescription Поддерживаются CSS-совместимые значения цветов.
     * @default #ffffff
     */
    imageGradientColor: string;

    /**
     * URL заглушки, если не получилось посчитать URL изображения
     */
    fallbackImage: string;

    /**
     * Запись списка
     */
    item: CollectionItem;

    /**
     * Флаг, по которому определяется, что запись находится в режиме редактирования
     */
    isEditing: boolean;

    /**
     * Шаблон отображения заголовка записи
     */
    captionTemplate: TemplateFunction | string;

    /**
     * Шаблон отображения заголовка записи в режиме редактирования
     */
    captionEditor: TemplateFunction | string;

    /**
     * Шаблон отображения содержимого записи
     */
    contentTemplate: TemplateFunction | string;

    /**
     * Шаблон отображения содержимого записи в режиме редактирования
     */
    contentEditor: TemplateFunction | string;

    /**
     * Шаблон отображения подвала записи
     */
    footerTemplate: TemplateFunction | string;

    /**
     * Шаблон отображения подвала записи в режиме редактирования
     */
    footerEditor: TemplateFunction | string;
}
