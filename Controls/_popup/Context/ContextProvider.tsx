import { cloneElement, createContext, useMemo } from 'react';
import { TInternalProps } from 'UICore/executor';

export interface IContext {
    close: () => void;
    sendResult: (...args: unknown[]) => unknown;
    maximized: (state: boolean) => void;
    updateProps: (options: any) => void;
    isPopup: boolean;
    popupId: string;
}

/**
 * Контекст
 * @class Controls/_popup/Context
 * @public
 * @remark Контекст, в котором содержатся методы и состояния окон:
 * * close - Вызывает закрытие окна.
 * * sendResult - Отправляет результат в обработчик onResult в опции eventHandlers.
 * * maximized - Изменяет размер карточки до минимальных/максимальных размеров в заивисмости от текущего состояния.
 * * updateProps - Обновляет переданные при открытии опции.
 * * isPopup - Определяет, находится ли контекст внутри окна.
 * * popupId - Индикифактор окна.
 */
const Context = createContext(null as unknown as IContext);

interface IPopupContextProvider extends IContext, TInternalProps {}

export default function ContextProvider(props: IPopupContextProvider) {
    const contextData = useMemo(() => {
        return {
            sendResult: props.sendResult,
            close: props.close,
            maximized: props.maximized,
            updateProps: props.updateProps,
            isPopup: props.isPopup,
            popupId: props.popupId,
        };
    }, [props.close, props.sendResult, props.maximized, props.updateProps]);

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

export { Context };
