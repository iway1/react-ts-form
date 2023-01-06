import {RTFSupportedZodTypes} from '../types/zod';

import {isZodTypeEqual} from './isZodTypeEqual';
import {duplicateTypeError, printWarningsForSchema} from './logging';

export function detectDuplicateTypes(array: RTFSupportedZodTypes[]) {
  var combinations = array.flatMap((v, i) =>
    array.slice(i + 1).map((w) => [v, w] as const),
  );
  for (const [a, b] of combinations) {
    printWarningsForSchema(a);
    printWarningsForSchema(b);
    if (isZodTypeEqual(a!, b)) {
      duplicateTypeError();
    }
  }
}
