import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';
import { IComponentProps } from 'Controls/interface';

export default forwardRef(function Index(props: IComponentProps, ref) {
    return (
        <div ref={ref} className={'controlsDemo__wrapper ' + (props.className || '')}>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1234.00, showEmptyDecimals = true</div>
                <Number value="1234.00" showEmptyDecimals={true} precision={2} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1234.00, showEmptyDecimals = false
                </div>
                <Number value="1234.00" showEmptyDecimals={false} precision={2} />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = false abbreviationType='long'
                </div>
                <Number value="1000.00" showEmptyDecimals={false} abbreviationType="long" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = false abbreviationType='short'
                </div>
                <Number value="1000.00" showEmptyDecimals={false} abbreviationType="short" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = true abbreviationType='long'
                </div>
                <Number value="1000.00" showEmptyDecimals={true} abbreviationType="long" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1000.00, showEmptyDecimals = true abbreviationType='short'
                </div>
                <Number value="1000.00" showEmptyDecimals={true} abbreviationType="short" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">
                    value = 1234.56, showEmptyDecimals = false
                </div>
                <Number value="1234.56" showEmptyDecimals={false} precision={2} />
            </div>
        </div>
    );
});
