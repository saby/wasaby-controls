import { forwardRef } from 'react';
import { MultilineText } from 'Controls-Input/decoratorConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterIconLabel, getOuterTextLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <div>
                <MultilineText
                    name={getBinding('Text')}
                    label={null}
                />
            </div>
            <div className='controls-margin_top-l'>
                <MultilineText
                    name={getBinding('Text')}
                    label={getOuterTextLabel('label top')}
                />
            </div>
            <div className='controls-margin_top-l'>
                <MultilineText
                    name={getBinding('Text')}
                    label={getOuterTextLabel('label start', 'start')}
                />
            </div>
            <div className='controls-margin_top-l'>
                <MultilineText
                    name={getBinding('Text')}
                    label={getOuterIconLabel()}
                />
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
