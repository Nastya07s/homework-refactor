
import { db, Widget } from './db';

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
