/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Path } from 'Controls/dataSource';
import { INavigationMenu } from './NavigationMenu';
import { Control, TemplateFunction } from 'UI/Base';
import { descriptor as EntityDescriptor } from 'Types/entity';
import { IPathButton } from 'Controls/_breadcrumbs/PathButton/interfaces';
import { Opener as NavigationMenuOpener } from 'Controls/_breadcrumbs/NavigationMenu/Opener';
import * as template from 'wml!Controls/_breadcrumbs/PathButton/PathButton';

/**
 * Контрол кнопки меню для хлебных крошек. При клике открывается popup со списком всех узлов в виде дерева.
 *
 * Список узлов запрашивается через метод {@link Types/source:ICrud#query query} указанный в переданном в опциях {@link Controls/breadcrumbs:IPathButton#source source}. При запросе данных в фильтр автоматически подставляется параметр <b>"Только узлы": true</b>. Если указан кастомный {@link Controls/breadcrumbs:IPathButton#filter фильтр}, то параметр "Только узлы" так же будет добавлен к нему.
 *
 * @demo Controls-demo/breadCrumbs_new/PathButton/Index
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IFilter
 * @implements Controls/tree:ITree
 *
 * @ignoreOptions dataLoadCallback
 * @ignoreOptions dataLoadErrback
 * @ignoreOptions nodeHistoryId
 * @ignoreOptions nodeHistoryType
 * @ignoreOptions expandByItemClick
 * @ignoreOptions expandedItems
 * @ignoreOptions collapsedItems
 * @ignoreOptions nodeFooterTemplate
 * @ignoreOptions nodeFooterVisibilityCallback
 * @ignoreOptions searchBreadCrumbsItemTemplate
 * @ignoreOptions expanderVisibility
 * @ignoreOptions nodeLoadCallback
 * @ignoreOptions deepReload
 * @ignoreOptions selectAncestors
 * @ignoreOptions selectDescendants
 * @ignoreOptions markItemByExpanderClick
 * @ignoreOptions expanderSize
 * @ignoreOptions expanderPosition
 *
 * @public
 */
export default class PathButton extends Control<IPathButton> {
    // region base props
    protected _options: IPathButton;
    protected _template: TemplateFunction = template;
    // endregion

    // region private props
    private _menu: NavigationMenuOpener;
    // endregion

    // region life circle hooks
    protected _afterMount(): void {
        this._menu = new NavigationMenuOpener();
    }
    // endregion

    /**
     * Обработчик изменения корня из {@link BodyComponent}, отображаемого в popup
     */
    protected _resultHandler(path: Path): void {
        this._notify('pathChanged', [path], { bubbling: false });
        this._closeMenu();
    }

    // region open/close menu
    /**
     * В зависимости от текущего устройства открывает либо StickyPanel, либо SlidingPanel
     */
    protected _openMenu(): void {
        const target = this._getPanelTemplateOptions().navigationMenuTarget || this._container;
        this._menu.open(this, target, {
            templateOptions: this._getPanelTemplateOptions(),
            eventHandlers: this._getPanelEventHandlers(),
        });
    }

    /**
     * Закрывает открытое ранее меню
     */
    protected _closeMenu(): void {
        this._menu.close();
    }

    /**
     * Возвращает объект с опциями для {@link BodyComponent}, отображаемого в popup
     */
    private _getPanelTemplateOptions(): INavigationMenu {
        return {
            headerVisible: true,
            readOnly: this._options.readOnly,
            caption: this._options.caption,
            path: this._options.path,
            source: this._options.source,
            filter: this._options.filter,
            sorting: this._options.sorting,
            navigation: this._options.navigation,
            keyProperty: this._options.keyProperty,
            nodeProperty: this._options.nodeProperty,
            parentProperty: this._options.parentProperty,
            displayProperty: this._options.displayProperty,
            hasChildrenProperty: this._options.hasChildrenProperty,
            navigationMenuTarget: this._options.navigationMenuTarget,
        };
    }

    /**
     * Возвращает объект с обработчиками события для {@link BodyComponent}, отображаемого в popup
     */
    private _getPanelEventHandlers(): object {
        return {
            onResult: this._resultHandler.bind(this),
        };
    }
    // endregion

    static defaultProps: Partial<IPathButton> = {
        inlineHeight: 'm',
    };

    static getOptionTypes(): object {
        return {
            inlineHeight: EntityDescriptor(String).oneOf(['xs', 'm', 'xl']),
        };
    }
}
