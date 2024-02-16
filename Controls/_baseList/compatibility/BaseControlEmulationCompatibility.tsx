import * as React from 'react';
import type { INewListSchemeProps, INewListSchemeHandlers } from '../Data/INewListScheme';
import type { Collection } from 'Controls/display';
import { SlicelessBaseControlCompatibility } from './SlicelessBaseControlCompatibility';
import { CompatibleSingleColumnMarkerStrategy as SingleColumnStrategy } from 'Controls/markerListAspect';

export const BASE_CONTROL_DEFAULT_OPTIONS = {
    markerVisibility: 'onactivated',
    markerStrategy: SingleColumnStrategy,
};

export type TBaseControlEmulationCompatibilityProps = INewListSchemeProps &
    INewListSchemeHandlers & {
        children?: JSX.Element;
    };

export type TBaseControlEmulationCompatibilityRef = React.ForwardedRef<HTMLDivElement>;

export type TBaseControlEmulationCompatibility = typeof SlicelessBaseControlCompatibility & {
    setCollection(collection: Collection): void;
};

export const BaseControlEmulationCompatibility = React.forwardRef(
    (
        props: TBaseControlEmulationCompatibilityProps,
        ref: TBaseControlEmulationCompatibilityRef
    ): JSX.Element => {
        const compatibility: TBaseControlEmulationCompatibility = React.useMemo(
            () => ({
                setCollection(collection: Collection) {
                    // Слой совместимости создается во всех списках с BaseControl,
                    // но не все списки рождаются в слайсе пока
                    if (props.hasSlice) {
                        return props.setCollection(collection);
                    }
                },
                ...SlicelessBaseControlCompatibility,
                // todo: Сбрасываем onViewTriggerVisibilityChanged, т.к. он должен отрабатывать на первом этапе только
                // для новейшего списка. В дальнейшем данная строчка будет убрана, код вызова триггера будет единым.
                onViewTriggerVisibilityChanged: undefined,
            }),
            [props]
        );

        return React.cloneElement(props.children, {
            forwardedRef: ref,
            ...props,
            ...compatibility,
        });
    }
);

export default BaseControlEmulationCompatibility;
