import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { getDataSetColumns } from './getDataSetColumns';
import { BaseBindingFacade } from 'Frame/base';

type TUserDataSetColumns = [RecordSet | undefined];

/**
 * Хук для получения списка колонок выборки
 * @param bindingFacade
 */
function useDataSetColumns(bindingFacade: BaseBindingFacade): TUserDataSetColumns {
    const [columns, setColumns] = React.useState<RecordSet>();

    React.useEffect(() => {
        getDataSetColumns(bindingFacade).then((res) => {
            setColumns(res);
        });
    }, [bindingFacade]);

    if (!bindingFacade) {
        return [undefined];
    }

    return [columns];
}

export { useDataSetColumns };
