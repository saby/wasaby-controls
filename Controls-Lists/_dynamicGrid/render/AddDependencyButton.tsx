import * as React from 'react';
import { Button } from 'Controls/buttons';
import { IDependencyButtonsConfig } from 'Controls-Lists/_dynamicGrid/interfaces/IEventRenderProps';

export type TDependencyButtonPosition = 'left' | 'right';
interface IAddDependencyButtonProps {
    buttonPosition: TDependencyButtonPosition;
    eventKey: string;
    buttonConfig?: IDependencyButtonsConfig;
    onMouseDown: (
        eventId: string,
        buttonPosition: TDependencyButtonPosition,
        eventColor: string
    ) => void;
    onClick: (eventId: string, buttonPosition: 'left' | 'right') => void;
}

export default function AddDependencyButton({
    buttonPosition,
    eventKey,
    onMouseDown,
    onClick,
    buttonConfig,
}: IAddDependencyButtonProps) {
    const className = ` ControlsLists-timelineGrid__dependency_button ControlsLists-timelineGrid__dependency_button_${buttonPosition} `;

    return (
        <div className={className}>
            <Button
                viewMode={'filled'}
                style={buttonConfig?.style}
                buttonStyle="default"
                iconStyle="default"
                onClick={() => {
                    onClick(eventKey, buttonPosition);
                }}
                onMouseDown={(e) => {
                    onMouseDown(eventKey, buttonPosition, buttonConfig?.style?.backgroundColor);
                    e.stopPropagation();
                }}
                icon={'icon-AddButtonNew'}
            />
        </div>
    );
}
