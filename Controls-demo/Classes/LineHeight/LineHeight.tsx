import { forwardRef, LegacyRef } from 'react';

export default forwardRef(function LineHeightDemo(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex-col controlsDemo_fixedWidth500"
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex tw-flex-col"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-text-label">line-height = xs</div>
                <div className="controls-text-multiline controls-fontsize-xs">
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </div>
            </div>
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex tw-flex-col"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-text-label">line-height = s</div>
                <div className="controls-text-multiline controls-fontsize-s">
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </div>
            </div>{' '}
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex tw-flex-col"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-text-label">line-height = m</div>
                <div className="controls-text-multiline controls-fontsize-m">
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </div>
            </div>{' '}
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex tw-flex-col"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-text-label">line-height = l</div>
                <div className="controls-text-multiline controls-fontsize-l">
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </div>
            </div>{' '}
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex tw-flex-col"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-text-label">line-height = xl</div>
                <div className="controls-text-multiline controls-fontsize-xl">
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </div>
            </div>{' '}
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center tw-flex tw-flex-col"
                data-qa="controlsDemo_capture"
            >
                <div className="controls-text-label">line-height = 2xl</div>
                <div className="controls-text-multiline controls-fontsize-2xl">
                    What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                </div>
            </div>
        </div>
    );
});
