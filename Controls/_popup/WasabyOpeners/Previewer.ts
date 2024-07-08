import BaseOpener from './BaseOpener';
import Previewer from '../Openers/Previewer';
import { IPreviewerPopupOptions } from 'Controls/_popup/interface/IPreviewerOpener';

/**
 * Опенер превьювера, вставляемый в верстку.
 * @implements IPreviewerPopupOptions
 * @private
 */

export default class PreviewerOpener extends BaseOpener<IPreviewerPopupOptions> {
    protected _popupOpener: Previewer = new Previewer();

    static openPopup(
        popupOptions: IPreviewerPopupOptions,
        type: string
    ): Promise<string | void | Error> {
        return new Previewer().open(popupOptions, type);
    }

    static cancelPopup(config: IPreviewerPopupOptions, action: string): void {
        if (config) {
            new Previewer().cancel(action, config);
        }
    }

    static closePopup(config: IPreviewerPopupOptions, type?: string): void {
        if (config) {
            new Previewer().close(config, type);
        }
    }
}
