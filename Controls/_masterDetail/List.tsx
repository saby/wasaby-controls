import { cloneElement, ForwardedRef, forwardRef, useRef, ReactElement } from 'react';
import { __notifyFromReact } from 'UI/Events';

const CUSTOM_EVENTS = ['onMarkedKeyChanged'];

interface IListProps {
    onSelectedMasterValueChanged?: (key: string) => void;
    children: JSX.Element;
}

function List(props: IListProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
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

    return cloneElement(props.children, {
        ...props,
        onMarkedKeyChanged: mergedMarkedKeyChangedHandler,
        customEvents: CUSTOM_EVENTS,
        forwardedRef: setRefs,
    });
}

List.displayName = 'MasterDetail:List';

export default forwardRef(List);
