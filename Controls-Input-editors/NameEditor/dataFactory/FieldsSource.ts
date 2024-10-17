import { Memory } from 'Types/source';
import { type adapter } from 'Types/entity';

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

export interface IFieldsSearch {
    title: string;
    Id?: number[];
    Parent?: number;
    View?: string | boolean;
    isTreeFilter?: boolean;
}

function searchFieldsFilter(
    field: IFieldItem,
    { title, Id, View, isTreeFilter }: IFieldsSearch,
    groups: Record<string, IFieldItem[]>
): boolean {
    if (!field) return false;
    let found = true;
    if (View === true) {
        found = field.View !== null;
    } else if (View) {
        found = field.View === View;
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
                        searchFieldsFilter(child, { title, isTreeFilter }, groups)
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
    const groups: Record<number, IFieldItem[]> = fields.reduce((acc, field) => {
        if (field.Parent) {
            const group = acc[field.Parent] || [];
            group.push(field);
            acc[field.Parent] = group;
        }
        return acc;
    }, {} as Record<number, IFieldItem[]>);

    const sourceFilter = (item: adapter.IRecord, query: IFieldsSearch) => {
        const field = item.getData() as IFieldItem;
        return searchFieldsFilter(field, query, groups);
    };

    return new Memory({
        keyProperty: 'Id',
        data: fields,
        filter: sourceFilter,
    });
}
