import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { getDataSetColumns } from './getDataSetColumns';
import { DataSetBindingFacade } from 'Frame/base';

type TUserDataSetColumns = [RecordSet | undefined];

/**
 * Хук для получения списка колонок выборки
 * @param bindingFacade
 */
function useDataSetColumns(
    bindingFacade: DataSetBindingFacade,
    aggregateFields?: boolean
): TUserDataSetColumns {
    const [columns, setColumns] = React.useState<RecordSet>();
    const [lastCallHash, setLastCallHash] = React.useState<string>();

    React.useEffect(() => {
        if (!bindingFacade) {
            return;
        }

        const currentCallHash = getCallHash(bindingFacade, aggregateFields);
        if (currentCallHash === lastCallHash) {
            return;
        }

        getDataSetColumns(bindingFacade, aggregateFields).then((res) => {
            setColumns(res);
            setLastCallHash(currentCallHash);
        });
    }, [bindingFacade]);

    if (!bindingFacade) {
        return [undefined];
    }

    return [columns];
}

/**
 * Вычисляет хеш аргументов вызова метода, для определения уникального вызова
 * @private
 */
function getCallHash(bindingFacade: DataSetBindingFacade, aggregateFields?: boolean): string {
    return `${bindingFacade.getDataSetName()}_${aggregateFields}`;
}

export { useDataSetColumns };
