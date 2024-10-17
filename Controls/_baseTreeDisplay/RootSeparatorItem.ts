/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import TreeItem from './TreeItem';
import { IOptions } from './Tree';
import { register } from 'Types/di';
import { IGroupNode } from 'Controls/display';

import { Model } from 'Types/entity';

/**
 * Разделитель записей из корня.
 * Используется при поиске в дереве без колонок, а также в композитном списке
 * для визуального отделения записей, отображаемых в корне списка от записей последнего узла.
 * @private
 */
export default class RootSeparatorItem<T extends Model = Model>
    extends TreeItem<T>
    implements IGroupNode
{
    readonly '[Controls/_display/SearchSeparator]': boolean = true;
    readonly '[Controls/_baseTreeDisplay/RootSeparatorItem]': boolean = true;

    readonly EditableItem: boolean = false;

    get Markable(): boolean {
        return false;
    }

    readonly Fadable: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = false;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly SupportItemActions: boolean = false;
    readonly GroupNodeItem: boolean = false;
    readonly ActivatableItem: boolean = false;

    protected _$template: TemplateFunction | string;

    protected _instancePrefix: 'root-separator-item-';

    constructor(options?: IOptions<T>) {
        super(options);
    }

    /**
     * Возвращает шаблон записи.
     * @param itemTemplateProperty
     * @param userTemplate
     */
    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return this._$template || userTemplate;
    }

    // region TreeItem

    /**
     * Уникальный идентификатор записи.
     */
    getUid(): string {
        return `searchSeparator-${this.getContents()}`;
    }

    /**
     * Возвращает флаг состояния редактирования по месту.
     */
    isEditing(): boolean {
        return false;
    }

    /**
     * Возвращает флаг состояния активости.
     */
    isActive(): boolean {
        return false;
    }

    /**
     * Возвращает флаг состояния отмеченности маркером.
     */
    isMarked(): boolean {
        return false;
    }

    /**
     * Возвращает флаг состояния выбранности.
     */
    isSelected(): boolean {
        return false;
    }

    /**
     * Возвращает флаг состояния савайпа по записи.
     */
    isSwiped(): boolean {
        return false;
    }

    /**
     * Уровень вложенности разделителя всегда самый верхний
     */
    getLevel(): number {
        return 0;
    }

    /**
     * Возвращает признак, может ли запись быть узлом-группой
     */
    isGroupNode(): boolean {
        return false;
    }

    /**
     * Возвращает признак видимости чекбокса на записи.
     */
    isVisibleCheckbox(): boolean {
        return false;
    }

    /**
     * Возвращает признак того, является ли запись последней.
     */
    isLastItem(): boolean {
        return false;
    }

    // endregion

    /**
     * Возвращает CSS классы, с которыми будет отрисован разделитель.
     */
    getWrapperClasses(): string {
        let className =
            'controls-ListView__itemV controls-TileView__searchSeparator_wrapper' +
            ' controls-TileView__searchSeparator_wrapper_height-default';
        if (this._$leftPadding) {
            className += ` controls-padding_left-${this._$leftPadding}`;
        }
        return className;
    }
}

Object.assign(RootSeparatorItem.prototype, {
    '[Controls/_display/SearchSeparator]': true,
    '[Controls/_baseTreeDisplay/RootSeparatorItem]': true,
    _moduleName: 'Controls/baseTree:RootSeparatorItem',
    _$source: undefined,
    _$template: null,
});

register('Controls/baseTree:RootSeparatorItem', RootSeparatorItem, {
    instantiate: false,
});
