/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Memory } from 'Types/source';
import { TKey } from 'Controls/interface';
import { Path } from 'Controls/dataSource';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { controller as localeController } from 'I18n/i18n';
import { applyHighlighter } from 'Controls/_breadcrumbs/resources/applyHighlighter';
import { Opener as NavigationMenuOpener } from 'Controls/_breadcrumbs/NavigationMenu/Opener';
import { IVisibleItem } from 'Controls/_breadcrumbs/PrepareDataUtil';
import template = require('wml!Controls/_breadcrumbs/View/View');
import itemTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemTemplate');
import itemsTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemsTemplate');
import calculatedItemsTemplate = require('wml!Controls/_breadcrumbs/View/resources/calculatedItemsTemplate');
import 'css!Controls/breadcrumbs';
import Common from 'Controls/_breadcrumbs/HeadingPath/Common';

const CRUMBS_COUNT = 2;
const MIN_COUNT_OF_LETTER = 3;

// noinspection NonAsciiCharacters
interface ISourceItem {
    displayProperty: string;
    node: boolean;
    parent: TKey;
    'Только узлы': boolean;
    [key: string]: unknown;
}

interface IBreadCrumbsView extends IControlOptions {
    items?: Path;
    visibleItems?: IVisibleItem[];
    keyProperty?: string;
    parentProperty?: string;
    displayProperty?: string;
    highlighter?: Function | Function[];
}

/**
 * BreadCrumbs/View.
 *
 * @class Controls/_breadcrumbs/View
 * @extends UI/Base:Control
 * @mixes Controls/breadcrumbs:IBreadCrumbs
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 *
 * @private
 */

class BreadCrumbsView extends Control<IBreadCrumbsView> {
    protected _template: TemplateFunction = template;
    protected _itemsTemplate: TemplateFunction = itemsTemplate;
    protected _calculatedItemsTemplate: TemplateFunction = calculatedItemsTemplate;
    protected _popupIsOpen: boolean = false;
    private _menuOpener: NavigationMenuOpener;
    protected _items: IVisibleItem[];
    protected _highlightItemsClass: { [id: string]: string } = {};
    protected _reverseArrows: boolean = false;

    protected _beforeMount(options: IBreadCrumbsView): void {
        this._items = options.visibleItems;
        this._addWithOverflow(options.displayProperty);
        // Эта функция передаётся по ссылке в Opener, так что нужно биндить this, чтобы не потерять его
        this._handleNavMenuResult = this._handleNavMenuResult.bind(this);
        this._menuOpener = new NavigationMenuOpener();
        this._reverseArrows = localeController.currentLocaleConfig.directionality === 'rtl';
    }
    protected _beforeUpdate(newOptions: IBreadCrumbsView): void {
        if (newOptions.visibleItems !== this._items) {
            this._items = newOptions.visibleItems;
            this._addWithOverflow(newOptions.displayProperty);
        }
    }
    private _addWithOverflow(displayProperty: string): void {
        if (this._items.length <= CRUMBS_COUNT) {
            this._items.forEach((item) => {
                const itemLength = item.item.get(displayProperty)?.length || 0;
                if (!item.isDots && itemLength > MIN_COUNT_OF_LETTER) {
                    item.withOverflow = true;
                }
            });
        }
    }

