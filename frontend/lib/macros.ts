import { Result } from "ts-results-es";

export default function $try<T, E>(result: Result<T, E>) {
  // @ts-ignore
  $$escape!(() => {
    if (result.isErr()) {
      return result;
    }
  });
  return result.unwrap();
}
