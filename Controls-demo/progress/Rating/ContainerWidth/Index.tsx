import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { Rating } from 'Controls/progress';
import 'css!Controls-demo/progress/Rating/ContainerWidth/Style';

export default React.forwardRef(function RatingDemo(
    props: TInternalProps,
    ref
): React.ReactElement {
    const [value, setValue] = React.useState<number>(4);
    const [value1, setValue1] = React.useState<number>(3);
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
        return '';
    };
    const valueChanged = (event, value): void => {
        setValue(value);
    };
    const value1Changed = (event, value): void => {
        setValue1(value);
    };
    return (
        <div
            {...attrs}
            className={`controlsDemo__wrapper controlsDemo_fixedWidth300 ${getAttrClass()}`}
        >
            <div className={'controlsDemo__cell controlsDemo_container'}>
                <div className={'ws-flexbox'}>
                    <div>
                        <div className={'controls-text-label'}>
                            По умолчанию рейтинг растягивается на ширину контента
                        </div>
                        <Rating value={value} onValuechanged={valueChanged} />
                    </div>
                </div>
                <div className={'ws-flexbox controls-padding_top-m'}>
                    <div>
                        <div className={'controls-text-label'}>
                            При задании ширины, звезды равномерно распределяются в контейнере
                        </div>
                        <Rating
                            className={'controlsDemo_ratingWidth'}
                            value={value1}
                            onValuechanged={value1Changed}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
