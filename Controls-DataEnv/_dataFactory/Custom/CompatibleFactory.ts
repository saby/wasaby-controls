import { default as CustomFactory } from './Factory';
import CustomSLice from './Slice';

class CompatibleCustomSLice extends CustomSLice {
    readonly '[ICompatibleSlice]': boolean = true;
}

export default {
    loadData: CustomFactory.loadData,
    slice: CompatibleCustomSLice,
};
