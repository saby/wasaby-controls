import { forwardRef, useCallback, useState } from 'react';
import { Rating } from 'Controls/progress';

export default forwardRef(function RatingViewModeDemo(_, ref) {
    const [fiveStarsRatingValue, setFiveStarsRatingValue] = useState(3);
    const handleChangeFiveStarsValue = useCallback((event: Event, newValue: number) => {
        setFiveStarsRatingValue(newValue);
    }, []);

    const [fourStarsRatingValue, setFourStarsRatingValue] = useState(2);
    const handleChangeFourStarsValue = useCallback((event: Event, newValue: number) => {
        setFourStarsRatingValue(newValue);
    }, []);

    const [threeStarsRatingValue, setThreeStarsRatingValue] = useState(1);
    const handleChangeThreeStarsValue = useCallback((event: Event, newValue: number) => {
        setThreeStarsRatingValue(newValue);
    }, []);

    const [twoStarsRatingValue, setTwoStarsRatingValue] = useState(1);
    const handleChangeTwoStarsValue = useCallback((event: Event, newValue: number) => {
        setTwoStarsRatingValue(newValue);
    }, []);

    const [twoHeartsRatingValue, setTwoHeartsRatingValue] = useState(1.6);
    const handleChangeTwoHeartsValue = useCallback((event: Event, newValue: number) => {
        setTwoHeartsRatingValue(newValue);
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">maxValue=5</div>
                    <Rating
                        maxValue={5}
                        value={fiveStarsRatingValue}
                        onValueChanged={handleChangeFiveStarsValue}
                        viewMode="stars"
                    />
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">maxValue=4</div>
                    <Rating
                        maxValue={4}
                        value={fourStarsRatingValue}
                        onValueChanged={handleChangeFourStarsValue}
                        viewMode="stars"
                    />
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">maxValue=3</div>
                    <Rating
                        maxValue={3}
                        value={threeStarsRatingValue}
                        onValueChanged={handleChangeThreeStarsValue}
                        viewMode="stars"
                    />
                </div>
                <div className="controls-margin_bottom-2xl">
                    <div className="controls-text-label">maxValue=2</div>
                    <Rating
                        maxValue={2}
                        value={twoStarsRatingValue}
                        onValueChanged={handleChangeTwoStarsValue}
                        viewMode="stars"
                    />
                </div>
                <div>
                    <div className="controls-text-label">maxValue=2, viewMode='hearts'</div>
                    <Rating
                        maxValue={2}
                        value={twoHeartsRatingValue}
                        onValueChanged={handleChangeTwoHeartsValue}
                        viewMode="hearts"
                        precision={0.5}
                    />
                </div>
            </div>
        </div>
    );
});
