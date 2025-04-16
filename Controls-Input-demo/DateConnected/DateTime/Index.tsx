import { forwardRef } from 'react';
import { Input as DateTime } from 'Controls-Input/datetimeConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Index = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <DateTime
                        name={getBinding('DateTime')}
                        label={getOuterTextLabel('Mask DD.MM.YYYY')}
                        mask="DD.MM.YYYY"
                    />
                    <DateTime
                        name={getBinding('DateTime')}
                        label={getOuterTextLabel('Mask DD.MM.YY')}
                        mask="DD.MM.YYYY HH:mm:ss"
                    />
                    <DateTime
                        name={getBinding('DateTime')}
                        label={getOuterTextLabel('Mask MM.YYYY')}
                        mask="HH:mm:ss"
                    />
                    <DateTime
                        name={getBinding('DateTime')}
                        label={getOuterTextLabel('Mask YYYY')}
                        mask="YYYY"
                    />
                </div>
            </div>
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
