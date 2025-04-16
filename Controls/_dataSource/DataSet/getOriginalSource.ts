import { TSourceOption } from 'Controls/interface';
import { PrefetchProxy, IDecorator } from 'Types/source';

export default function getOriginalSource(
    source?: PrefetchProxy | TSourceOption
): TSourceOption | undefined {
    let resultSource;

    function isIDecoratorSource(source: PrefetchProxy | TSourceOption): source is PrefetchProxy {
        return (source as PrefetchProxy)['[Types/_source/IDecorator]'];
    }

    if (source && isIDecoratorSource(source)) {
        resultSource = (source as IDecorator).getOriginal<TSourceOption>();

        if (resultSource && isIDecoratorSource(resultSource)) {
            resultSource = getOriginalSource(resultSource);
        }
    } else {
        resultSource = source;
    }

    return resultSource;
}
