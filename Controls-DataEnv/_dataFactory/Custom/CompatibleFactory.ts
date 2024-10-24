import { default as CustomFactory } from './Factory';
import { Slice } from 'Controls-DataEnv/slice';

/**
 * Совместимый слайс для старого описания данных переключаемых областей (с type = 'custom')
 */
class CompatibleCustomSLice extends Slice {
    readonly '[ICompatibleSlice]': boolean = true;
}

/**
 * @private
 */
//@ts-ignore
export default class CompatibleCustom extends CustomFactory {
    static slice = CompatibleCustomSLice;
}
