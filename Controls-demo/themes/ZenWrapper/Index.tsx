import { forwardRef } from 'react';
import { ZenWrapper } from 'Controls/themesExt';
import { useTheme } from 'UI/Contexts';
import ThemedContent from './resources/ThemedContent';
import 'css!Controls-demo/themes/ZenWrapper/resources/Style';

export default forwardRef(function Component(props, ref) {
    const rootClass = props.className + ' ws-flexbox';
    const theme = useTheme();
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__wrapper controlsDemo_zen_dark">
                <div className="controlsDemo__cell controlsDemo_fixedWidth500">
                    <div className="controls-text-label">Dark</div>
                    <ZenWrapper
                        brightness="dark"
                        complementaryColor="151, 216, 119"
                        dominantColor="33, 33, 65"
                        theme={theme}
                    >
                        <ThemedContent />
                    </ZenWrapper>
                </div>
            </div>
            <div className="controlsDemo__wrapper controlsDemo_zen_light">
                <div className="controlsDemo__cell controlsDemo_fixedWidth500">
                    <div className="controls-text-label">Light</div>
                    <ZenWrapper
                        brightness="light"
                        complementaryColor="#b22323"
                        dominantColor="#fff"
                        theme={theme}
                    >
                        <ThemedContent />
                    </ZenWrapper>
                </div>
            </div>
            <div className="controlsDemo__wrapper controlsDemo_fixedWidth500">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">Original</div>
                    <ThemedContent />
                </div>
            </div>
        </div>
    );
});
