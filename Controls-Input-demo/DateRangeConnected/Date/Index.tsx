import { forwardRef } from 'react';
import { Input } from 'Controls-Input/dateRangeConnected';
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
                    <Input
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('Mask DD.MM.YYYY')}
                        mask="DD.MM.YYYY"
                    />
                    <Input
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('Mask DD.MM.YY')}
                        mask="DD.MM.YY"
                    />
                    <Input
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('Mask MM.YYYY')}
                        mask="MM.YYYY"
                    />
                    <Input
                        name={getBinding('DateRange')}
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
