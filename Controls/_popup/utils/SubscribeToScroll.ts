/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control } from 'UI/Base';
import { RegisterUtil, UnregisterUtil, IListenerOptions } from 'Controls/event';
import { goUpByControlTree } from 'UI/Focus';
import { TTarget } from 'Controls/_popup/interface/ISticky';
import { detection } from 'Env/Env';
import * as cInstance from 'Core/core-instance';

export const getTargetForSubscribe = (target: TTarget): Control => {
    const baseControlName = 'UI/Base:Control';
    // todo когда-нибудь переделать
    if (
        cInstance.instanceOfModule(target, baseControlName) ||
        typeof target?._notify !== 'undefined'
    ) {
        return target as Control;
    } else if (target instanceof HTMLElement) {
        return goUpByControlTree(target)[0];
    }
};

export const toggleActionOnScroll = (
    target: TTarget,
    toggle: boolean,
    id: string,
    callback?: Function
): Control => {
    const targetForSubscribe = getTargetForSubscribe(target);
    const config: IListenerOptions = {};
    if (targetForSubscribe) {
        if (targetForSubscribe._moduleName === 'Controls/scroll:Container') {
            config.listenItself = true;
            config.id = id;
        }
        if (toggle) {
            RegisterUtil(targetForSubscribe, 'customscroll', callback, config);
        } else {
            UnregisterUtil(targetForSubscribe, 'customscroll', config);
        }
    }
    if (window?.addEventListener && detection.isMobileIOS) {
        if (toggle) {
            window.addEventListener('scroll', callback);
        } else{
            window.removeEventListener('scroll', callback);
        }
    }
    return targetForSubscribe;
};
