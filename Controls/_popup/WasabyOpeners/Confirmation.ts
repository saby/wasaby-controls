/**
 * @kaizen_zone 4eca12bb-c964-409a-b853-a3803e6a37a3
 */
import BaseOpener from './BaseOpener';
import ConfirmationOpener from '../Openers/Confirmation';
import { IConfirmationOptions } from 'Controls/_popup/interface/IConfirmation';

/**
 * Контрол, открывающий диалог подтверждения. Диалог позиционируется в центре экрана, а также блокирует работу
 * пользователя с родительским приложением.
 * @class Controls/_popup/Confirmation
 * @remark
 * Полезные ссылки:
 * <ul>
 *     <li>{@link /materials/DemoStand/app/Controls-demo%2FConfirmation%2FConfirmation демо-пример}</li>
 *     <li>{@link https://n.sbis.ru/article/7efd671b-7069-4037-aba4-df9e8248919a руководство разработчика}</li>
 *     <li>{@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}</li>
 * </ul>
 *
 * @implements Controls/popup:IConfirmationFooter
 * @implements Controls/popup:IBaseOpener
 * @implements Controls/popup:IConfirmationOpener
 *
 * @public
 * @demo Controls-demo/Confirmation/Confirmation
 */
export default class Confirmation extends BaseOpener<IConfirmationOptions> {
    protected _popupOpener: ConfirmationOpener = new ConfirmationOpener();

    protected _beforeUnmount(): void {
        return;
    }

    static openPopup(popupOptions: IConfirmationOptions, opener?): Promise<boolean | undefined> {
        return new ConfirmationOpener().open({ ...popupOptions, opener });
    }
}
