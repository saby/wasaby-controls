import MaskViewModel from 'Controls/_input/DateTime/MaskViewModel';
import Mask from 'Controls/_input/Mask';

class Component extends Mask {
    protected _getViewModelConstructor() {
        return MaskViewModel;
    }
};

export default Component;
