import BaseOpener from './BaseOpener';
import ConfirmationOpener from '../Openers/Confirmation';
import { IConfirmationOptions } from 'Controls/_popup/interface/IConfirmation';

/**
 * Контрол, открывающий диалог подтверждения. Диалог позиционируется в центре экрана, а также блокирует работу
 * пользователя с родительским приложением.
 * @class Controls/_popup/Confirmation
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FConfirmation%2FConfirmation демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/confirmation/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @implements Controls/popup:IConfirmationFooter
 * @implements Controls/popup:IBaseOpener
 *
 * @public
 * @demo Controls-demo/Confirmation/Confirmation
 */
export default class Confirmation extends BaseOpener<IConfirmationOptions> {
    protected _popupOpener: ConfirmationOpener = new ConfirmationOpener();

    protected _beforeUnmount(): void {
        return;
    }

    static openPopup(popupOptions: IConfirmationOptions, opener): Promise<string | void | Error> {
        return new ConfirmationOpener().open({ ...popupOptions, opener });
    }
}
