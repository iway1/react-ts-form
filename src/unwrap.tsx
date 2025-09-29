import * as z from "zod";
import {
	HIDDEN_ID_PROPERTY,
	isSchemaWithHiddenProperties,
} from "./createFieldSchema";
import type { RTFSupportedZodTypes } from "./supportedZodTypes";

export type UnwrappedRTFSupportedZodTypes = {
	type: RTFSupportedZodTypes;
	[HIDDEN_ID_PROPERTY]: string | null;
};

export function unwrap(
	type: RTFSupportedZodTypes,
): UnwrappedRTFSupportedZodTypes {
	// Realized zod has a built in "unwrap()" function after writing this.
	// Not sure if it's super necessary.
	let r = type;
	const unwrappedHiddenId: null | string = null;

  while (r instanceof z.ZodOptional || r instanceof z.ZodNullable) {
    switch (r._zod.def.type) {
      case "optional":
          r = (r as z.ZodOptional<RTFSupportedZodTypes>).unwrap();
          break;
      case "nullable":
          r = (r as z.ZodNullable<RTFSupportedZodTypes>).unwrap();
          break;
    }
  }

	let innerHiddenId: null | string = null;

	if (isSchemaWithHiddenProperties(r)) {
		innerHiddenId = r._def[HIDDEN_ID_PROPERTY];
	}

	return {
		type: r,
		[HIDDEN_ID_PROPERTY]: innerHiddenId || unwrappedHiddenId,
	};
}