import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    LibPath,
    OMIT,
} from './testEnv/constants';

describe(LibPath.TreeGridRender, () => {
    dependencyTest(
        LibPath.TreeGridRender,
        [LibPath.ListsCommonLogic],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,
            ...ANY_DISPLAY_LIBS,

            LibPath.GridReact,

            LibPath.ListWebReducers,
            LibPath.ListVisualAspects,
        ]
    );
});
