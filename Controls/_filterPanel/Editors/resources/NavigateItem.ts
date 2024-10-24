import { Model } from 'Types/entity';
import { IRouter } from 'Router/router';

export function navigateItem(router: IRouter, item: Model): void {
    const state = router.maskResolver.calculateHref(item.get('mask'), {
        pageId: item.get('pageId'),
        ...item.get('pageParams'),
    });
    const href = router.urlRewriter.getReverse(state);
    router.navigate({
        state,
        href,
    });
}
