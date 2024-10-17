/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { EventUtils } from 'UI/Events';
import { Path } from 'Controls/_dataSource/calculatePath';
import { IHeaderCell } from 'Controls/grid';
import * as GridIsEqualUtil from 'Controls/Utils/GridIsEqualUtil';
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_explorer/PathController/PathWrapper';
import { IExplorerOptions, TExplorerViewMode } from 'Controls/_explorer/interface/IExplorer';

interface IOptions extends IExplorerOptions {
    viewMode?: TExplorerViewMode;

    breadCrumbsItems?: Path;
    header?: IHeaderCell[];

    needShadow?: boolean;
    stickyHeader?: boolean;

    backgroundStyle?: string;

    rootVisible?: boolean;
    afterBreadCrumbsTemplate?: string | TemplateFunction;

    isFullGridSupport?: boolean;
    breadCrumbsMaxWidth?: number;

    withoutBackButton?: boolean;
}

/**
 * Выводит хлебные крошки с кнопкой "Назад" и {@link IOptions.afterBreadCrumbsTemplate кастомный шаблон} справа от них.
 *
 *
 * * Определяет нужно ли рисовать хлебные крошки.
 * * Определяет нужно ли выводить в хлебных крошках кнопку "Назад"
 * @private
 */
export default class PathWrapper extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _needCrumbs: boolean = false;
    protected _notifyHandler: typeof EventUtils.tmplNotify = EventUtils.tmplNotify;

    protected _beforeMount(options: IOptions): void {
        this._needCrumbs = PathWrapper._isNeedCrumbs(options);
    }

    protected _beforeUpdate(newOptions: IOptions): void {
        const viewModeChanged = this._options.viewMode !== newOptions.viewMode;
        const headerChanged = !GridIsEqualUtil.isEqualWithSkip(
            this._options.header,
            newOptions.header,
            { template: true }
        );

        if (
            headerChanged ||
            viewModeChanged ||
            this._options.breadCrumbsItems !== newOptions.breadCrumbsItems ||
            this._options.rootVisible !== newOptions.rootVisible ||
            this._options.breadcrumbsVisibility !== newOptions.breadcrumbsVisibility
        ) {
            this._needCrumbs = PathWrapper._isNeedCrumbs(newOptions);
        }
    }

    isCrumbsVisible(options: IOptions): boolean {
        return PathWrapper._isNeedCrumbs(options);
    }

    protected _getBreadCrumbsWrapperStyles(options: IOptions): string {
        let styles = '';

        if (typeof options.breadCrumbsMaxWidth !== undefined) {
            const width = options.breadCrumbsMaxWidth ? `${options.breadCrumbsMaxWidth}px` : '100%';
            styles += `max-width: calc(${width});`;
        }

        return styles;
    }

    private static _isNeedCrumbs(options: IOptions): boolean {
        if (options.breadcrumbsVisibility === 'hidden') {
            return false;
        }

        // В новом дизайне крошки видны всегда, т.к. там есть кнопка меню.
        // Кроме случая когда крошки явно скрыли через breadcrumbsVisibility, т.к.
        // в этом случае кто-то другой крошки показывает
        if (options.pathButtonVisible) {
            return true;
        }

        const items = options.breadCrumbsItems;
        return (
            (!!items && ((!options.withoutBackButton && items.length > 0) || items.length > 1)) ||
            (!!options.rootVisible && options.pathHomeButtonVisible !== false)
        );
    }
}
