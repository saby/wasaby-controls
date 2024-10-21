import { forwardRef } from 'react';
import { Text } from 'Controls/input';
import { InputContainer } from 'Controls/jumpingLabel';

export default forwardRef(function RequiredDoc(_, ref) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth200">
                <InputContainer caption="Enter your name" required={true} content={<Text />} />
            </div>
            <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth200">
                <InputContainer
                    caption="Long long long long long long long long long long long"
                    required={true}
                    content={<Text />}
                />
            </div>
        </div>
    );
});
