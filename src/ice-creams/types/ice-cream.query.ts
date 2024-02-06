import { IceCream } from '../entities/ice-cream.entity';

export interface IceCreamQuery {
  iceCreams: IceCream[];
  meta: {
    totalEntitiesCount: number;
    queryEntitiesCount: number;
  };
}
