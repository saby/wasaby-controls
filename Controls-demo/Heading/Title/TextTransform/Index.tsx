import { forwardRef } from 'react';
import { Title } from 'Controls/heading';
import { useTheme } from 'UI/Contexts';

export default forwardRef(function Component(props, ref) {
    const theme = useTheme();
    return (
        <div
            ref={ref}
            className={`${props.className} controlsDemo__wrapper ${
                theme.indexOf('default') < 0
                    ? 'controlsDemo_fixedWidth800'
                    : 'controlsDemo_fixedWidth500'
            }`}
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    fontSize=xs, fontColorStyle=primary, textTransform=uppercase
                </div>
                <Title
                    caption="Heading"
                    fontColorStyle="primary"
                    fontSize="xs"
                    textTransform="uppercase"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    fontSize=m, fontColorStyle=secondary, textTransform=uppercase
                </div>
                <Title
                    caption="Heading"
                    fontSize="m"
                    fontColorStyle="secondary"
                    textTransform="uppercase"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    fontSize=3xl, fontColorStyle=label, textTransform=uppercase
                </div>
                <Title
                    caption="Heading"
                    fontSize="3xl"
                    fontColorStyle="label"
                    textTransform="uppercase"
                />
            </div>
        </div>
    );
});
