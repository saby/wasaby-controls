import { ISerializableState } from 'Application/Interface';
import { getStateReceiver, getStore } from 'Application/Env';
import * as randomId from 'Core/helpers/Number/randomId';

/**
 * @typedef {Object} Controls/_popup/utils/registerServerSidePopup/ITemConfig
 * @description Объект с параметрами для окна, построенного на сервере
 * @property {String} template Шаблон окна, который передается только в формате строки. Сам шаблон должен быть загружен самостоятельно.
 * @property {Object} templateOptions Опции шаблона, переданного в template.
 * @property {Number} width Ширина окна.
 * @property {Number} height Высота окна.
 * @property {Number} top Расстояние от окна до верхнего края страницы
 * @property {Number} left Расстояние от окна до верхнего края страницы
 * @property {Number} workspaceWidth Ширина рабочей области
 * @property {Boolean} modal Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {Controls/_popup/interface/IStickyOpener/Direction.typedef} direction Выравнивание окна относительно страницы.
 * @property {Controls/_popup/interface/IStickyOpener/Offset.typedef} offset Отступы от страницы до окна.
 * @property {Controls/_popup/interface/IStickyOpener/Direction.typedef} targetPoint Точка позиционирования окна относительно страницы.
 */
export interface IServerSidePopupOptions {
    template: string;
    width: number;
    height: number;
    templateOptions?: any;
    left?: number;
    top?: number;
    workspaceWidth?: number;
    modal?: boolean;
    offset?: {
        vertical: number;
        horizontal: number;
    };
    targetPoint?: {
        vertical: 'top' | 'bottom' | 'center';
        horizontal: 'left' | 'right' | 'center';
    };
    direction?: {
        vertical: 'top' | 'bottom' | 'center';
        horizontal: 'left' | 'right' | 'center';
    };
}

export interface IServerSidePopupItem {
    position: {
        height: number;
        width: number;
        top: string | number;
        left: string | number;
    };
    popupOptions: {
        template: string;
        content: string;
        templateOptions: object;
    };
    modal: boolean;
    currentZIndex: number;
}

const UID: string = 'serverSidePopup';
const RIGHT_PANEL_WIDTH = 54;

class ReceivedServerSidePopup implements ISerializableState {
    setState(item: IServerSidePopupItem): void {
        getStore(UID)?.set('item', item);
    }

    getState(): IServerSidePopupItem {
        return getStore(UID)?.get('item');
    }
}

const getTop = (serverSidePopupConfig: IServerSidePopupOptions): string | number => {
    if (serverSidePopupConfig.top) {
        return serverSidePopupConfig.top;
    }
    let verticalOffset = serverSidePopupConfig.offset?.vertical || 0;

    if (serverSidePopupConfig.direction.vertical === 'top') {
        verticalOffset += serverSidePopupConfig.height;
    } else if (serverSidePopupConfig.direction.vertical === 'center') {
        verticalOffset += serverSidePopupConfig.height / 2;
    }

    if (serverSidePopupConfig.targetPoint?.vertical === 'top') {
        return `${verticalOffset}px`;
    }
    if (serverSidePopupConfig.targetPoint?.vertical === 'bottom') {
        return `calc(100% - ${verticalOffset}px)`;
    }
    const topOffset = serverSidePopupConfig.height / 2 - verticalOffset;
    return `calc(50% - ${topOffset}px)`;
};

const getLeft = (serverSidePopupConfig: IServerSidePopupOptions): string | number => {
    if (serverSidePopupConfig.left) {
        return serverSidePopupConfig.left;
    }
    const workspaceWidth = `${serverSidePopupConfig.workspaceWidth}px` || '100%';
    let horizontalOffset = serverSidePopupConfig.offset?.horizontal || 0;

    if (serverSidePopupConfig.direction.horizontal === 'left') {
        horizontalOffset += serverSidePopupConfig.width;
    } else if (serverSidePopupConfig.direction.horizontal === 'center') {
        horizontalOffset += serverSidePopupConfig.width / 2;
    }

    if (serverSidePopupConfig.targetPoint?.horizontal === 'left') {
        return `${horizontalOffset}px`;
    }
    if (serverSidePopupConfig.targetPoint?.horizontal === 'right') {
        return `calc(${workspaceWidth} - ${horizontalOffset}px)`;
    }

    const windowCenter = serverSidePopupConfig.workspaceWidth
        ? `${(serverSidePopupConfig.workspaceWidth - RIGHT_PANEL_WIDTH) / 2}px`
        : '50%';

    return `calc(${windowCenter} - ${serverSidePopupConfig.width / 2}px)`;
};

/**
 * Метод, который регистрирует окно для построения на сервере
 * @function Controls/_popup/utils/registerServerSidePopup
 * @param {Controls/_popup/utils/registerServerSidePopup/ITemConfig.typedef} serverSidePopupConfig
 * @public
 */

export const registerServerSidePopup = (serverSidePopupConfig: IServerSidePopupOptions): void => {
    const config = {
        position: {
            height: serverSidePopupConfig.height,
            width: serverSidePopupConfig.width,
            top: getTop(serverSidePopupConfig),
            left: getLeft(serverSidePopupConfig),
        },
        popupOptions: {
            template: serverSidePopupConfig.template,
            content: 'Controls/popupTemplateStrategy:DialogContent',
            templateOptions: serverSidePopupConfig.templateOptions,
        },
        id: randomId('popup-'),
        modal: serverSidePopupConfig.modal,
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
