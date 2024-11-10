/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import BreadcrumbsItemRow from './BreadcrumbsItemRow';
import SearchGridDataRow from './SearchGridDataRow';
import { Model } from 'Types/entity';
import { TreeItem } from 'Controls/baseTree';

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

    /**
     * Возвращает уровень вложенности относительно корня,
     * с учётом того, что в поиске уровень смещается из-за хлебных крошек.
     * Актуально, когда в поиске вернули "скрытые" узлы с иерархическим отступом.
     */
    getLevel(): number {
        let parent = this._$parent;
        if (parent) {
            let parentLevel = parent.getLevel();
            // Если прямой родитель - не крошка
            if (!parent['[Controls/_baseTree/BreadcrumbsItem]'] && parentLevel > 0) {
                // ищем ближайший узел
                let levelsFromBreadcrumb = 1;
                while (!parent.isNode() && !parent.isRoot()) {
                    parent = parent.getParent();
                    levelsFromBreadcrumb++;
                }
                // Если нашли узел, значит это крошка, а если его уровень больше 1, то
                // у крошки много уровней вложенности.
                // В этом случае считаем уровни от крошки, а не от корня
                if (parent.isNode() && parent.getLevel() > 1) {
                    parentLevel = levelsFromBreadcrumb;
                }
            }
            return parentLevel + 1;
        }

        // If this is a root then get its level from owner
        const owner = this.getOwner();
        return owner ? owner.getRootLevel() : 0;
    }
}

Object.assign(TreeGridItemDecorator.prototype, {
    '[Controls/_searchBreadcrumbsGrid/TreeGridItemDecorator]': true,
    '[Controls/_baseTree/TreeItemDecorator]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:TreeGridItemDecorator',
    _$source: undefined,
});
