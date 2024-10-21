import { Container } from 'Controls/scroll';
import { forwardRef } from 'react';
import 'css!Controls-demo/Scroll/ScrollMode/HorizontalScroll/Style';

export default forwardRef(function HorizontalScroll(_, ref) {
    return (
        <div ref={ref}>
            <Container scrollOrientation={"horizontal"} className="scroll-container controls-margin_left-m controls-margin_top-m">
                <div className='tw-flex'>
                    <div className='tw-flex controls-background-contrast-info controls-padding-2xs controls-padding-bottom-xl'>
                        {
                            Array.from({ length: 10 }).map((_, idx) => (
                                <div key={idx} className='content-item content-item__offset controls-background-contrast-danger' />
                            ))
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
});
