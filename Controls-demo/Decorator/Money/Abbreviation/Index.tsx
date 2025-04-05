import { forwardRef } from 'react';
import { Money } from 'Controls/baseDecorator';
import 'css!Controls/CommonClasses';

export default forwardRef(function Value(props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div ref={ref} className={rootClass}>
            <div className="controls-text-label controlsDemo__mb1">abbreviationType = 'long'</div>
            <div className="controlsDemo__flexRow">
                <div className="controlsDemo__flexColumn">
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240</div>
                        <Money value={1240} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240.23</div>
                        <Money value={1240.23} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = -1240.23</div>
                        <Money value={-1240.23} abbreviationType="long" />
                    </div>
                </div>
                <div className="controlsDemo__flexColumn controlsDemo__ml4">
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240480</div>
                        <Money value={1240480} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240480.23</div>
                        <Money value={1240480.23} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = -1240480.23</div>
                        <Money value={-1240480.23} abbreviationType="long" />
                    </div>
                </div>
                <div className="controlsDemo__flexColumn controlsDemo__ml4">
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240480000</div>
                        <Money value={1240480000} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240480000.23</div>
                        <Money value={1240480000.23} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = -1240480000.23</div>
                        <Money value={-1240480000.23} abbreviationType="long" />
                    </div>
                </div>
                <div className="controlsDemo__flexColumn controlsDemo__ml4">
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240480000000</div>
                        <Money value={1240480000000} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 1240480000000.23</div>
                        <Money value={1240480000000.23} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = -1240480000000.23</div>
                        <Money value={-1240480000000.23} abbreviationType="long" />
                    </div>
                </div>
                <div className="controlsDemo__flexColumn controlsDemo__ml4">
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 500</div>
                        <Money value={500} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = 500.23</div>
                        <Money value={500.23} abbreviationType="long" />
                    </div>
                    <div className="controlsDemo__cell">
                        <div className="controls-text-label">value = -500.23</div>
                        <Money value={-500.23} abbreviationType="long" />
                    </div>
                </div>
            </div>
            <div className="controls-text-label controlsDemo__mb1">abbreviationType = 'short'</div>
            <div className="controlsDemo__flexRow">
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 1240.23</div>
                    <Money value={1240.23} abbreviationType="short" />
                </div>
                <div className="controlsDemo__cell controlsDemo__ml4">
                    <div className="controls-text-label">value = 1240480.23</div>
                    <Money value={1240480.23} abbreviationType="short" />
                </div>
                <div className="controlsDemo__cell controlsDemo__ml4">
                    <div className="controls-text-label">value = 1240480000.23</div>
                    <Money value={1240480000.23} abbreviationType="short" />
                </div>
                <div className="controlsDemo__cell controlsDemo__ml4">
                    <div className="controls-text-label">value = 1240480000000.23</div>
                    <Money value={1240480000000.23} abbreviationType="short" />
                </div>
                <div className="controlsDemo__cell controlsDemo__ml4">
                    <div className="controls-text-label">value = 500.23</div>
                    <Money value={500.23} abbreviationType="short" />
                </div>
            </div>
        </div>
    );
});
