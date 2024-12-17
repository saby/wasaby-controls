import { Model } from 'Types/entity';
import { descriptor, DescriptorValidator } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IContextOptionsValue } from 'Controls/context';
import { IListConfigResult, ILoadDataResult, NewSourceController, Path } from 'Controls/dataSource';
import { IHeadingPath, HeadingPath } from 'Controls/breadcrumbs';
import type { TBackButtonIconViewMode, TBackButtonStyle } from 'Controls/heading';
import { TFontColorStyle, TFontSize, TBackgroundStyle } from 'Controls/interface';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_breadcrumbs/Widget';
import 'css!Controls-ListEnv/breadcrumbs';

/**
 * Интерфейс, описывающий опции виджета хлебных крошек
 * @public
 */
export interface IWidget extends IControlOptions {
    /**
     * @cfg {string} Идентификатор списка.
     */
    storeId: string | number;

    /**
     * @cfg {string} Заголовок кнопки, отображаемой в шапке навигационного меню, клик по которой приводит к переходу в корень.
     * @default 'На главную'
     */
    pathButtonCaption?: string;

    /**
     * @cfg {string|TemplateFunction} Пользовательский шаблон, отображаемый в левой части виджета
     */
    imageTemplate?: string | TemplateFunction;

    /**
     * @cfg {TBackgroundStyle} фон контрола
     */
    backgroundStyle: TBackgroundStyle;

    /**
     * @cfg {TBackButtonIconViewMode} Задает режим отображения иконки кнопки "Назад".
     * @variant default - иконка кнопки отображается без обводки.
     * @variant functionalButton - иконка кнопки отображается с обводкой.
     * @default default
     */
    backButtonIconViewMode: TBackButtonIconViewMode;

    /**
     * @cfg {String} Стиль цвета кнопки "Назад".
     * @see Controls/_heading/Back#fontColorStyle
     */
    backButtonFontColorStyle: TFontColorStyle;

    /**
     * @cfg {TFontSize} Размер шрифта кнопки "Назад"
     */
    backButtonFontSize: TFontSize;

    /**
     * Стиль обводки для иконки кнопки "Назад" при значении "functionalButton" в опции {@link backButtonIconViewMode}.
     * Применяется, если необходимо разместить кнопку "Назад" с обводкой на фоне, отличном от "default".
     * @cfg
     * @default pale
     * @demo Controls-demo/BreadCrumbs/backButtonStyle/Index
     */
    backButtonStyle: TBackButtonStyle;

    /**
     * @cfg {TFontSize} Размер шрифта
     */
    fontSize: TFontSize;

    /**
     * @cfg {String} Имя поля данных записи крошки значение которого будет выведено под самими хлебными крошками
     */
    additionalTextProperty?: string;

    id: string;
    _dataOptionsValue: IContextOptionsValue;
}

/**
 * Виджет хлебных крошек, который организует вывод картинки и описания для текущих данных хлебных крошек.
 *
 * Описание берётся из поля, указанного в опции {@link Controls-ListEnv/breadcrumbs:IWidget#additionalTextProperty}
 * Картинка задаётся пользовательским шаблоном в который в качестве переменной item приходит запись последнего итема данных хлебных крошек
 * @example
 * <pre class="brush: html">
 * <Controls-ListEnv.breadcrumbs:View>
 *     <ws:imageTemplate>
 *         <img src="{{imageTemplate.item.image}}"/>
 *     </ws:imageTemplate>
 * </Controls-ListEnv.breadcrumbs:View>
 * </pre>
 *
 * @class Controls-ListEnv/breadcrumbs:View
 * @extends UI/Base:Control
 * @mixes Controls/interface:IStoreId
 * @demo Controls-ListEnv-demo/Breadcrumbs/View/Base/Index
 *
 * @public
 */
export default class Widget extends Control<IWidget> {
    // region base props
    protected _template: TemplateFunction = template;
    protected _children: {
        breadcrumbs: HeadingPath;
    };
    // endregion

    // region template props
    /**
     * Данные, которые передаются в хлебные крошки
     */
    protected _breadcrumbsItems: Path;

    /**
     * Последний итем хлебных крошек, передается в пользовательский шаблон IWidget.imageTemplate
     */
    protected _lastBreadcrumbsItem: Model;

    /**
     * Опции для компонента HeadingPath
     */
    protected _headingPathOptions: IHeadingPath;
    // endregion

    // region private props
    private _sourceController: NewSourceController;
    // endregion

    // region life circle hooks
    protected _beforeMount(
        options?: IWidget,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._applyOptions(options);
    }

    protected _beforeUpdate(options: IWidget): void {
        this._applyOptions(options);
    }

    // endregion

    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        const listConfig = this._getListConfig();
        listConfig.setRoot(item.getKey());
    }

    private _applyOptions(options: IWidget): void {
        const prefetchResult = this._getListConfig(options);
        this._sourceController = prefetchResult.sourceController;

        const scState = this._sourceController.getState();

        this._breadcrumbsItems = scState.breadCrumbsItems;
        this._lastBreadcrumbsItem = this._breadcrumbsItems?.length
            ? this._breadcrumbsItems[this._breadcrumbsItems.length - 1]
            : null;

        this._headingPathOptions = buildHeadingPathOptions(options, prefetchResult);
    }

    // region helpers
    /**
     * Возвращает конфигурацию текущего списка
     */
    private _getListConfig(options: IWidget = this._options): IListConfigResult {
        return options._dataOptionsValue[options.storeId];
    }

    // endregion

    static getOptionTypes(): Partial<Record<keyof IWidget, DescriptorValidator>> {
        return {
            storeId: descriptor(String).required(),
            _dataOptionsValue: descriptor(Object).required(),
        };
    }
}

/**
 * На основании опций виджета собирает опции для Controls.breadcrumbs:HeadingPath
 */
function buildHeadingPathOptions(options: IWidget, prefetchResult: ILoadDataResult): IHeadingPath {
    const result = {} as IHeadingPath;

    result.keyProperty = prefetchResult.keyProperty;
    result.parentProperty = prefetchResult.parentProperty;
    result.displayProperty = prefetchResult.displayProperty;

    result.backgroundStyle = options.backgroundStyle;
    result.backButtonStyle = options.backButtonStyle;
    result.backButtonIconViewMode = options.backButtonIconViewMode;
    result.backButtonFontColorStyle = options.backButtonFontColorStyle;
    result.backButtonFontSize = options.backButtonFontSize || '4xl';
    result.fontSize = options.fontSize;
    result.pathButtonCaption = options.pathButtonCaption;
    result.pathButtonVisible = options.hasOwnProperty('pathButtonVisible')
        ? options.pathButtonVisible
        : true;
    result.pathHomeButtonVisible = options.hasOwnProperty('pathHomeButtonVisible')
        ? options.pathHomeButtonVisible
        : true;
    result.pathButtonSource = prefetchResult.source;
    result.pathButtonFilter = prefetchResult.filter;
    result.pathButtonSorting = prefetchResult.sorting;
    result.pathButtonNavigation = prefetchResult.navigation;
    result.pathButtonKeyProperty = prefetchResult.keyProperty;
    result.pathButtonNodeProperty = prefetchResult.nodeProperty;
    result.pathButtonParentProperty = prefetchResult.parentProperty;
    result.pathButtonDisplayProperty = prefetchResult.displayProperty;
    result.pathButtonHasChildrenProperty = prefetchResult.hasChildrenProperty;

    return result;
}
