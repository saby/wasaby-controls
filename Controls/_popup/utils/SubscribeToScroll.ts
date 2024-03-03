/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control } from 'UI/Base';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { goUpByControlTree } from 'UI/Focus';
import { TTarget } from 'Controls/_popup/interface/ISticky';
import * as cInstance from 'Core/core-instance';

const getTargetForSubscribe = (target: TTarget): Control => {
    const baseControlName = 'UI/Base:Control';
    // todo когда-нибудь переделать
    if (cInstance.instanceOfModule(target, baseControlName) || typeof target?._notify !== 'undefined') {
        return target as Control;
    } else if (target instanceof HTMLElement) {
        return goUpByControlTree(target)[0];
    }
};

export const toggleActionOnScroll = (
    target: TTarget,
    toggle: boolean,
    callback?: Function
): void => {
    const targetForSubscribe = getTargetForSubscribe(target);
    if (targetForSubscribe) {
        if (toggle) {
            RegisterUtil(targetForSubscribe, 'customscroll', callback);
        } else {
            UnregisterUtil(targetForSubscribe, 'customscroll');
        }
    }
};
