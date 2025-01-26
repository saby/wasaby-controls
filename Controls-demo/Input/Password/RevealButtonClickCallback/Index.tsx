import { forwardRef, LegacyRef, useRef } from 'react';
import { Password } from 'Controls/input';
import { Confirmation } from 'Controls/popup';

export default forwardRef(function RevealButtonClickCallback(_, ref: LegacyRef<HTMLDivElement>) {
    const passVisible = useRef<boolean>(false);

    const revealButtonClickCallbackAsync = (): Promise<boolean> | boolean => {
        if (passVisible.current) {
            passVisible.current = false;
            return true;
        }
        let resolve: (value: boolean) => void;
        const promise = new Promise<boolean>((res) => {
            resolve = res;
        });
        Confirmation.openPopup({
            message: 'Показать пароль?',
            type: 'yesno',
        }, undefined).then((res) => {
            passVisible.current = !!res;
            resolve(!!res);
        });
        return promise;
    };

    return <div
        ref={ref}
        className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
    >
        <div
            className="tw-flex tw-flex-col tw-justify-center tw-items-center"
            data-qa="controlsDemo_capture"
        >
            <div className="tw-flex controls-margin_top-m">
                <div className="controls-text-label controlsDemo_fixedWidth150 controls-margin_right-m">Введите пароль:
                </div>
                <Password revealButtonClickCallback={revealButtonClickCallbackAsync}/>
            </div>
        </div>
    </div>;
});