import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Multiline = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('multiline')}
                        multiline={{
                            minLines: 3,
                            maxLines: 5,
                        }}
                    />
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('multiline is empty')}
                    />
                </div>
            </div>
        </div>
    );
});

Multiline.getLoadConfig = getLoadConfig;

export default Multiline;
