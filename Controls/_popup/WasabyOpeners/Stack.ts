import BaseOpener, { IBaseOpenerOptions } from './BaseOpener';
import Stack from '../Openers/Stack';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
interface IStackOpenerOptions extends IStackPopupOptions, IBaseOpenerOptions {}

export default class StackOpener extends BaseOpener<IStackOpenerOptions> {
    protected _popupOpener: Stack = new Stack();

    static openPopup(popupOptions: IStackOpenerOptions): Promise<string | void | Error> {
        return new Stack().open(popupOptions);
    }
}
