/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import BreadcrumbsItemRow from './BreadcrumbsItemRow';
import SearchGridDataRow from './SearchGridDataRow';
import { Model } from 'Types/entity';
import { GridCell } from 'Controls/grid';
import { TreeGridDataRow } from 'Controls/treeGrid';

const notRewriteProperties = ['getLevel', 'getParent', 'shouldDisplayExpanderBlock'];
function injectSource(instance, bindInstance, source) {
    if (!source) {
        return;
    }

    const proto = Object.getPrototypeOf(source);

    if (proto && proto.constructor !== Object) {
        injectSource(instance, bindInstance, proto);
    }

    for (const nameProperty of Object.getOwnPropertyNames(source)) {
        const description = Object.getOwnPropertyDescriptor(source, nameProperty);

        if (
            typeof description.value === 'function' &&
            !notRewriteProperties.includes(nameProperty)
        ) {
            instance[nameProperty] = source[nameProperty].bind(bindInstance);
        }
    }
}

export interface IOptions<T extends Model> {
    source: SearchGridDataRow<T>;
    parent?: SearchGridDataRow<T> | BreadcrumbsItemRow<T>;
    multiSelectVisibility: string;
    multiSelectAccessibilityProperty: string;
}

/**
 * Tree item which is just a decorator for another one
 * @class Controls/_searchBreadcrumbsGrid/TreeGridItemDecorator
 * @extends Controls/_searchBreadcrumbsGrid/SearchGridDataRow
 * @private
 */
export default class TreeGridItemDecorator<T extends Model> extends SearchGridDataRow<T> {
    protected _$source: SearchGridDataRow<T>;

    constructor(options?: IOptions<T>) {
        super({
            contents: options?.source?.contents,
            multiSelectVisibility: options?.multiSelectVisibility,
            multiSelectAccessibilityProperty: options?.multiSelectAccessibilityProperty,
        });
        this._$source = options?.source;
        this._$parent = options?.parent;

        // Декоратор нужен, чтобы задать правильный parent для item-a, при этом не испортив оригинальный item
        // Прокидываем все методы из оригинального item-a в decorator, за исключением методов, связанных с parent
        injectSource(this, this._$source, this._$source);
    }

    getSource(): SearchGridDataRow<T> {
        return this._$source;
    }

    shouldDisplayExpanderBlock(): boolean {
        // Для детей хлебной крошки должен рисоваться всегда один отступ
        return true;
    }
}

Object.assign(TreeGridItemDecorator.prototype, {
    '[Controls/_searchBreadcrumbsGrid/TreeGridItemDecorator]': true,
    '[Controls/_baseTree/TreeItemDecorator]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:TreeGridItemDecorator',
    _$source: undefined,
});
