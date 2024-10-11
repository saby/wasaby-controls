import { forwardRef } from 'react';
import { Number } from 'Controls/baseDecorator';

export default forwardRef(function NumberTooltip(_, ref) {
    return (
        <div ref={ref} className="ws-flexbox ws-justify-content-center">
            <div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 123456 tooltip="Всплывающая подсказка"</div>
                    <Number value={123456} tooltip="Всплывающая подсказка" />
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 12345679101112</div>
                    <div className='controlsDemo__maxWidth100 ws-ellipsis controlsDemo_bordered'>
                        <Number value={12345679101112} />
                    </div>
                </div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">value = 123456</div>
                    <Number value={123456} />
                </div>
            </div>
        </div>
    )
});
