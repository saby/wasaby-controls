import { forwardRef } from 'react';
import { Label } from 'Controls/input';

export default forwardRef(function Multiline(_, ref) {
    const caption = 'Очень при очень длинная и невероятно важная подсказка, которая не сможет отобразиться полностью';
    return <div ref={ref}
                className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center">
        <div className="controlsDemo__cell ws-flex-column">
            <Label caption={caption}
                   className="controlsDemo_fixedWidth100"/>
        </div>
        <div className="controlsDemo__cell ws-flex-column">
            <Label caption={caption}
                   multiline={true}
                   className="controlsDemo_fixedWidth100"/>
        </div>
    </div>;
});