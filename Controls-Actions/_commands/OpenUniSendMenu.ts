import { IoC } from 'Env/Env';

/**
 * Опции для открытия панели.
 * @public
 */
export interface IOpenUniSendMenuParams {
    /** @cfg {String} Идентификатор документа */
    docId: string;
    /** @cfg {String} Идентификатор регламента */
    docSource: string;
    /** @cfg {String} Тип документа */
    docType: string;
    /** @cfg {Number} Идентификатор головной организации */
    orgId: number;
    /** @cfg {Object} Запрещенные для отправки типы */
    types: object;
}

/**
 * Действие для открытия меню универсальной отправки документа.
 * @class Controls-Actions/_commands/OpenUniSendMenu
 * @kaizen_zone 9d28795f-73af-4b19-8328-8c13189bce18
 * @public
 */
export default class OpenUniSendMenu {
    async execute(params: IOpenUniSendMenuParams, opener: Node): Promise<void> {
        // Предотвращение закликивания кнопки и открытия нескольких инстансов панели
        if (opener.isPopupOpen) {
            return;
        }

        opener.isPopupOpen = true;
        const docSource = params?.docSource?.replace?.(/\s/gi, '').split?.(',') || [];
        const docType = params?.docType?.replace?.(/\s/gi, '').split?.(',') || [];
        const types = {edo: false, ...params?.types};

        const { executeSendMenu } = await import('SocNetAggregation/sendUtils');

        try {
            return executeSendMenu(
                opener,
                opener,
                {...params, docSource, docType, types, opener},
                {
                    eventHandlers: {
                        onClose: () => {
                            opener.isPopupOpen = false;
                        }
                    }
                }
            );
        } catch(err) {
            return IoC.resolve('ILogger').error('SocNetAggregation/sendUtils:executeSendMenu', err);
        }
    }
}
