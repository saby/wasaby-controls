import { forwardRef } from 'react';
import { Date } from 'Controls-Input/decoratorConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';

const Index = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <div className="controls-margin_bottom-m">
                <Date
                    name={getBinding('Date')}
                    mask="DD.MM.YYYY"
                />
            </div>
            <div className="controls-margin_bottom-m">
                <Date
                    name={getBinding('Date')}
                    mask="DD.MM.YY"
                />
            </div>
            <div className="controls-margin_bottom-m">
                <Date
                    name={getBinding('Date')}
                    mask="MM.YYYY"
                />
            </div>
            <div className="controls-margin_bottom-m">
                <Date
                    name={getBinding('Date')}
                    mask="YYYY"
                />
            </div>
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
