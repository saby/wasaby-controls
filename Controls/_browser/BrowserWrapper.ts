/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/BrowserWrapper';
import { default as ControlsBrowser } from 'Controls/_browser/Browser';
import { ControllerClass as FilterController } from 'Controls/filterOld';

/**
 * Контрол "Браузер" обеспечивает связь между списком (см. {@link Controls/list:View Плоский список}, {@link Controls/grid:View Таблица}, {@link Controls/treeGrid:View Дерево}, {@link Controls/tile:View Плитка} и {@link Controls/explorer:View Иерархический проводник}) и контролами его окружения, таких как {@link Controls/search:Input Строка поиска}, {@link Controls/breadcrumbs:Path Хлебные крошки}, {@link Controls/operations:Panel Панель действий} и {@link Controls/filter:View Объединенный фильтр}.
 * @public
 * @class Controls/_browser/Browser
 * @implements Controls/browser:IBrowser
 * @implements Controls/interface:IExpandedItems
 *
 * @demo Controls-Deprecated-demo/Search/Container
 */

export default class BrowserWrapper extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    // @ts-ignore
    protected _children: Record<string, ControlsBrowser> = {
        // @ts-ignore
        browser: ControlsBrowser,
    };

    resetPrefetch(): void {
        return this._children.browser.resetPrefetch();
    }

    getFilterController(listId?: string): FilterController {
        return this._children.browser.getFilterController(listId);
    }
}
