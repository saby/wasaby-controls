import BaseOpener from './BaseOpener';
import Infobox from '../Openers/Infobox';
import { IInfoBoxPopupOptions } from 'Controls/_popup/interface/IInfoBoxOpener';

export default class InfoBoxOpener extends BaseOpener<IInfoBoxPopupOptions> {
    protected _popupOpener: Infobox = new Infobox();

    static openPopup(popupOptions: IInfoBoxPopupOptions): Promise<string | void | Error> {
        return new Infobox().open(popupOptions);
    }

    static closePopup(): void {
        new Infobox().close(0);
    }
}