    protected _afterMount(options?: IControlOptions): void {
        RegisterUtil(this, 'customscroll', this._scrollHandler.bind(this));
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'customscroll');
        this._menuOpener.destroy();
    }

    private _scrollHandler(): void {
        this._menuOpener.close();
    }

    protected _onItemClick(e: SyntheticEvent<Event>, itemData: IVisibleItem): void {
        e.stopSyntheticEvent();
        if (!this._options.readOnly) {
            this._notify('itemClick', [itemData.item]);
        } else {
            // Если мы не обработали клик по хлебным крошкам (например они readOnly),
            // то не блокируем событие клика, но делаем его не всплывающим
            this._notify('customClick', []);
        }
    }

    protected _afterRender(oldOptions: IBreadCrumbsView): void {
        if (oldOptions.visibleItems !== this._options.visibleItems) {
            // Если крошки пропали (стало 0 записей), либо наоборот появились (стало больше 0 записей), кинем ресайз,
            // т.к. изменится высота контрола
            if (!this._options.visibleItems.length || !oldOptions.visibleItems.length) {
                this._notify('controlResize', [], { bubbling: true });
            }
        }
    }

    // На mousedown (зажатии кнопки мыши над точками) должно открываться только меню хлебных крошек.
    // Но так как мы не стопим другие клики срабатывает проваливание.
    // Поэтому прекращаем распространение события клика:
    protected _clickHandler(e: SyntheticEvent<MouseEvent>): void {
        e.stopSyntheticEvent();
        e.nativeEvent.stopPropagation();
    }

    /**
     * Обработчик клика по '...', показывает навигационное меню с полным путем.
     */
    protected _dotsClick(e: SyntheticEvent<MouseEvent>): void {
        e.nativeEvent.stopPropagation();
        let parent = null;
        const data = this._options.items.map((item) => {
            const newItem = {} as ISourceItem;

            item.each((field) => {
                newItem[field] = item.get(field);
            });

            newItem.node = true;
            newItem.parent = parent;
            newItem['Только узлы'] = true;
            newItem.displayProperty = this._options.displayProperty;

            parent = item.getKey();

            return newItem;
        });

        if (this._popupIsOpen) {
            this._menuOpener.close();
            return;
        }

        const keyProperty = this._options.items[0].getKeyProperty();
        this._menuOpener.open(this, e.currentTarget as HTMLElement, {
            eventHandlers: {
                onResult: this._handleNavMenuResult,
                onOpen: () => {
                    this._popupIsOpen = true;
                },
                onClose: () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (!this._destroyed) {
                        this._popupIsOpen = false;
                    }
                },
            },
            templateOptions: {
                source: new Memory({
                    data,
                    keyProperty,
                    // Т.к. NavigationMenu использует selectedKeys для простановки маркера, то это добавляет
                    // в фильтр запроса дополнительный параметр 'entries' что ломает получение данных из
                    // это источника т.к. у нас в данных нет поля 'entries'.
                    filter: () => {
                        return true;
                    },
                }),
                keyProperty,
                nodeProperty: 'node',
                parentProperty: 'parent',
                path: this._options.items,
                readOnly: this._options.readOnly,
                displayProperty: this._options.displayProperty,
            },
        });
    }

    protected _onItemMouseEnter(event: SyntheticEvent, item: IVisibleItem): void {
        const itemKey = item.item.get(this._options.keyProperty);

        // 1. Сначала событие
        this._notify('hoveredItemChanged', [item.item]);
        // 2. Потом запуск highlighter
        const highlightedValue = !this._options.highlighter
            ? undefined
            : applyHighlighter(this._options.highlighter, itemKey, item.hasArrow);

        if (highlightedValue) {
            this._highlightItemsClass[itemKey] = highlightedValue;
            this._highlightItemsClass = { ...this._highlightItemsClass };
        }
    }

    protected _onItemMouseLive(event: SyntheticEvent, item: IVisibleItem): void {
        const itemKey = item.item.get(this._options.keyProperty);

        if (itemKey in this._highlightItemsClass) {
            delete this._highlightItemsClass[itemKey];
            this._highlightItemsClass = { ...this._highlightItemsClass };
        }

        this._notify('hoveredItemChanged');
    }

    /**
     * Обработчик выбора раздела из навигационного меню, открываемого при клике по "...".
     * @param {Path} path - полный путь относительно итема, который выбрали через навигационное меню
     */
    private _handleNavMenuResult(path: Path): void {
        let item;

        if (path.length) {
            const itemId = path[path.length - 1].getKey();
            // Данные итема, которые уйдут в событии itemClick, берем из исходного набора
            item = this._options.items.find((i) => {
                return i.getKey() === itemId;
            });
        } else {
            item = Common.getRootModel(
                this._options.items[0].get(this._options.parentProperty),
                this._options.keyProperty
            );
        }

        this._notify('itemClick', [item]);
        this._menuOpener.close();
    }

    static _styles: string[] = ['Controls/_breadcrumbs/resources/FontLoadUtil'];

    static getDefaultOptions(): object {
        return {
            itemTemplate,
            backgroundStyle: 'default',
            displayMode: 'default',
            fontSize: 'xs',
        };
    }
}

/**
 * @name Controls/_breadcrumbs/View#fontSize
 * @cfg {String} Размер шрифта.
 * @demo Controls-demo/BreadCrumbs/FontSize/Index
 */

export default BreadCrumbsView;
