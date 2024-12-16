/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { ICrudPlus } from 'Types/source';
import { Model, relation } from 'Types/entity';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Path } from 'Controls/dataSource';
import { View as TreeGrid } from 'Controls/treeGrid';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_breadcrumbs/NavigationMenu';
import { NavigationMenuHeader } from 'Controls/_breadcrumbs/NavigationMenuHeader';
import * as React from 'react';
import * as rk from 'i18n!Controls';

export interface INavigationMenu extends IControlOptions {
    /**
     * Кастомный заголовок кнопки 'На главную', расположенной в шапке popup
     * @cfg {String}
     * @default 'На главную'
     * @see headerVisible
     */
    caption?: string;

    /**
     * Значение данного поля регулирует видимость шапки popup
     * @default false
     * @see caption
     */
    headerVisible?: boolean;

    /**
     * Текущий путь, данные которого визуализирует навигационное меню.
     * На последнем элементе пути ставится маркер, а все остальные элементы расхлапываются в дереве каталогов.
     */
    path?: Path;

    source?: ICrudPlus;
    filter?: object;
    sorting?: object;
    navigation?: object;
    keyProperty?: string;
    nodeProperty?: string;
    parentProperty?: string;
    displayProperty?: string;
    hasChildrenProperty?: string;
    navigationMenuTarget?: HTMLElement;
}

/**
 * Компонент навигационного меню используемого для отображения и навигации по дереву каталогов.
 *
 * @private
 */
export default class NavigationMenu extends Control<INavigationMenu> {
    // region base props
    protected _template: TemplateFunction = template;

    protected _children: {
        treeGrid: TreeGrid;
    };

    private _hierarchy: relation.Hierarchy;
    // endregion

    // region template fields
    protected _filter: object;

    protected _selectedKeys: TKey[];

    protected _expandedItems: TKey[] = [];

    protected _itemPadding: object;
    protected _itemsContainerPadding: object;
    protected _header: object[];
    protected _goToRootCallback: Function = this._goToRoot.bind(this);

    // endregion

    protected _beforeMount(
        options?: INavigationMenu,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._itemPadding = {
            left: 's',
        };
        this._itemsContainerPadding = {
            left: 'xs',
            right: 'xs',
        };
        if (options?.headerVisible) {
            this._header = [
                {
                    render: React.createElement(NavigationMenuHeader, {
                        caption: options?.caption,
                        readOnly: options?.readOnly,
                        goToRootCallback: this._goToRootCallback,
                    }),
                    getCellProps: () => {
                        return { beforeContentRender: null };
                    },
                },
            ];
        }
        // noinspection NonAsciiCharacters
        this._filter = { ...options.filter, 'Только узлы': true };

        this._hierarchy = new relation.Hierarchy({
            keyProperty: options.keyProperty,
            parentProperty: options.parentProperty,
            nodeProperty: options.nodeProperty,
        });

        if (options.path?.length) {
            // Вычислим markedKey им будет id последней записи в крошках
            this._selectedKeys = [options.path[options.path.length - 1].getKey()];

            // Так же на основании path вычислим expandedItems, т.к. все узлы до текущего должны быть раскрыты
            this._expandedItems = options.path.map((item) => {
                return item.getKey();
            });
            // Сам текущий узел раскрывать не надо
            this._expandedItems.pop();

            // Обновим рут в фильтре, что бы запрашивались все каталоги от корня, а не от текущей папки
            // в которой находимся
            this._filter[options.parentProperty] = options.path[0][options.parentProperty];
        }
    }
    /**
     * Обработчик клика по кнопке в заголовке. Инициирует переход в корневой каталог.
     */
    protected _goToRoot(): void {
        if (this._options.readOnly) {
            return;
        }

        let root = null;
        const items = this._children.treeGrid.getItems();

        // Если записи есть, то ищем root по иерархии.
        if (items.getCount()) {
            let item: Model;
            // items.at(0) в RecordSet не обязательно первая в отображаемом списке.
            // Бегаем по recordSet, пока не найдём запись, родитель которой отсутствует в recordSet.
            // Будем считать, что это и есть root.
            for (let i = 0; i < items.getCount(); i++) {
                if (!this._hierarchy.hasParent(items.at(i), items)) {
                    item = items.at(i);
                    break;
                }
            }
            if (item) {
                root = item.get(this._options.parentProperty);
            }
        }

        this._changePath(root);
    }

    /**
     * Обработчик клика по записи списка. Инициирует переход в кликнутый каталог.
     */
    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        if (this._options.readOnly) {
            return;
        }

        this._changePath(item.getKey());
    }

    /**
     * При изменении выбранных значений нас интересует последняя добавленная id
     */
    protected _onSelectedKeysChanged(
        event: SyntheticEvent,
        keys: TKey[],
        added: TKey[]
    ): void | TKey {
        if (this._options.readOnly || !added.length) {
            return;
        }

        const key = added[0];
        this._selectedKeys = [key];
        this._changePath(key);
    }

    /**
     * Обработчик клика по крестику закрытия. Инициирует закрытие панели.
     */
    protected _onCloseClick(): void {
        this._notify('close', [], { bubbling: true });
    }

    /**
     * Посылает событие об изменении пути
     */
    private _changePath(root: TKey): void {
        this._notify('sendResult', [this._buildPathByRoot(root)], {
            bubbling: true,
        });
    }

    /**
     * На основании переданного root собирает путь до корня списка каталогов
     */
    private _buildPathByRoot(root: TKey): Path {
        const path = [] as Path;
        const items = this._children.treeGrid.getItems();
        let rootItem = items.getRecordById(root);

        while (rootItem) {
            path.unshift(
                new Model({
                    keyProperty: this._options.keyProperty,
                    rawData: {
                        [this._options.keyProperty]: rootItem.getKey(),
                        [this._options.parentProperty]: rootItem.get(this._options.parentProperty),
                        [this._options.displayProperty]: rootItem.get(
                            this._options.displayProperty
                        ),
                    },
                })
            );

            rootItem = items.getRecordById(rootItem.get(this._options.parentProperty));
        }

        return path;
    }

    static defaultProps: INavigationMenu = {
        headerVisible: false,
        caption: rk('На главную') as string,
    };
}
