import { WidgetType } from 'Meta/types';
import { SizeType } from 'Controls-meta/style';

export const WidgetSizeType = WidgetType.id('').properties({
    ...SizeType.getProperties(),
});
