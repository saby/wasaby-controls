import { Confirmation } from 'Controls/popup';
import { IOnBeforeOpenCallbackParams } from 'Controls-demo/HintManager/mockedData/interface';

function onBeforeOpenCallback(params: IOnBeforeOpenCallbackParams): Promise<boolean> {
    const { step } = params;
    return Confirmation.openPopup({
        message: `Идентификатор шага: ${step.get('id')}`,
        type: 'ok'
    });
}

export { onBeforeOpenCallback };
