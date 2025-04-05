import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS, ANY_RENDER_LIBS,
    LibPath,
    OMIT,
} from './testEnv/constants';

describe(LibPath.TreeRender, () => {
    dependencyTest(
        LibPath.TreeRender,
        [LibPath.ListsCommonLogic],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,

            ...OMIT(ANY_RENDER_LIBS, LibPath.TreeRender),

            ...ANY_DISPLAY_LIBS,
            LibPath.ListWebReducers,
            LibPath.ListVisualAspects,
        ]
    );
});
