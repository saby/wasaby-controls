import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import {Number} from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default React.forwardRef(function Index(
    props: IControlOptions,
    ref: React.LegacyRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div className={'controlsDemo__wrapper ' + (props.className || '')}
             ref={ref}
        >
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1234.00, showEmptyDecimals = true</div>
                <Number value={'1234.00'} showEmptyDecimals={true} precision={2}/>
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1234.00, showEmptyDecimals = false</div>
                <Number value={'1234.00'} showEmptyDecimals={false} precision={2}/>
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1000.00, showEmptyDecimals = false abbreviationType='long'</div>
                <Number value={'1000.00'} showEmptyDecimals={false} abbreviationType='long'/>
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1000.00, showEmptyDecimals = false abbreviationType='short'</div>
                <Number value={'1000.00'} showEmptyDecimals={false} abbreviationType='short'/>
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1000.00, showEmptyDecimals = true abbreviationType='long'</div>
                <Number value={'1000.00'} showEmptyDecimals={true} abbreviationType='long'/>
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1000.00, showEmptyDecimals = true abbreviationType='short'</div>
                <Number value={'1000.00'} showEmptyDecimals={true} abbreviationType='short'/>
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">value = 1234.56, showEmptyDecimals = false</div>
                <Number value={'1234.56'} showEmptyDecimals={false} precision={2}/>
            </div>
        </div>
    );
});
