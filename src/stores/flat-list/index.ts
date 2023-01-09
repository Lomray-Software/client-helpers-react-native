import _ from 'lodash';
import { action, makeObservable, observable } from 'mobx';

export type IRequestReturn<TEntity> = { count: number; list: TEntity[]; page: number } | undefined;

interface IFlatListStoreParams<TEntity> {
  getEntities: (page?: number) => Promise<IRequestReturn<TEntity>>;
  keyName?: string;
  pageSize?: number;
}

/**
 * Flat list store
 */
class FlatListStore<TEntity, TExtractor = TEntity> {
  /**
   * List of entities
   */
  public entities: TEntity[] = [];

  /**
   * Indicates than API request in process
   */
  public isFetching = false;

  /**
   * Indicates than flat list renders first time
   * @private
   */
  public isFirstRender = true;

  /**
   * Total entities count
   */
  public totalEntities = 0;

  /**
   * Current page
   * @private
   */
  private currentPage = 1;

  /**
   * Default page size
   * @private
   */
  public pageSize: number;

  /**
   * Key extractor property name
   * @private
   */
  private readonly keyName: string;

  /**
   * Get flat list entities
   * @private
   */
  public readonly getEntities: IFlatListStoreParams<TEntity>['getEntities'];

  /**
   * @constructor
   */
  constructor({ getEntities, pageSize = 5, keyName = 'id' }: IFlatListStoreParams<TEntity>) {
    this.getEntities = this.wrapRequest(getEntities);
    this.pageSize = pageSize;
    this.keyName = keyName;

    makeObservable(this, {
      entities: observable,
      totalEntities: observable,
      isFetching: observable,
      pageSize: observable,
      isFirstRender: observable,
      setEntities: action.bound,
      getNextPage: action.bound,
      setFetching: action.bound,
      setTotalCountEntities: action.bound,
      resetIsFirstRender: action.bound,
    });
  }

  /**
   * Reset state before retry requests
   */
  public resetIsFirstRender(): void {
    this.isFirstRender = true;
  }

  /**
   * Set flat list entities
   */
  public setEntities(entities: TEntity[], shouldAdd = false) {
    if (shouldAdd) {
      this.entities = _.uniqBy([...this.entities, ...entities], 'id');
    } else {
      this.entities = entities;
    }
  }

  /**
   * Wrapper for get entities
   */
  public wrapRequest(
    callback: IFlatListStoreParams<TEntity>['getEntities'],
  ): IFlatListStoreParams<TEntity>['getEntities'] {
    return async (pageVal) => {
      this.setFetching(true);

      const result = await callback(pageVal);

      this.setFetching(false);

      if (result === undefined) {
        return;
      }

      const { list, count, page } = result;

      this.currentPage = page;
      this.setTotalCountEntities(count);
      this.setEntities(list, page > 1);

      return result;
    };
  }

  /**
   * Toggle fetching
   */
  public setFetching(isFetching: boolean): void {
    this.isFetching = isFetching;

    if (!this.isFetching) {
      this.isFirstRender = false;
    }
  }

  /**
   * Extract key from entity for flat list
   */
  public keyExtractor = (entity: TExtractor) => String(entity[this.keyName]);

  /**
   * Lazy load pagination
   */
  public getNextPage(): Promise<IRequestReturn<TEntity>> | undefined {
    if (this.currentPage * this.pageSize >= this.totalEntities) {
      return;
    }

    if (this.entities.length >= this.totalEntities) {
      return;
    }

    if (this.currentPage === 1 && this.totalEntities < this.pageSize) {
      return;
    }

    return this.getEntities(this.currentPage + 1);
  }

  /**
   * Set count entities
   */
  public setTotalCountEntities(count: number): void {
    this.totalEntities = count;
  }
}

export default FlatListStore;
