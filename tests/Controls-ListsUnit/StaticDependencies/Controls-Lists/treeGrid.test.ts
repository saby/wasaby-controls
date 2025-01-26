import dependencyTest from '../testEnv/dependencyTest';
import {
    ANY_DISPLAY_LIBS,
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    LibPath,
    OMIT,
} from '../testEnv/constants';

describe(LibPath.NewTreeGrid, () => {
    dependencyTest(
        LibPath.NewTreeGrid,
        [LibPath.ListsCommonLogic, LibPath.GridRender, LibPath.TreeGridRender],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,

            ...OMIT(ANY_NEW_PUBLIC_COMPONENT_LIBS, LibPath.NewTreeGrid),

            // TODO: Убрать OMIT https://online.sbis.ru/opendoc.html?guid=6bc29d4e-9afe-439d-8b35-56907e12ea39&client=3
            ...OMIT(ANY_DISPLAY_LIBS, LibPath.GridDisplay, LibPath.BaseTreeDisplay),

            LibPath.GridReact,
            LibPath.ListWebReducers,
        ]
    );
});
