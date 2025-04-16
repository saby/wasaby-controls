import * as React from 'react';
import type { Trigger } from 'Controls/display';
import type {
    TListTriggerPosition,
    TListTriggerOrientation,
    TTriggerVisibilityChangedCallback,
} from 'Controls/interface';
import type { IntersectionObserverSyntheticEntry } from 'Controls/scroll';
import { _ListScrollContext } from 'Controls/scroll';
import { __notifyFromReact, SyntheticEvent } from 'UI/Events';

const LIST_ELEMENT_NAME = 'loading-trigger';

interface ICollectionTriggerComponentProps {
    trigger: Trigger;
    orientation?: TListTriggerOrientation;
    className?: string;
}

interface ITriggerComponentProps {
    position: TListTriggerPosition;
    offset?: number;
    callback?: TTriggerVisibilityChangedCallback;
    orientation?: TListTriggerOrientation;
    className?: string;
    forwardedRef?: React.ForwardedRef<HTMLDivElement>;
    instId?: string;
}

export interface IIntersectionObserverObject {
    instId: string;
    element: HTMLElement | null;
    threshold: number[];
    handler: Function;
}

interface IRegisterObserverProps extends ObserverCallbacks {
    element: HTMLDivElement | null;
    callback: TTriggerVisibilityChangedCallback;
    instId: string;
    position: TListTriggerPosition;
}

interface ObserverCallbacks {
    intersectionObserverRegister?: (
        event: SyntheticEvent | null,
        intersectionObserverObject: IIntersectionObserverObject
    ) => void;
    intersectionObserverUnregister?: (
        event: SyntheticEvent | null,
        options: Pick<IIntersectionObserverObject, 'instId'>
    ) => void;
}

function registerObserver(props: IRegisterObserverProps) {
    const { element, instId, callback, position, intersectionObserverRegister } = props;
    if (intersectionObserverRegister) {
        intersectionObserverRegister(null, {
            instId: `${instId}-${position}`,
            element,
            threshold: [0, 1],
            handler: (item: IntersectionObserverSyntheticEntry) => {
                callback(position, item.nativeEntry.isIntersecting);
            },
        });
    } else {
        __notifyFromReact(
            element,
            'intersectionObserverRegister',
            [
                {
                    instId: `${instId}-${position}`,
                    element,
                    threshold: [0, 1],
                    handler: (item: IntersectionObserverSyntheticEntry) => {
                        callback(position, item.nativeEntry.isIntersecting);
                    },
                },
            ],
            true
        );
    }
}

interface IUnregisterObserverProps extends ObserverCallbacks {
    element: HTMLDivElement | null;
    instId: string;
    position: TListTriggerPosition;
}

function unregisterObserver(props: IUnregisterObserverProps) {
    const { instId, element, position, intersectionObserverUnregister } = props;
    if (intersectionObserverUnregister) {
        intersectionObserverUnregister(null, { instId: `${instId}-${position}` });
    } else {
        __notifyFromReact(
            element,
            'intersectionObserverUnregister',
            [{ instId: `${instId}-${position}` }],
            true
        );
    }
}

const TriggerComponent = React.forwardRef(
    (props: ITriggerComponentProps, ref: React.Ref<HTMLDivElement>): React.ReactElement => {
        const context = React.useContext<ObserverCallbacks | undefined>(
            _ListScrollContext as React.Context<ObserverCallbacks | undefined>
        );
        const { position, orientation = 'vertical', callback, offset, instId } = props;

        const className =
            orientation === 'vertical'
                ? `controls-BaseControl__loadingTrigger controls-BaseControl__loadingTrigger-${position}`
                : 'controls-BaseControl__loadingTrigger_horizontal';

        const dataQa = `${LIST_ELEMENT_NAME}-${position}`;

        const preparedRef = React.useRef<HTMLDivElement | null>(null);

        React.useEffect(() => {
            if (callback && instId) {
                registerObserver({
                    instId,
                    position,
                    element: preparedRef.current,
                    callback,
                    intersectionObserverRegister: context?.intersectionObserverRegister,
                });
                return () => {
                    unregisterObserver({
                        instId,
                        position,
                        element: preparedRef.current,
                        intersectionObserverUnregister: context?.intersectionObserverUnregister,
                    });
                };
            }
        }, [callback, position, preparedRef]);

        const style = React.useMemo(() => {
            if (!offset) {
                return {};
            }

            return {
                [position]: `${offset}px`,
            };
        }, [position, offset]);

        return (
            <div
                style={style}
                ref={(element: HTMLDivElement) => {
                    preparedRef.current = element;
                    if (ref instanceof Function) {
                        ref(element);
                    }
                }}
                className={`${props.className ? props.className : ''} ${className}`}
                data-qa={dataQa}
            />
        );
    }
);

function CompatibleTriggerComponent(
    props: ICollectionTriggerComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const { className, trigger, orientation = 'vertical' } = props;
    return (
        <TriggerComponent
            position={trigger.getPosition()}
            orientation={orientation}
            className={className}
            ref={ref}
        />
    );
}

export default React.memo(TriggerComponent);

export const CollectionTriggerComponent = React.memo(React.forwardRef(CompatibleTriggerComponent));
