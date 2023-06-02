/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { ICrudPlus } from 'Types/source';
import { Model } from 'Types/entity';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Path } from 'Controls/dataSource';
import { View as TreeGrid } from 'Controls/treeGrid';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_breadcrumbs/NavigationMenu';
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
    // endregion

    // region template fields
    protected _filter: object;

    protected _selectedKeys: TKey[];

    protected _expandedItems: TKey[] = [];
    // endregion

    protected _beforeMount(
        options?: INavigationMenu,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        // noinspection NonAsciiCharacters
        this._filter = { ...options.filter, 'Только узлы': true };

        if (options.path?.length) {
            // Вычислим markedKey им будет id последней записи в крошках
            this._selectedKeys = [
                options.path[options.path.length - 1].getKey(),
            ];

            // Так же на основании path вычислим expandedItems, т.к. все узлы до текущего должны быть раскрыты
            this._expandedItems = options.path.map((item) => {
                return item.getKey();
            });
            // Сам текущий узел раскрывать не надо
            this._expandedItems.pop();

            // Обновим рут в фильтре, что бы запрашивались все каталоги от корня, а не от текущей папки
            // в которой находимся
            this._filter[options.parentProperty] =
                options.path[0][options.parentProperty];
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

        // Если записи есть, то берем у первой parentProperty - это и будет root
        if (items.getCount()) {
            root = items.at(0).get(this._options.parentProperty);
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
                        [this._options.parentProperty]: rootItem.get(
                            this._options.parentProperty
                        ),
                        [this._options.displayProperty]: rootItem.get(
                            this._options.displayProperty
                        ),
                    },
                })
            );

            rootItem = items.getRecordById(
                rootItem.get(this._options.parentProperty)
            );
        }

        return path;
    }

    static defaultProps: INavigationMenu = {
        headerVisible: false,
        caption: rk('На главную') as string,
    };
}
