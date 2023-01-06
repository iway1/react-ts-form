import {z} from 'zod';
import {
  addHiddenProperties,
  createUniqueFieldSchema,
  duplicateIdErrorMessage,
  HIDDEN_ID_PROPERTY,
  isSchemaWithHiddenProperties,
} from '../utils/createFieldSchema';

describe('createFieldSchema', () => {
  it('should throw an error if an ID is used twice', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      createUniqueFieldSchema(z.string(), 'id');
      createUniqueFieldSchema(z.string(), 'id');
    }).toThrowError(duplicateIdErrorMessage('id'));
    jest.spyOn;
  });
});

describe('addHiddenProperties', () => {
  it("should add '_rtf_id' to the schema and should be typed as a schema with hidden properties", () => {
    const id = 'a fake id';
    const schema = z.object({id: z.string()});
    const withHiddenProperties = addHiddenProperties(schema, {
      [HIDDEN_ID_PROPERTY]: id,
    });
    expect(
      isSchemaWithHiddenProperties(withHiddenProperties) &&
        withHiddenProperties[HIDDEN_ID_PROPERTY] === id,
    ).toStrictEqual(true);
  });
});
