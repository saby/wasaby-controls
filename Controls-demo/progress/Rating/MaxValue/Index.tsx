import { forwardRef, useCallback, useState } from 'react';
import { Rating } from 'Controls/progress';

export default forwardRef(function RatingViewModeDemo(_, ref) {
    const [heartsRatingValue, setHeartsRatingValue] = useState(1.6);
    const handleChangeHeartsValue = useCallback((event: Event, newValue: number) => {
        setHeartsRatingValue(newValue);
    }, []);

    const [starsRatingValue, setStarsRatingValue] = useState(4);
    const handleChangeStarsValue = useCallback((event: Event, newValue: number) => {
        setStarsRatingValue(newValue);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">maxValue=2</div>
                    <div>
                        <Rating
                            maxValue={2}
                            value={heartsRatingValue}
                            onValueChanged={handleChangeHeartsValue}
                            viewMode="hearts"
                        />
                    </div>
                </div>
                <div>
                    <Rating value={starsRatingValue} onValueChanged={handleChangeStarsValue} />
                </div>
            </div>
        </div>
    );
});
