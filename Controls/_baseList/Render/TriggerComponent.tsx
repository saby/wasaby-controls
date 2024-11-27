import * as React from 'react';
import { Trigger } from 'Controls/display';
import { TListTriggerPosition, TListTriggerOrientation } from 'Controls/interface';
import type { TTriggerVisibilityChangedCallback } from 'Controls/gridReact';
import { __notifyFromReact } from 'UI/Events';
import { IntersectionObserverSyntheticEntry } from 'Controls/scroll';

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

interface IRegisterObserverProps {
    element: HTMLDivElement;
    callback: TTriggerVisibilityChangedCallback;
    instId: string;
    position: TListTriggerPosition;
}

function registerObserver(props: IRegisterObserverProps) {
    const { element, instId, callback, position } = props;
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
interface IUnregisterObserverProps {
    element: HTMLDivElement;
    instId: string;
    position: TListTriggerPosition;
}

function unregisterObserver(props: IUnregisterObserverProps) {
    const { instId, element, position } = props;
    __notifyFromReact(
        element,
        'intersectionObserverUnregister',
        [{ instId: `${instId}-${position}` }],
        true
    );
}

const TriggerComponent = React.forwardRef(
    (props: ITriggerComponentProps, ref: React.Ref<HTMLDivElement>): React.ReactElement => {
        const { position, orientation = 'vertical', callback, offset, instId } = props;

        const className =
            orientation === 'vertical'
                ? `controls-BaseControl__loadingTrigger controls-BaseControl__loadingTrigger-${position}`
                : 'controls-BaseControl__loadingTrigger_horizontal';

        const dataQa = `${LIST_ELEMENT_NAME}-${position}`;

        const preparedRef = React.useRef(null);

        React.useEffect(() => {
            if (callback) {
                registerObserver({
                    instId,
                    position,
                    element: preparedRef.current,
                    callback,
                });
                return () => {
                    unregisterObserver({
                        instId,
                        position,
                        element: preparedRef.current,
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
