import {ItemTemplate, IItemTemplateProps} from 'Controls/list';

export default function Template(props: IItemTemplateProps) {
    const items = props.items;
    const getColor = (item) => {
        const value = item.value.color;
        return value.indexOf('--') !== -1 ? 'var(' + value + ')' : value;
    };

    return (
        <ItemTemplate {...props}
                      contentTemplate={(templateProps: IItemTemplateProps) => {
                          const item = templateProps.item.item;
                          const title = item.get('title');
                          const keys = item.get('keys') || [];
                          if (!keys || (keys && keys.length < 1)) {
                              return (
                                  <div className="Controls-Colors-demo_list_lineHeight">
                                      {
                                          title
                                      }
                                  </div>
                              );
                          }
                          const titleResult = [];
                          const iconResult = [];
                          items.forEach((item) => {
                              if (keys.includes(item.id)) {
                                  const itemType = item.type;
                                  if (itemType === 'color') {
                                      titleResult.push(
                                          <div style={{color: getColor(item)}}
                                          >
                                              {
                                                  title
                                              }
                                          </div>
                                      );
                                  }
                                  if (itemType === 'style') {
                                      titleResult.push(
                                          <div style={{
                                                   color: getColor(item),
                                                   fontWeight: item.value.style.b ? 'bold' : 'normal',
                                                   fontStyle: item.value.style.i ? 'italic' : 'normal',
                                                   textDecoration: item.value.style.s ? 'line-through' : 'none',
                                                   borderBottom: item.value.style.u ? ('1px solid ' + getColor(item)) : ''
                                               }}
                                          >
                                              {
                                                  title
                                              }
                                          </div>
                                      );
                                  }
                                  if (item.icon) {
                                      iconResult.push(
                                          <div className={'Controls-Colors-demo_iconItem controls-margin_left-s icon-' +
                                              item.icon + ' controls-icon_style-' + item.iconStyle +
                                              ' controls-icon_size-' + item.iconSize}
                                               key={item.icon}
                                          >
                                          </div>
                                      );
                                  }
                              }
                          });
                          return (
                              <div className="tw-flex tw-justify-between Controls-Colors-demo_list_lineHeight">
                                  {
                                      titleResult.length >= 1 ? titleResult : title
                                  }
                                  <div className="tw-flex">
                                      {
                                          iconResult.length >= 1 && iconResult
                                      }
                                  </div>
                              </div>
                          );
                      }}
        />
    );
}
