import { forwardRef, useMemo } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Style = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div
                className="controlsDemo__wrapper controlsDemo__flex"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('.style is empty')}
                    />
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('size = m')}
                        className="controls-input_size-m"
                    />
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('size = l')}
                        className="controls-input_size-l"
                    />
                </div>
            </div>
        </div>
    );
});

Style.getLoadConfig = getLoadConfig;

export default Style;
