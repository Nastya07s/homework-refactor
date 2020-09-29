import * as _ from 'underscore';
import { db, Widget, DataLinkKey } from './db';

const arrify = require('arrify');
const maxDepth = 58;

export function getWidget(
  tenantId: string,
  cardUuid: string,
  uuid: string
): Promise<Widget | undefined> {
  return Promise.resolve(
    db.find(
      (x) =>
        x.tenantId === tenantId && x.cardUuid === cardUuid && x.uuid === uuid
    )
  );
}

const getDataLinkKeysToLoad = (widgets: Widget[]): any => {
  const [widgetsToLoad] = widgets.map((widget) => {
    const dataLinkObject = widget.dataLink || {};
    const linkedObjectWithId = _.mapObject(
      dataLinkObject,
      (value) => value.widgetKey
    );
    const linkedObject = _.values(linkedObjectWithId);
    return linkedObject;
  });
  return widgetsToLoad;
};

const checkLoad = (widget: DataLinkKey, loadedWidgets: Widget[]) => {
  const isNeedToLoad = !loadedWidgets.find(
    (loadedWidget) =>
      widget.cardUuid === loadedWidget.cardUuid &&
      widget.widgetUuid === loadedWidget.uuid
  );
  return isNeedToLoad;
};

const filterWidgetsToLoad = (
  widgetsToLoad: DataLinkKey[],
  loadedWidgets: Widget[]
) => {
  return _.uniq(
    widgetsToLoad.filter((widget) => checkLoad(widget, loadedWidgets)),
    false,
    (x) => `${x.tenantId}${x.cardUuid}${x.widgetUuid}`
  );
};

const getNewLoadedWidgets = async (widgetsToLoadFiltered: DataLinkKey[]) => {
  const loadedChunk = await Promise.all(
    widgetsToLoadFiltered.map((k) =>
      getWidget(k.tenantId, k.cardUuid, k.widgetUuid)
    )
  );
  const filteredChunk = loadedChunk.filter((x) => x) as Widget[];
  return filteredChunk;
};

//FIXME: In the future there might be passed another traversal algorithm
export async function getDataLinkWidgetsChain(
  widgetOrWidgets: Widget | Widget[]
): Promise<Widget[]> {
  const widgets = arrify(widgetOrWidgets);

  let loadedWidgets: Widget[] = [...widgets];
  let widgetsToLoad: DataLinkKey[] = getDataLinkKeysToLoad(widgets);

  //limit maximum resolution depth
  for (let depth = 0; depth < maxDepth; depth++) {
    if (!widgetsToLoad.length) break;

    const widgetsToLoadFiltered = filterWidgetsToLoad(widgetsToLoad, loadedWidgets);

    if (!widgetsToLoadFiltered.length) break;

    const newLoadedWidgets = await getNewLoadedWidgets(widgetsToLoadFiltered);

    loadedWidgets = [...loadedWidgets, ...newLoadedWidgets];
    widgetsToLoad = getDataLinkKeysToLoad(newLoadedWidgets);
  }

  return loadedWidgets;
}
