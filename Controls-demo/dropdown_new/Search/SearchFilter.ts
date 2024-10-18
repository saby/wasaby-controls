import { Model } from 'Types/entity';

export default function searchFilter(item: Model, queryFilter: { title?: string }): boolean {
    if (queryFilter.title) {
        return item.get('title').toLowerCase().includes(queryFilter.title.toLowerCase());
    }
    return true;
}
