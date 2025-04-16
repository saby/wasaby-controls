/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import MaskViewModel from 'Controls/_date/BaseInput/MaskViewModel';
import { Mask } from 'Controls/input';

class Component extends Mask {
    protected _getViewModelConstructor(): MaskViewModel {
        return MaskViewModel;
    }

    protected _getViewModelOptions(options: object): object {
        const defaultConfig = super._getViewModelOptions(options);
        return {
            ...defaultConfig,
            selectionStart: options.selectionStart,
            selectionEnd: options.selectionEnd,
            calendarButtonVisible: options.calendarButtonVisible,
        };
    }
}

export default Component;
