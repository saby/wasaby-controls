import { forwardRef, LegacyRef } from 'react';
import { Input } from 'Controls-Name/inputConnected';
import { getLoadConfig, getBinding } from './resources/_dataContextMock';
import { TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';

function getOuterTextLabel(label: string, labelPosition: 'start' | 'top' = 'top'): TOuterTextLabel {
    return {
        label,
        labelPosition,
    };
}

function getOuterIconLabel(): TOuterIconLabel {
    return {
        icon: 'icon-SabyBird',
    };
}

const Label = forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
        >
            <Input className="controls-margin_top-m" name={getBinding('Name')} label={null} />
            <Input
                className="controls-margin_top-m"
                name={getBinding('Name')}
                label={getOuterTextLabel('label top')}
            />
            <Input
                className="controls-margin_top-m"
                name={getBinding('Name')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <Input
                className="controls-margin_top-m"
                name={getBinding('Name')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

// @ts-ignore
Label.getLoadConfig = getLoadConfig;

export default Label;
