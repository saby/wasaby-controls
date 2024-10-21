import { forwardRef } from 'react';
import { default as ComboboxConnected } from 'Controls-Input/ComboboxConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const VisibleItemsCount = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <ComboboxConnected
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                visibleItemsCount={1}
                label={getOuterTextLabel('VisibleItemsCount = 1')}
            />
        </div>
    );
});

VisibleItemsCount.getLoadConfig = getLoadConfig;

export default VisibleItemsCount;
