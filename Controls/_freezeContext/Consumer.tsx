import { ForwardedRef, cloneElement, forwardRef, useContext, useEffect } from 'react';
import { Context as FreezeContext, IFreezeContext } from './Provider';

interface IFreezeConsumerProps {
    getContextValue?: (isFreeze: boolean | undefined) => void;
    content?: unknown;
    children?: React.ReactElement;
}

const FreezeConsumer = forwardRef(function FreezeConsumerFn(
    { getContextValue, children, content, ...rest }: IFreezeConsumerProps,
    ref: ForwardedRef<unknown>
) {
    const freezeContext = useContext<IFreezeContext | undefined>(FreezeContext);

    useEffect(() => {
        if (getContextValue) {
            getContextValue(freezeContext?.isFreeze);
        }
    }, [freezeContext?.isFreeze, getContextValue]);

    if (!children) {
        return null;
    }
    return cloneElement(children, {
        ref,
        isFreeze: freezeContext?.isFreeze,
        ...rest,
    });
});

FreezeConsumer.displayName = 'Controls/freezeContext:Consumer';

export default FreezeConsumer;
