import { default as CustomFactory } from './Factory';
import { Slice } from 'Controls-DataEnv/slice';

class CompatibleCustomSLice extends Slice {
    readonly '[ICompatibleSlice]': boolean = true;
}

export default {
    loadData: CustomFactory.loadData,
    slice: CompatibleCustomSLice,
};
