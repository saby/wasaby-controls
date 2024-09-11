/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import BaseOpener from './BaseOpener';
import Infobox from '../Openers/Infobox';
import { IInfoBoxPopupOptions } from 'Controls/_popup/interface/IInfoBoxOpener';

/**
 * Хелпер для открытия информационного окна.
 * @class Controls/_popup/Infobox
 * @implements Controls/popup:IInfoBoxOptions
 * @implements Controls/popup:IInfoBoxOpener
 * @demo Controls-demo/InfoBox/InfoBox
 *
 * @public
 */
export default class InfoBoxOpener extends BaseOpener<IInfoBoxPopupOptions> {
    protected _popupOpener: Infobox = new Infobox();

    static openPopup(popupOptions: IInfoBoxPopupOptions): Promise<string | void | Error> {
        return new Infobox().open(popupOptions);
    }

    static closePopup(): void {
        new Infobox().close(0);
    }
}
