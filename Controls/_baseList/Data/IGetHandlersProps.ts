import { ListSlice } from 'Controls/dataFactory';

export interface IGetHandlersProps {
    slice: ListSlice;
    changeRootByItemClick?: boolean;
    context: Record<string | symbol, unknown>;
}
