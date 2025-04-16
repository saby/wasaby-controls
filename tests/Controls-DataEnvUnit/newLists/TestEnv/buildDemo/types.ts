import {
    ListSlice,
    IListDataFactoryLoadResult,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/list';
import { ISliceConstructorProps } from 'Controls-DataEnv/dataFactory';
import * as React from 'react';

export type TSliceCtor<
    TSlice extends ListSlice,
    TDataFactoryArguments extends IListDataFactoryArguments,
> = new (
    props: ISliceConstructorProps<IListDataFactoryLoadResult, TDataFactoryArguments>
) => TSlice;

export type TDemoComponentType<TSlice extends ListSlice> = React.FC<
    TDemoComponentTypeProps<TSlice>
>;
export type TDemoComponentTypeProps<TSlice extends ListSlice> = {
    storeId: string;
    waitForRender: (promise: Promise<void>) => void;
    slice: TSlice;
};
