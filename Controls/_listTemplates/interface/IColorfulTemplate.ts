/**
 * @kaizen_zone 0905a500-8f7f-40a7-b7ab-79828ca54b5f
 */
import { TemplateFunction } from 'UI/Base';

/**
 * Тема оформления элементов на подложке.
 */
export type Theme = 'dark' | 'light';

/**
 * Шаблон отображения записи в {@link Controls/columns:View многоколоночном списке}, который стилизуется в зависимости от изображения.
 * В параметр T стоит указывать запись.
 * @class Controls/listTemplates/ColorfulTemplate
 * @mixes Controls/columns:ItemTemplate
 *
 * @see Controls/columns:View
 *
 * @public
 */
export interface IColorfulTemplateOptions<T> {
    /**
     * Текст заголовка.
     */
    title: string;
    /**
     * Текст описания.
     */
    description?: string;
    /**
     * Имя поля записи, отвечающей за доминантный цвет изображения.
     */
    dominantColorProperty: keyof T;
    /**
     * Имя поля записи, отвечающей за комплиментарный цвет изображения.
     */
    complementaryColorProperty: keyof T;
    /**
     * Имя поля записи, отвечающей за тему доминантного цвета изображения.
     * Поддерживаются значения типа {@link Theme}.
     * @remark
     * В зависимости от темы определяется оформление элементов распологаемых на подложке доминантного цвета.
     */
    dominantThemeColorProperty: keyof T;
    /**
     * Шаблон, отображаемый после изображения и до заголовка.
     */
    afterImageTemplate?: TemplateFunction;
    /**
     * Шаблон для размещения в конце строки заголовка.
     */
    afterTitleTemplate?: TemplateFunction;
    /**
     * Шаблон, вставляемый в правом верхнем углу изображения для отображения дополнительных прикладных элементов.
     */
    additionalPanelTemplate?: TemplateFunction;
    /**
     * Шаблон подвала.
     */
    footerTemplate?: TemplateFunction;
}
