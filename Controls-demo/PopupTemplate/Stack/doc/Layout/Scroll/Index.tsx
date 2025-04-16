import { Stack } from 'Controls/popupTemplate';
import { useCallback } from 'react';
import { Container } from 'Controls/scroll';
import 'css!Controls-demo/PopupTemplate/Stack/doc/Layout/Layout';

export default function Index() {
    const getBodyContentTemplate = useCallback(() => {
        return (
            <Container
                shadowMode="js"
                className="controls-Scroll-ContainerExternal-vertical controls-Scroll-ContainerExternal"
                style={{ height: '90vh' }}
            >
                <div
                    className="controlsDemo-StackLayout__content__container controls__block-wrapper tr"
                    style={{ height: '200vh' }}
                >
                    <div className="controls__block controlsDemo-StackLayout__content">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget
                            nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit.
                            Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed
                            adipiscing diam donec adipiscing tristique. Mi eget mauris pharetra et.
                            Non tellus orci ac auctor augue. Elit at imperdiet dui accumsan sit.
                            Ornare arcu dui vivamus arcu felis. Egestas integer eget aliquet nibh
                            praesent. In hac habitasse platea dictumst quisque sagittis purus.
                            Pulvinar elementum integer enim neque volutpat ac.
                        </p>
                        <br />
                        <p>
                            Senectus et netus et malesuada. Nunc pulvinar sapien et ligula
                            ullamcorper malesuada proin. Neque convallis a cras semper auctor.
                            Libero id faucibus nisl tincidunt eget. Leo a diam sollicitudin tempor
                            id. A lacus vestibulum sed arcu non odio euismod lacinia. In tellus
                            integer feugiat scelerisque. Feugiat in fermentum posuere urna nec
                            tincidunt praesent. Porttitor rhoncus dolor purus non enim praesent
                            elementum facilisis. Nisi scelerisque eu ultrices vitae auctor eu augue
                            ut lectus. Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus.
                            Et malesuada fames ac turpis egestas sed. Sit amet nisl suscipit
                            adipiscing bibendum est ultricies. Arcu ac tortor dignissim convallis
                            aenean et tortor at. Pretium viverra suspendisse potenti nullam ac
                            tortor vitae purus. Eros donec ac odio tempor orci dapibus ultrices.
                            Elementum nibh tellus molestie nunc. Et magnis dis parturient montes
                            nascetur. Est placerat in egestas erat imperdiet. Consequat interdum
                            varius sit amet mattis vulputate enim.
                        </p>
                        <br />
                        <p>
                            Sit amet nulla facilisi morbi tempus. Nulla facilisi cras fermentum odio
                            eu. Etiam erat velit scelerisque in dictum non consectetur a erat. Enim
                            nulla aliquet porttitor lacus luctus accumsan tortor posuere. Ut sem
                            nulla pharetra diam. Fames ac turpis egestas maecenas. Bibendum neque
                            egestas congue quisque egestas diam. Laoreet id donec ultrices tincidunt
                            arcu non sodales neque. Eget felis eget nunc lobortis mattis aliquam
                            faucibus purus. Faucibus interdum posuere lorem ipsum dolor sit.
                        </p>
                        <br />
                        <p>
                            Et netus et malesuada fames ac. Erat pellentesque adipiscing commodo
                            elit at imperdiet dui accumsan. Sodales neque sodales ut etiam sit amet
                            nisl purus in. Maecenas volutpat blandit aliquam etiam. Sit amet luctus
                            venenatis lectus magna fringilla urna porttitor rhoncus. Egestas purus
                            viverra accumsan in nisl. Semper feugiat nibh sed pulvinar proin. Duis
                            convallis convallis tellus id interdum velit laoreet. Ante in nibh
                            mauris cursus mattis molestie. Ut etiam sit amet nisl purus in mollis
                            nunc. Feugiat sed lectus vestibulum mattis ullamcorper velit sed
                            ullamcorper. Tellus at urna condimentum mattis pellentesque id nibh
                            tortor id. Tristique magna sit amet purus gravida quis blandit turpis
                            cursus. Dolor sit amet consectetur adipiscing. Consequat ac felis donec
                            et odio pellentesque diam volutpat. Nunc sed augue lacus viverra vitae
                            congue. Mauris in aliquam sem fringilla ut morbi tincidunt augue.
                        </p>
                        <br />
                        <p>
                            Elementum eu facilisis sed odio morbi quis commodo odio. Mauris rhoncus
                            aenean vel elit scelerisque mauris pellentesque. Accumsan sit amet nulla
                            facilisi morbi tempus. Suscipit tellus mauris a diam maecenas sed enim
                            ut sem. Turpis egestas maecenas pharetra convallis posuere. Nibh
                            venenatis cras sed felis eget velit aliquet. Elementum nisi quis
                            eleifend quam adipiscing. Amet cursus sit amet dictum sit amet justo
                            donec enim. Odio pellentesque diam volutpat commodo sed egestas egestas
                            fringilla. Habitant morbi tristique senectus et netus et malesuada.
                            Imperdiet dui accumsan sit amet nulla facilisi morbi tempus iaculis. Ac
                            turpis egestas maecenas pharetra.
                        </p>
                        <br />
                        <p>
                            Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Ac
                            orci phasellus egestas tellus rutrum tellus pellentesque eu. Sit amet
                            consectetur adipiscing elit. Ultricies integer quis auctor elit. Odio
                            euismod lacinia at quis. Mi eget mauris pharetra et ultrices neque.
                            Ultricies lacus sed turpis tincidunt id aliquet. Nullam vehicula ipsum a
                            arcu. Congue quisque egestas diam in arcu cursus euismod. Sodales neque
                            sodales ut etiam sit. Nisl vel pretium lectus quam id leo in vitae.
                        </p>
                        <br />
                        <p>
                            Quis risus sed vulputate odio ut. Arcu vitae elementum curabitur vitae
                            nunc sed. Mauris a diam maecenas sed enim ut sem. Non enim praesent
                            elementum facilisis. Sapien nec sagittis aliquam malesuada bibendum arcu
                            vitae elementum. Nisi porta lorem mollis aliquam ut porttitor leo a. Nec
                            dui nunc mattis enim ut. Pellentesque adipiscing commodo elit at
                            imperdiet. Feugiat in fermentum posuere urna nec tincidunt praesent
                            semper feugiat. Pulvinar proin gravida hendrerit lectus a. Pellentesque
                            dignissim enim sit amet venenatis urna cursus eget. Euismod quis viverra
                            nibh cras pulvinar mattis nunc. Enim ut sem viverra aliquet eget. Nunc
                            aliquet bibendum enim facilisis gravida. Non diam phasellus vestibulum
                            lorem. Ultrices dui sapien eget mi proin.
                        </p>
                        <br />
                        <p>
                            Maecenas sed enim ut sem viverra aliquet. Mattis molestie a iaculis at
                            erat pellentesque adipiscing commodo elit. Tincidunt id aliquet risus
                            feugiat. Imperdiet sed euismod nisi porta lorem mollis aliquam ut.
                            Ultrices eros in cursus turpis massa tincidunt dui. Fusce ut placerat
                            orci nulla pellentesque dignissim. Pellentesque id nibh tortor id
                            aliquet lectus proin nibh. Adipiscing elit pellentesque habitant morbi
                            tristique senectus. Convallis convallis tellus id interdum. Arcu dictum
                            varius duis at consectetur lorem donec. Sagittis nisl rhoncus mattis
                            rhoncus urna neque viverra. Accumsan lacus vel facilisis volutpat est
                            velit egestas dui id. Imperdiet sed euismod nisi porta lorem mollis
                            aliquam ut. Pulvinar etiam non quam lacus. In hendrerit gravida rutrum
                            quisque non tellus orci ac. Nunc vel risus commodo viverra. Scelerisque
                            mauris pellentesque pulvinar pellentesque. Semper risus in hendrerit
                            gravida rutrum quisque non tellus orci.
                        </p>
                        <br />
                        <p>
                            Elit at imperdiet dui accumsan sit amet nulla. Eros donec ac odio tempor
                            orci dapibus. Et netus et malesuada fames ac turpis egestas sed. Nullam
                            ac tortor vitae purus faucibus ornare. Duis at consectetur lorem donec
                            massa sapien. Mi eget mauris pharetra et ultrices neque. Praesent
                            tristique magna sit amet. Porttitor lacus luctus accumsan tortor. Non
                            nisi est sit amet facilisis. Iaculis urna id volutpat lacus laoreet non
                            curabitur. Leo urna molestie at elementum eu facilisis sed odio.
                            Pellentesque habitant morbi tristique senectus et netus et. Iaculis at
                            erat pellentesque adipiscing commodo elit at imperdiet dui. Tempus
                            imperdiet nulla malesuada pellentesque elit eget. Neque convallis a cras
                            semper. Iaculis at erat pellentesque adipiscing.
                        </p>
                        <br />
                        <p>
                            Adipiscing vitae proin sagittis nisl rhoncus mattis. Lorem mollis
                            aliquam ut porttitor leo. In pellentesque massa placerat duis. Netus et
                            malesuada fames ac turpis egestas integer. Tempor nec feugiat nisl
                            pretium fusce. Tellus pellentesque eu tincidunt tortor aliquam. Purus
                            non enim praesent elementum facilisis leo vel. Diam vulputate ut
                            pharetra sit amet. Nunc consequat interdum varius sit amet mattis
                            vulputate. Volutpat maecenas volutpat blandit aliquam etiam erat velit
                            scelerisque in. Justo nec ultrices dui sapien eget mi proin sed. Sodales
                            ut eu sem integer vitae justo eget magna. Gravida cum sociis natoque
                            penatibus. Pellentesque habitant morbi tristique senectus. Fames ac
                            turpis egestas integer eget aliquet.
                        </p>
                    </div>
                </div>
            </Container>
        );
    }, []);

    return (
        <div className="controlsDemo-StackLayout__container">
            <Stack
                className="controlsDemo-StackLayout"
                backgroundStyle="unaccented"
                bodyContentTemplate={getBodyContentTemplate()}
                headingCaption={'Заголовок шапки'}
                rightBorderVisible={false}
                headerBorderVisible={false}
            />
        </div>
    );
}
