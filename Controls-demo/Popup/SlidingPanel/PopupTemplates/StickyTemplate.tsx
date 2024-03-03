import { Sticky } from 'Controls/popupTemplate';
import { forwardRef } from 'react';
import 'css!Controls-demo/Popup/SlidingPanel/PopupTemplates/PopupTemplates';

function Template(props) {
    return (
        <Sticky
            onPopupDragStart={props.onPopupDragStart}
            onPopupDragMove={props.onPopupDragMove}
            onPopupDragEnd={props.onPopupDragEnd}
            customEvents={['onPopupDragStart', 'onPopupDragMove', 'onPopupDragEnd']}
            slidingPanelOptions={props.slidingPanelOptions}
            allowAdaptive={props.allowAdaptive}
            headerContentTemplate={() => {
                return <div style={{ width: '100%' }}>Контент шапки стики окна</div>;
            }}
            bodyContentTemplate={() => {
                return (
                    <div style={{ paddingLeft: 'var(--offset_s)' }}>
                        <div>Контент стики окна</div>
                        <div>
                            <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
                                animi corporis quisquam suscipit ut vitae. Architecto, at doloribus
                                dolorum eos error facilis inventore molestiae omnis sed tempora
                                tempore vero.
                            </div>
                            <div>
                                Accusantium amet animi aut autem dignissimos dolor eum fuga fugit
                                maiores officiis quasi quibusdam recusandae rem, repellendus
                                reprehenderit tempora vero? Accusamus aliquam aspernatur labore
                                molestiae numquam odio officia perspiciatis quidem.
                            </div>
                            <div>
                                Aliquam culpa dicta dignissimos dolorum earum eveniet exercitationem
                                hic ipsa, maxime omnis qui quia quis repellendus rerum saepe totam
                                vero? Consequuntur earum, illum laudantium nam necessitatibus omnis
                                perferendis quae veniam?
                            </div>
                        </div>
                    </div>
                );
            }}
        />
    );
}

export default forwardRef(Template);
