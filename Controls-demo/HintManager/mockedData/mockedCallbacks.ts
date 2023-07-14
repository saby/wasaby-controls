import { Confirmation } from 'Controls/popup';
import { IStepModel } from 'Controls/hintManager';
import type { Model } from 'Types/entity';

interface IOnBeforeOpenCallbackParams {
    step: Model<IStepModel>
}

function onBeforeOpenCallback(params: IOnBeforeOpenCallbackParams): Promise<boolean> {
    const { step } = params;
    return Confirmation.openPopup({
        message: `Идентификатор шага: ${step.get('id')}`,
        type: 'ok'
    });
}

export { onBeforeOpenCallback };
