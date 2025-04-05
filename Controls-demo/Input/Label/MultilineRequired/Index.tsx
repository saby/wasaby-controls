import { forwardRef } from 'react';
import { Label } from 'Controls/input';

export default forwardRef(function MultilineRequired(_, ref) {
    const caption =
        'Очень при очень длинная и невероятно важная подсказка, которая не сможет отобразиться полностью';
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo__flex tw-items-baseline">
            <Label caption={caption} required={true} className="controlsDemo_fixedWidth100" />
            <Label
                caption={caption}
                required={true}
                multiline={true}
                className="controlsDemo_fixedWidth100"
            />
        </div>
    );
});
