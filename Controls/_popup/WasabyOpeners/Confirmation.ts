import BaseOpener from './BaseOpener';
import Confirmation from '../Openers/Confirmation';
import { IConfirmationOptions } from 'Controls/_popup/interface/IConfirmation';

export default class ConfirmationOpener extends BaseOpener<IConfirmationOptions> {
    protected _popupOpener: Confirmation = new Confirmation();

    protected _beforeUnmount(): void {
        return;
    }

    static openPopup(popupOptions: IConfirmationOptions, opener): Promise<string | void | Error> {
        return new Confirmation().open({...popupOptions, opener});
    }
}
