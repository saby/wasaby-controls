import { Slice } from 'Controls-DataEnv/slice';
import { ICustomDataFactoryArguments } from './ICustomDataFactory';

export default class CustomSlice extends Slice<unknown> {
    constructor(props) {
        super(props);
    }

    _initState(loadResult: unknown, config: ICustomDataFactoryArguments): unknown {
        return loadResult;
    }
}
