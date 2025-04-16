import { IRange } from 'Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps';

export interface IRangeSlice {
    setRange: (range: IRange) => void;
    get range(): IRange;
}
