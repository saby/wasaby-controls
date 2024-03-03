import { forwardRef, useMemo } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Style = forwardRef((_, ref) => {
    const styleReferenceProps = useMemo(() => {
        return {
            '.style': {
                reference: 'l',
            },
        };
    }, []);
    const styleCSSProps = useMemo(() => {
        return {
            '.style': {
                'font-size_input_local': 20,
            },
        };
    }, []);
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('.style is empty')}
                        {...styleReferenceProps}
                    />
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('.style reference = l')}
                        {...styleReferenceProps}
                    />
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('.style css = 20')}
                        {...styleCSSProps}
                    />
                </div>
            </div>
        </div>
    );
});

Style.getLoadConfig = getLoadConfig;

export default Style;
