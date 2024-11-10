import { RecordSet } from 'Types/collection';
import { IColumnConfig } from 'Controls/gridReact';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export function getBaseRecordSet(): RecordSet {
    return new RecordSet({
        rawData: Flat.getData(),
        keyProperty: 'key',
    });
}

export function getBaseColumns(): IColumnConfig[] {
    // Чтобы проверка isReactView прошла
    return Flat.getColumns().map((it) => {
        return { displayProperty: it.displayProperty, key: it.displayProperty };
    });
}
