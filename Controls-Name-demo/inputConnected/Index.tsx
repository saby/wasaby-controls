import { forwardRef, LegacyRef } from 'react';
import { Input } from 'Controls-Name/inputConnected';
import { getLoadConfig, getBinding } from './resources/_dataContextMock';
import { TOuterTextLabel } from 'Controls-Input/interface';

function getLabel(label: string): TOuterTextLabel {
    return {
        label,
        labelPosition: 'start',
    };
}

const Index = forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
        >
            <Input
                className="controls-margin_top-m"
                name={getBinding('Empty')}
                label={getLabel('Empty value')}
            />
            <Input
                className="controls-margin_top-m"
                name={getBinding('Name')}
                label={getLabel('value in store')}
            />
        </div>
    );
});

// @ts-ignore
Index.getLoadConfig = getLoadConfig;

export default Index;
