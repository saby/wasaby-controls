import { forwardRef, LegacyRef, useState } from 'react';
import { Password } from 'Controls/input';
import { Checkbox } from 'Controls/checkbox';


export default forwardRef(function revealButtonClickCallback(_, ref: LegacyRef<HTMLDivElement>) {
    const [value, setValue] = useState(false);
    const revealButtonClickCallbackSync = () => {
        return value;
    };

    const revealButtonClickCallbackAsync = (): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(value);
            }, 1000);
        });
    };
    return <div
        ref={ref}
        className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
    >
        <div
            className="tw-flex tw-flex-col tw-justify-center tw-items-center"
            data-qa="controlsDemo_capture"
        >
            <div className="tw-self-start">
                <Checkbox caption="Доступ на просмотр пароля" value={value} onValueChanged={setValue}/>
            </div>
            <div className="tw-flex controls-margin_top-m">
                <div className="controls-text-label controlsDemo_fixedWidth200">sync revealButtonClickCallback</div>
                <Password revealButtonClickCallback={revealButtonClickCallbackSync}/>
            </div>
            <div className="tw-flex controls-margin_top-m">
                <div className="controls-text-label controlsDemo_fixedWidth200">async revealButtonClickCallback</div>
                <Password revealButtonClickCallback={revealButtonClickCallbackAsync}/>
            </div>
        </div>
    </div>;
});