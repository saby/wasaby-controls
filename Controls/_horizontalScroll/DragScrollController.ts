/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
// Controls/grid всегда тащит библиотеку старого горизонтального скролла.
// Т.к. контроллер драг скролла полностью абстрагирован от реализации горизонтального скролла,
// он прекрасно подходит и для нового.
// Чтобы не дублировать просто экспортируем старый контроллер.
// После удаления старого скролла контроллер переедет в Controls/horizontalScroll.

import { DragScrollController } from 'Controls/dragScroll';
export default DragScrollController;
