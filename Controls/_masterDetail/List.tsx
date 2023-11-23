import { cloneElement, ForwardedRef, forwardRef, useMemo, useRef } from 'react';
import { __notifyFromReact } from 'UI/Events';

// TODO: Заменить на использование библиотечного хелпера, когда его добавят
function isWasabyOrFunction(template: unknown): boolean {
    const memoSymbol = Symbol.for('react.memo');
    const forwardRefSymbol = Symbol.for('react.forward_ref');
    return (
        template?.isWasabyTemplate ||
        typeof template === 'function' ||
        template?.$$typeof === memoSymbol ||
        template?.$$typeof === forwardRefSymbol
    );
}

function getCustomEvents(props: Record<string, any>) {
    const userEvents = Object.keys(props).filter(
        (key) => key.startsWith('on') && typeof props[key] === 'function'
    );
    userEvents.push('onMarkedKeyChanged');
    return userEvents;
}

interface IListProps {
    onSelectedMasterValueChanged?: (key: string) => void;
    children: JSX.Element;
}

function List(props: IListProps, ref: ForwardedRef<HTMLDivElement>) {
    const localRef = useRef(null);
    const setRefs = (element) => {
        localRef.current = element;
        if (ref) {
            ref(element);
        }
    };

    const mergedMarkedKeyChangedHandler = (key) => {
        if (localRef?.current) {
            __notifyFromReact(localRef.current, 'selectedMasterValueChanged', [key], true);
        }
    };

    const customEvents = useMemo(() => getCustomEvents(props), [props]);

    const childrenProps = {
        ...props,
        onMarkedKeyChanged: mergedMarkedKeyChangedHandler,
        customEvents,
        ref: setRefs,
    };

    const Children = props.children;

    return isWasabyOrFunction(Children) ? (
        <Children {...props} />
    ) : (
        cloneElement(Children, childrenProps)
    );
}

List.displayName = 'MasterDetail:List';

export default forwardRef(List);
