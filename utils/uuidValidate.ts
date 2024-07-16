import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";

export function uuidValidateV4(uuid: string) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}
