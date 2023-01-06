import {MappableProp, PropsMapping} from '../types/props';

export function mapPropsToObject(propsMap: PropsMapping) {
  const r: {[key in MappableProp]+?: string} = {};

  for (const [mappable, toProp] of propsMap) {
    r[mappable] = toProp;
  }

  return r;
}
