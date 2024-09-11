import { default as CustomFactory } from './Factory';
import { Slice } from 'Controls-DataEnv/slice';

/**
 * Совместимый слайс для старого описания данных переключаемых областей (с type = 'custom')
 */
class CompatibleCustomSLice extends Slice {
    readonly '[ICompatibleSlice]': boolean = true;
}

export default {
    loadData: CustomFactory.loadData,
    slice: CompatibleCustomSLice,
};
