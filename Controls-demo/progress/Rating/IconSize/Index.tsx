import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Rating } from 'Controls/progress';

type IconSize = 'default' | '2xs' | 'xs' | 's' | 'm' | 'l';
export default React.forwardRef(function RatingDemo(
    props: TInternalProps,
    ref
): React.ReactElement {
    const [value] = React.useState<number>(3);
    const iconSizes: IconSize[] = ['default', '2xs', 'xs', 's', 'm', 'l'];
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
        return '';
    };
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth300 ${getAttrClass()}`}
        >
            {iconSizes.map((iconSize) => {
                return (
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">{iconSize}</div>
                        <Rating
                            value={value}
                            readOnly={true}
                            iconSize={iconSize}
                        />
                    </div>
                );
            })}
        </div>
    );
});
