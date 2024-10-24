/**
 * Библиотека контролов, позволяющих организовать работу событий сверху вниз.
 * @library
 * @includes Register Controls/_event/Register
 * @includes Listener Controls/_event/Listener
 * @public
 * @deprecated Использование библиотеки допускается только для <a href="/doc/platform/developmentapl/interface-development/controls/tools/autoresize/">авторесайза</a>.
 * В остальных случаях использовать библиотеку не рекомендуется, поскольку это приведёт к неконтролируемому потоку распространения данных.
 */

/*
 * event library
 * @library
 * @includes Register Controls/_event/Register
 * @includes Listener Controls/_event/Listener
 * @public
 * @author Крайнов Д.О.
 */

import Register from 'Controls/_event/Register';
import {
    register as RegisterUtil,
    unregister as UnregisterUtil,
} from 'Controls/_event/ListenerUtils';
export { default as Listener, IListenerOptions } from 'Controls/_event/Listener';
export { default as RegisterClass } from 'Controls/_event/RegisterClass';
export { Register, RegisterUtil, UnregisterUtil };
