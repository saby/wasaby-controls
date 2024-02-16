import BaseOpener, { IBaseOpenerOptions } from './BaseOpener';
import { IDialogPopupOptions } from 'Controls/_popup/interface/IDialog';
import Dialog from '../Openers/Dialog';

interface IDialogOpenerOptions extends IDialogPopupOptions, IBaseOpenerOptions {}
export default class DialogOpener extends BaseOpener<IDialogOpenerOptions> {
    protected _popupOpener: Dialog = new Dialog();

    static openPopup(popupOptions: IDialogOpenerOptions): Promise<string | void | Error> {
        return new Dialog().open(popupOptions);
    }
}
