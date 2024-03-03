import { ISerializableState } from 'Application/Interface';
import { getStateReceiver, getStore } from 'Application/Env';

/**
 * @typedef {Object} ITemConfig
 * @description Объект с параметрами для окна, построенного на сервере
 * @property {String} template Шаблон окна, который передается только в формате строки. Сам шаблон должен быть загружен самостоятельно.
 * @property {Object} templateOptions Опции шаблона, переданного в template.
 * @property {Number} width Ширина окна.
 * @property {Number} height Высота окна.
 */
export interface IServerSidePopupOptions {
    template: string;
    width: number;
    height: number;
    templateOptions?: any;
}


export interface IServerSidePopupItem {
    position: {
        height: number;
        width: number;
        top: string;
        left: string;
    };
    popupOptions: {
        template: string;
        content: string;
        templateOptions: object;
    },
    currentZIndex: number;
}


const UID: string = 'serverSidePopup';

class ReceivedServerSidePopup implements ISerializableState {
    setState(item: IServerSidePopupItem): void {
        getStore(UID)?.set('item', item);
    }

    getState(): IServerSidePopupItem {
        return getStore(UID)?.get('item');
    }
}

/**
 * Метод, который регистрирует окно для построения на сервере
 * @param {ITemConfig} serverSidePopupConfig
 */

export const registerServerSidePopup = (serverSidePopupConfig: IServerSidePopupOptions): void => {
    const config = {
        position: {
            height: serverSidePopupConfig.height,
            width: serverSidePopupConfig.width,
            top: `calc(50% - ${serverSidePopupConfig.height / 2}px)`,
            left: `calc(50% - ${serverSidePopupConfig.width / 2}px)`,
        },
        popupOptions: {
            template: serverSidePopupConfig.template,
            content: 'Controls/popupTemplateStrategy:DialogContent',
            templateOptions: serverSidePopupConfig.templateOptions,
        },
        currentZIndex: 1000,
    };
    const item = new ReceivedServerSidePopup();
    item.setState(config);
    getStateReceiver().register(UID, item);
};

export const getServerSidePopup = (): IServerSidePopupItem => {
    const storeValue = getStore(UID)?.get('item');
    if (!storeValue) {
        const item = new ReceivedServerSidePopup();
        getStateReceiver().register(UID, item);
        return item.getState();
    }
    return storeValue;
};