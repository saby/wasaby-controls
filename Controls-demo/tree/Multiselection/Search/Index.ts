import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/tree/Multiselection/Search/Search';
import { HierarchicalMemory } from 'Types/source';
import { data } from 'Controls-demo/tree/data/Devices';
import { IObject, relation, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

const HIERARCHY = new relation.Hierarchy({
    keyProperty: 'key',
    parentProperty: 'parent',
    nodeProperty: 'type',
});

const DATA = new RecordSet({ rawData: data, keyProperty: 'key' });

function matchItem(searchTitle: string, item: IObject): boolean {
    const title = item.get('title').toLowerCase();
    return title.indexOf(searchTitle.toLowerCase()) !== -1;
}

function hasFoundChild(searchTitle: string, item: IObject): boolean {
    const children = HIERARCHY.getChildren(item, DATA);
    return children.some((child) => {
        const match = matchItem(searchTitle, item);
        if (match) {
            return true;
        }

        if (HIERARCHY.isNode(child)) {
            return hasFoundChild(searchTitle, child);
        }

        return false;
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data,
            filter: (item, query) => {
                const searchTitle = query?.title;
                if (!searchTitle) {
                    return true;
                }

                const match = matchItem(searchTitle, item);
                if (match) {
                    return true;
                }

                const record = new Model({
                    rawData: item.getData(),
                    keyProperty: 'key',
                });
                if (HIERARCHY.isNode(record)) {
                    return hasFoundChild(searchTitle, record);
                }

                return false;
            },
        });
    }
}
