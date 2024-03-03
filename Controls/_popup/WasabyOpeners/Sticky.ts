import BaseOpener from './BaseOpener';
import Sticky from '../Openers/Sticky';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';

export default class StickyOpener extends BaseOpener<IStickyPopupOptions> {
    protected _popupOpener: Sticky = new Sticky();

    static openPopup(popupOptions: IStickyPopupOptions): Promise<string | void | Error> {
        return new Sticky().open(popupOptions);
    }
}
