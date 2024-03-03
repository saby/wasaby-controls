/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { ICrudPlus } from 'Types/source';
import { TemplateFunction } from 'UI/Base';
import { TKey, TTextTransform, TFontSize } from 'Controls/interface';
import { TBackButtonIconViewMode } from 'Controls/heading';
import { IBreadCrumbsOptions } from 'Controls/_breadcrumbs/interface/IBreadCrumbs';

/**
 * Интерфейс описывает структуру объекта конфигурации компонента {@link Controls/breadcrumbs:HeadingPath}
 * @implements Controls/_breadcrumbs/interface/IBreadCrumbs
 * @public
 */
export interface IHeadingPath extends IBreadCrumbsOptions {
    /**
     * @cfg
     * Задает видимость кнопки {@link Controls/breadcrumbs:PathButton навигационного меню}.
     * Если значение опции установлено в true, то вместо иконки "домик" будет выведена кнопка вызова навигационного меню. При этом кнопка вызова навигационного меню видна всегда вне зависимости от текущего уровня иерархии.
     * @default false
     */
    pathButtonVisible?: boolean;

    /**
     * @cfg {String} Заголовок кнопки, отображаемой в шапке навигационного меню, клик по которой приводит к переходу в корень.
     * @default 'На главную'
     */
    pathButtonCaption?: string;

    /**
     * @cfg {Types/source#ICrud} Источник данных для кнопки меню при клике на которую отображается дерево каталогов.
     */
    pathButtonSource?: ICrudPlus;

    /**
     * @cfg {Object} Данные фильтра, используемого при запросе дерева каталогов для кнопки меню.
     */
    pathButtonFilter?: object;

    /**
     * @cfg {Object[]} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
     * @remark
     * Допустимы значения направления сортировки ASC/DESC.
     */
    pathButtonSorting?: object[];

    /**
     * @cfg {Controls/interface:INavigationOptionValue} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
     */
    pathButtonNavigation?: object;

    /**
     * @cfg {String} Имя поля записи содержащее её ключ.
     */
    pathButtonKeyProperty?: string;

    /**
     * @cfg {String} Имя поля записи содержащее её тип (узел, скрытый узел, лист).
     */
    pathButtonNodeProperty?: string;

    /**
     * @cfg {String} Имя поля записи содержащее идентификатор родительского узла.
     */
    pathButtonParentProperty?: string;

    /**
     * @cfg {String} Имя поля записи содержащее её отображаемое значение.
     */
    pathButtonDisplayProperty?: string;

    /**
     * @cfg {String} Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле {@link Controls/treeGrid:View дерева}.
     */
    pathButtonHasChildrenProperty?: string;

    displayMode: 'default' | 'multiline';

    /**
     * @cfg {String} Задает режим отображения иконки кнопки "Назад".
     * @variant default - иконка кнопки отображается без обводки.
     * @variant functionalButton - иконка кнопки отображается с обводкой.
     * @default default
     */
    backButtonIconViewMode?: TBackButtonIconViewMode;
    /**
     * @cfg {Controls/interface:ITextTransform/TTextTransform.typedef} Преобразование текста кнопки назад в заглавные или прописные символы.
     * @default 'none'
     */
    backButtonTextTransform?: TTextTransform;
    /**
     * @cfg {String|UI/Base:TemplateFunction} Кастомный шаблон, который выводится перед зоголовком кнопки назад в хлебных крошках.
     * В шаблон передается опция item в которой содержится запись хлебной крошки.
     */
    backButtonBeforeCaptionTemplate: string | TemplateFunction;

    root?: TKey;
    rootVisible?: boolean;
    showActionButton?: boolean;
    /**
     * @name Controls/_breadcrumbs/interface/IHeadingPath#withoutBackButton
     * @cfg {Boolean} Хлебные крошки будут отрисованы без кнопки назад.
     */
    withoutBackButton?: boolean;
    withoutBreadcrumbs?: boolean;
    backButtonFontSize?: TFontSize;
    backButtonIconStyle?: string;
    backButtonFontColorStyle?: string;
}
