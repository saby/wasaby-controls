import { forwardRef, useCallback, useState } from 'react';
import { Rating } from 'Controls/progress';

export default forwardRef(function RatingViewModeDemo(_, ref) {
    const [heartsRatingValue, setHeartsRatingValue] = useState(3);
    const handleChangeHeartsValue = useCallback((event: Event, newValue: number) => {
        setHeartsRatingValue(newValue);
    }, []);

    const [starsRatingValue, setStarsRatingValue] = useState(3);
    const handleChangeStarsValue = useCallback((event: Event, newValue: number) => {
        setStarsRatingValue(newValue);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">viewMode='hearts'</div>
                    <Rating
                        viewMode="hearts"
                        value={heartsRatingValue}
                        onValueChanged={handleChangeHeartsValue}
                    />
                </div>
                <div>
                    <Rating value={starsRatingValue} onValueChanged={handleChangeStarsValue} />
                </div>
            </div>
        </div>
    );
});
