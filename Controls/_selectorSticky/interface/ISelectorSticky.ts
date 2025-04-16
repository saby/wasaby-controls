import { ReactElement } from 'react';
import { TemplateFunction } from 'UI/Base';
import { IComponentProps, TBackgroundStyle, ISearchOptions } from 'Controls/interface';
import { IFilterItem } from 'Controls/filter';
import { ISelectorBaseOptions } from './ISelectorBase';
import { ISlidingPanelOptions } from 'Controls/popup';

type TBreadCrumbsVisibility = 'visible' | 'hidden';

/**
 * Интерфейс для контрола "Справочник в меню"
 * @interface Controls/selectorSticky:ISelectorStickyTemplateProps
 * @implements Controls/interface:IComponentProps
 * @implements Controls/filter:IFilterDescriptionProps
 * @implements Controls/selectorSticky:ISelectorBaseOptions
 * @ignoreOptions searchValueTrim
 * @public
 */
export interface ISelectorStickyTemplateProps extends IComponentProps, ISelectorStickyProps {
    selectorFactoryName?: string;
    allowAdaptive?: boolean;
    /**
     * @cfg {String} Заголовок справочника
     */
    headingCaption?: string;
    /**
     * @cfg {UI/Base:TemplateFunction|String} Шаблон контента шапки
     */
    headerContentTemplate?: string | TemplateFunction | ReactElement;
    /**
     * @cfg {UI/Base:TemplateFunction|String} Шаблон шапки, отображается над основным контентом окна.
     */
    headerTemplate?: string | TemplateFunction | ReactElement;
    /**
     * @cfg {'visible' | 'hidden'} Определяет видимость хлебных крошек над списком
     */
    breadCrumbsVisibility?: TBreadCrumbsVisibility;

    searchPlaceholder?: string;

    filterDescription?: IFilterItem[];
    /**
     * @cfg {String} Текстовое значение, которое будет использовано для отображения рядом с кнопкой, когда во всех фильтрах установлено значение "по умолчанию"
     */
    filterDescriptionEmptyText?: string;

    footerBackgroundStyle?: TBackgroundStyle;
    stickyFooter?: boolean;
    /**
     * @cfg {String} Имя поля фильтра, в значение которого будет записываться текст для поиска.
     * Подробнее про {@link Controls/_interface/ISearch#searchParam searchParam}.
     */
    searchParam?: string;
    /**
     * @cfg {Number} Минимальное количество символов, которое пользователь должен ввести для выполнения поискового запроса.
     * Подробнее про {@link Controls/_interface/ISearch#minSearchLength minSearchLength}.
     */
    minSearchLength?: number;
    dropdownClassName?: string;

    // sliding options
    slidingPanelOptions: ISlidingPanelOptions;
    onPopupDragStart: Function;
    onPopupDragEnd: Function;
    handleChangeSize: Function;
}

interface ISelectorStickyProps
    extends ISelectorBaseOptions,
        Pick<ISearchOptions, 'searchParam' | 'minSearchLength'> {}
