import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import {
    getData as getCountriesData,
    TItem,
} from 'Controls-demo/gridReact/resources/CountriesData';

export const STICKY_ITEM_INDEX = 5;

function getData(): TItem[] {
    return getCountriesData().map((item, index) => {
        const country =
            index % STICKY_ITEM_INDEX === 0 ? `${item.country} - sticked` : item.country;
        return {
            ...item,
            country,
        };
    });
}

export function getSource(): Memory {
    return new Memory({
        keyProperty: 'key',
        data: getData(),
    });
}

export function getItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: getData(),
    });
}
