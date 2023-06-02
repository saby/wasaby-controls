/**
 * @kaizen_zone 0ad19bb5-20cc-4d4e-90b9-eb7a0aa12d81
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_ExpandableSearch/Search');
import { EventUtils } from 'UI/Events';
import { SyntheticEvent } from 'Vdom/Vdom';
import { ITextOptions, IBaseOptions } from 'Controls/input';
import {
    IRenderOptions,
    IPaddingOptions,
    ITagOptions,
} from 'Controls/interface';
import { Input } from 'Controls/search';
import 'css!Controls/search';

interface IExpandableSearchOptions
    extends IControlOptions,
            IBaseOptions,
            ITextOptions,
            IRenderOptions,
            IPaddingOptions,
            ITagOptions {
    /**
     * @name Controls/ExpandableSearch#inlineWidth
     * @cfg {String} Ширина строки поиска.
     * @variant s Строка поиска малой ширины.
     * @variant l Строка поиска большой ширины.
     * @default s
     * @demo Controls-demo/Search/ExpandableInput/InlineWidth/Index
     */
    inlineWidth?: string;
    /**
     * @name Controls/ExpandableSearch#expanded
     * @cfg {Boolean} Состояние развернутости строки поиска.
     * @variant false Строка поиска свернута.
     * @variant true Строка поиска развернута.
     * @default false
     */
    expanded?: boolean;

    /**
     * @name Controls/ExpandableSearch#contrastBackground
     * @cfg {Boolean} Определяет контрастность кнопки отображения строки поиска по отношению к её окружению.
     * @variant false Прозрачный фон кнопки
     * @variant true Кнопка отображается с фоном и обводкой
     * @default false
     */
    contrastBackground: boolean;

    /**
     * @name Controls/ExpandableSearch#searchInputDirection
     * @cfg {Boolean} Определяет направление разворота строки поиска.
     * @variant left Строка поиска при клике на кнопку разворота расширяется влево.
     * @variant right Строка поиска при клике на кнопку разворота расширяется вправо.
     * @default right
     */
    searchInputDirection: string;

    /**
     * @name Controls/ExpandableSearch#shadowVisible
     * @cfg {Boolean} Определяет внешний вид строки поиска.
     * @variant true Строка поиска отображается с тенью, кнопка отображения строки поиска с заливкой.
     * @variant false Строка поиска отображается с обводкой, кнопка отображения строки поиска без заливки.
     * @default false
     */
    shadowVisible: boolean;
}
/**
 * Контрол "Разворачиваемый поиск". Является однострочным полем ввода. Контрол используют в реестрах для ввода поискового запроса.
 *
 * @extends UI/Base:Control
 * @implements Controls/search:Input
 * @implements Controls/search:IExpandableInput
 * @public
 * @demo Controls-demo/Search/ExpandableInput/Index
 */

export default class ExpandableSearch extends Control<IExpandableSearchOptions> {
    protected _expanded: boolean = false;
    protected _template: TemplateFunction = template;
    protected _tmplNotify: Function = EventUtils.tmplNotify;
    protected _children: {
        searchInput: Input;
    };

    protected _beforeMount(options: IExpandableSearchOptions): void {
        this._expanded = this._getExpanded(options.expanded);
    }

    reset(collapse?: boolean): void {
        if (this._expanded) {
            this._children.searchInput.reset();
            if (collapse) {
                this._expanded = false;
                this._notifyExpandedChanged();
            }
        }
    }

    private _getExpanded(expanedOption?: boolean): boolean {
        return typeof expanedOption !== 'undefined'
            ? expanedOption
            : this._expanded;
    }

    protected _afterUpdate(): void {
        if (this._expanded && this._children.searchInput) {
            this._children.searchInput.activate({ enableScreenKeyboard: true });
        }
    }

    protected _searchClick(event: SyntheticEvent): void {
        event.stopPropagation();
        this._expanded = true;
        this._notifyExpandedChanged();
    }

    protected _handleCloseClick(): void {
        this.reset();
        this._expanded = false;
        this._notifyExpandedChanged();
    }

    protected _notifyExpandedChanged(): void {
        this._notify('expandedChanged', [this._expanded]);
    }

    protected _getInlineWidthClasses(): string {
        if (typeof this._options.inlineWidth === 'string') {
            return `controls-Search-inlineWidth-${this._options.inlineWidth}`;
        }
        return '';
    }

    protected _getInlineWidthStyles(): string {
        if (typeof this._options.inlineWidth === 'number') {
            return `width: ${this._options.inlineWidth}px;`;
        }
        return '';
    }

    protected _getIconSize(inlineHeight: string): string {
        if (['s', 'xs', 'm', 'default'].includes(inlineHeight)) {
            return '2xs';
        } else if (inlineHeight === 'l') {
            return 'm_trigger';
        } else if (['xl', '2xl', '3xl'].includes(inlineHeight)) {
            return 'm';
        }
    }

    static getDefaultOptions(): object {
        return {
            inlineWidth: 's',
            inlineHeight: 'default',
            expanded: false,
            searchButtonAlign: 'left',
            horizontalPadding: '2xs',
            contrastBackground: false,
            searchInputDirection: 'right',
            shadowVisible: false
        };
    }
}
