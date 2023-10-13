/**
 * @kaizen_zone 69fe1fdb-6718-4f49-a543-3ddd8385ec17
 */
import { IOpener } from 'Controls/_popup/interface/IBaseOpener';
import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';

export interface IPreviewerPopupOptions extends IStickyPopupOptions {
    id?: string;
    closingTimerId?: number;
    childClosingIntervalId?: number;
    openingTimerId?: number;
    isCancelOpening?: boolean;
    delay?: number;
}

/**
 * Интерфейс для опций окна предпросмотра.
 *
 * @private
 */
export interface IPreviewerOpener extends IOpener {
    readonly '[Controls/_popup/interface/IPreviewerOpener]': boolean;
}
