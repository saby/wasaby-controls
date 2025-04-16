import { useContext, useEffect, ReactElement } from 'react';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { Context as PendingContext, IPendingContext } from 'Controls/Pending';
import { IComponentProps } from 'Controls/interface';
import { default as useSlice } from './hooks/useSlice';

/**
 * Опции контейнера
 * @public
 */
export interface IFormContainerOptions extends IComponentProps {
    storeId: string;
    children?: ReactElement;
}

/**
 * Обертка для работы со слайсом редактирования
 * @public
 */
function Container(props: IFormContainerOptions) {
    const formSlice = useSlice<FormSlice>(props.storeId);
    const pendingContext = useContext(PendingContext) as unknown as IPendingContext;

    useEffect(() => {
        if (formSlice && pendingContext) {
            formSlice.registerAction('registerPending', pendingContext.registerPending);
            formSlice.registerAction(
                'cancelFinishingPending',
                pendingContext.cancelFinishingPending
            );
            formSlice.initChangeRecordPending();
        }
        return () => {
            formSlice?.unregisterAction('registerPending');
            formSlice?.unregisterAction('cancelFinishingPending');
        };
    }, [formSlice, pendingContext]);

    return props.children;
}

export default Container;
