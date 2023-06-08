import {
    IBaseDataFactoryArguments,
    IDataFactory,
} from '../interface/IDataFactory';

export interface ICustomDataFactoryArguments extends IBaseDataFactoryArguments {
    loadDataMethod: Function;
    loadDataMethodArguments: unknown;
    dependencies?: string[];
}
export type ICustomDataFactory = IDataFactory<
    unknown,
    ICustomDataFactoryArguments
>;
