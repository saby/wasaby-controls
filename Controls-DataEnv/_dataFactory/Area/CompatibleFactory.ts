import { default as AreaFactory } from './Factory';
import { default as AreaSlice } from './Slice';

class CompatibleAreaSLice extends AreaSlice {
    readonly '[ICompatibleSlice]': boolean = true;
}

export default {
    loadData: AreaFactory.loadData,
    slice: CompatibleAreaSLice,
};
