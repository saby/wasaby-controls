import { Memory } from 'Types/source';
import { type adapter, Model } from 'Types/entity';

export interface IFieldItem {
    Id: number;
    DisplayName: string;
    Description?: string;
    Title: string;
    View?: string;
    Type?: string;
    Parent: number;
    Parent_: boolean;
    Hierarchy?: boolean;
    Options?: {};
    Substitution?: {};
}

interface ISourceSearch {
    title: string;
    Id?: number[];
    Parent?: number;
    Parent_?: boolean;
    isTreeFilter?: boolean;
}

function searchSimpleFilter(
    field: IFieldItem,
    { title, Id, Parent_, isTreeFilter }: ISourceSearch,
    groups: Record<string, IFieldItem[]>
): boolean {
    if (!field) return false;
    let found = true;
    if (Parent_ === false) {
        found = !field.Parent_;
    }
    if (found && title) {
        const search = title.toLocaleLowerCase();
        found =
            field.DisplayName?.toLowerCase().includes(search) ||
            field.Title?.toLowerCase().includes(search);

        if (!found && isTreeFilter) {
            if (field.Parent_) {
                const children = groups[field.Id];
                return (
                    children?.some((child) =>
                        searchSimpleFilter(child, { title, isTreeFilter }, groups)
                    ) || false
                );
            }
        }
    }
    if (found && Id?.length) {
        found = Id.includes(field.Id);
    }

    return found;
}

export function createFieldsSource(fields: IFieldItem[]): Memory {
    const filters = [searchSimpleFilter];
    const groups: Record<number, IFieldItem[]> = fields.reduce((acc, field) => {
        if (field.Parent) {
            const group = acc[field.Parent] || [];
            group.push(field);
            acc[field.Parent] = group;
        }
        return acc;
    }, {} as Record<number, IFieldItem[]>);
    const sourceFilter = (item: adapter.IRecord, query: ISourceSearch) => {
        const field = item.getData() as IFieldItem;
        return filters.every((filter) => filter(field, query, groups));
    };

    return new Memory({
        keyProperty: 'Id',
        data: fields,
        filter: sourceFilter,
    });
}

export class PathGetter {
    constructor(private data: IFieldItem[]) {}

    findItem(id: number): IFieldItem {
        return this.data.find((item) => item.Id === id);
    }

    getPath(id: number, includeCurrent: boolean) {
        let val = this.findItem(id);
        if (!val) return [];

        const path = includeCurrent ? [val] : [];

        while (val.Parent) {
            val = this.findItem(val.Parent);
            if (!val) break;
            path.unshift(val);
        }

        return path.map(
            (item) =>
                new Model({
                    rawData: item,
                    keyProperty: 'Id',
                })
        );
    }
}
