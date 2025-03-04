import { cloneElement, createContext, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

export interface IFreezeContext extends TInternalProps {
    isFreeze: boolean;
}

/**
 * Контекст, который определяет видно ли содержимое, либо скрыто через display: none.
 * @class Controls/_freezeContext/Context
 * @public
 * @remark
 * Для того чтобы понять видно выше содержимое или нет, нужно сделать следующее:
 * <pre>
 * import {FreezeContext} from '...'
 * const freezeContext = useContext(FreezeContext)
 * if(freezeContext.isFreeze){
 *     // логика если содержимое скрыто
 * } else {
 *     // логика когда содержимое видно
 * }
 * </pre>
 * @demo Controls-demo/SwitchableArea/FreezingContext/Index
 */
export const Context = createContext<IFreezeContext>(null as unknown as IFreezeContext);

export default function ContextProvider(props: IFreezeContext) {
    const contextData = useMemo(() => {
        return {
            isFreeze: props.isFreeze,
        };
    }, [props.isFreeze]);

    const clearProps = { ...props };
    delete clearProps.children;

    return (
        <Context.Provider value={contextData}>
            {cloneElement(props.children, {
                ...clearProps,
            })}
        </Context.Provider>
    );
}
