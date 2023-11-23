import { Memory } from 'Types/source';
import type { adapter } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { NameBindingType } from 'Controls/interface';

export const IFieldItemKeyProperty = 'Id';
export const IFieldItemDisplayProperty = 'DisplayName';

/**
 * Описание поля
 */
export interface IFieldItem {
    Id: string;
    /**
     * Для визуального представления в списке
     * @remark Моё поле
     */
    DisplayName: string;
    /**
     * Полное название поля
     * @remark Пользовательские данные.Моё поле
     */
    FullDisplayName: string;
    /**
     * Привязка
     * @remark [UserData, 'Моё поле']
     */
    Data: NameBindingType;
    Description?: string;
    View?: string;
    Type?: string;
    Parent: string;
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
            field[IFieldItemDisplayProperty]?.toLowerCase().includes(search) ||
            field.FullDisplayName?.toLowerCase().includes(search);

        if (!found && isTreeFilter) {
            if (field.Parent_) {
                const children = groups[field[IFieldItemKeyProperty]];
                return (
                    children?.some((child) =>
                        searchFieldsFilter(child, { title, isTreeFilter }, groups)
                    ) || false
                );
            }
        }
    }
    if (found && Id?.length) {
        found = Id.includes(field[IFieldItemKeyProperty]);
    }

    return found;
}

/**
 * Создаёт источник {@link Types/source:Memory Memory} из массива полей.
 * @param fields Массив полей
 * @param fieldsFilter Функция предварительной фильтрации полей
 */
export function createFieldsSource(
    fields: IFieldItem[],
    fieldsFilter: (item: IFieldItem) => boolean = () => true
): Memory {
    const data = fields.filter((x) => fieldsFilter(x));
    const groups: Record<number, IFieldItem[]> = data.reduce((acc, field) => {
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
        keyProperty: IFieldItemKeyProperty,
        data,
        filter: sourceFilter,
    });
}

export function createFieldsRecordSet(
    fields: IFieldItem[],
    fieldsFilter: (item: IFieldItem) => boolean = () => true
): RecordSet {
    const data = fields.filter((x) => fieldsFilter(x));
    return new RecordSet({
        keyProperty: IFieldItemKeyProperty,
        rawData: data,
    });
}
