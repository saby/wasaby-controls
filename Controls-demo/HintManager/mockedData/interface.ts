import { IStepModel } from 'Controls/hintManager';
import type { Model } from 'Types/entity';

export interface IOnBeforeOpenCallbackParams {
    step: Model<IStepModel>
}
