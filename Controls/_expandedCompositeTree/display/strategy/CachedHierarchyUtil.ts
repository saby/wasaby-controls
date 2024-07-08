/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { IObject, relation } from 'Types/entity';
import { RecordSet } from 'Types/collection';

type NodeKey = string | number;

export class CachedHierarchy extends relation.Hierarchy {
    private _cache = {};

    setKeyProperty(keyProperty: string): void {
        super.setKeyProperty(keyProperty);
        this._resetCache();
    }

    setParentProperty(parentProperty: string): void {
        super.setParentProperty(parentProperty);
        this._resetCache();
    }

    setNodeProperty(nodeProperty: string): void {
        super.setNodeProperty(nodeProperty);
        this._resetCache();
    }

    setDeclaredChildrenProperty(declaredChildrenProperty: string): void {
        super.setDeclaredChildrenProperty(declaredChildrenProperty);
        this._resetCache();
    }

    getChildren(parent: IObject | NodeKey, rs: RecordSet): IObject[] {
        let parentId;

        if (typeof parent === 'undefined') {
            return [];
        } else {
            parentId = this._asField(parent as any, this._$keyProperty);
        }

        if (!this._cache[parentId]) {
            this._cache[parentId] = super.getChildren(parent, rs);
        }
        return this._cache[parentId];
    }

    resetCache(): void {
        this._resetCache();
    }

    destroy(): void {
        this._resetCache();
        super.destroy();
    }

    private _resetCache(): void {
        this._cache = {};
    }
}
