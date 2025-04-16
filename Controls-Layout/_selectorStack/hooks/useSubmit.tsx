import { useContext, useCallback } from 'react';
import { useSelectSlice } from 'Controls/selector';
import { Context as PopupContext } from 'Controls/popup';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls-DataEnv/list';

export function useSubmit(): () => void {
    const selectSlice = useSelectSlice();
    const { configs, selectedTabKey } = selectSlice.state;
    const storeId = configs[selectedTabKey].storeId;
    const currentListSlice = useSlice<ListSlice>(storeId);
    const popupContext = useContext(PopupContext);

    return useCallback((item?: Model) => {
        return selectSlice.submit(item, currentListSlice?.state).then((result) => {
            popupContext.sendResult(result);
            popupContext.close();
        });
    }, []);
}
