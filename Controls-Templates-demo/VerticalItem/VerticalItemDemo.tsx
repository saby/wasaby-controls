import ImageViewModeDemo from './ImageViewMode/ImageViewModeDemo';
import CaptionPositionDemo from './CaptionPosition/CaptionPositionDemo';
import ImageEffectDemo from './ImageEffect/ImageEffectDemo';
import DescriptionLinesDemo from './DescriptionLines/DescriptionLinesDemo';
import ImagePositionDemo from './ImagePosition/ImagePositionDemo';
import 'css!DemoStand/Controls-demo';

interface VerticalItemDemoProps {
    showGoodImage: boolean;
}

function VerticalItemDemo(props: VerticalItemDemoProps) {
    const { showGoodImage } = props;
    return (
        <div className={'controlsDemo__wrapper controlsDemo__flexColumn'}>
            <ImageViewModeDemo showGoodImage={showGoodImage} />
            <CaptionPositionDemo showGoodImage={showGoodImage} />
            <ImageEffectDemo showGoodImage={showGoodImage} />
            <DescriptionLinesDemo showGoodImage={showGoodImage} />
            <ImagePositionDemo showGoodImage={showGoodImage} />
        </div>
    );
}

export default VerticalItemDemo;
