import wait from '@lomray/client-helpers/helpers/wait';
import _ from 'lodash';
import { action, makeObservable, observable, runInAction } from 'mobx';

export type IRequestReturn<TEntity> = { count: number; list: TEntity[]; page: number } | undefined;

export type TGetEntities<TEntity> = (page?: number) => Promise<IRequestReturn<TEntity>>;

export interface IFlatListStoreParams<TEntity, TStore> {
  method: keyof TStore;
  /**
   * Initial entities
   */
  entities?: TEntity[];
  /**
   * Initial total entities
   */
  totalEntities?: number;
  /**
   * Initial page
   */
  initPage?: number;
  keyName?: keyof TEntity;
  pageSize?: number;
  /**
   * First request delay to prevent flickering
   */
  firstDelay?: number;
}

/**
 * Flat list store
 */
class FlatListStore<TEntity, TExtractor = TEntity, TStore = never> {
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
   */
  public isFirstRender = true;

  /**
   * Total entities count
   */
  public totalEntities = 0;

  /**
   * Current page
   */
  private currentPage = 1;

  /**
   * Default page size
   */
  public pageSize = 10;

  /**
   * Key extractor property name
   */
  private readonly keyName: string;

  /**
   * Delay first request to prevent flickering
   */
  private readonly firstDelay;

  /**
   * Get flat list entities method
   */
  private readonly method: IFlatListStoreParams<TEntity, TStore>['method'];

  /**
   * @private
   */
  private readonly store: TStore;

  /**
   * @constructor
   */
  constructor(
    store: TStore,
    {
      method,
      entities,
      firstDelay = 0,
      totalEntities = 0,
      initPage = 1,
      pageSize = 10,
      keyName,
    }: IFlatListStoreParams<TEntity, TStore>,
  ) {
    // @ts-ignore
    store[method] = this.wrapRequest(store[method]);

    this.store = store;
    this.method = method;
    this.entities = entities ?? [];
    this.totalEntities = totalEntities;
    this.currentPage = initPage;
    this.pageSize = pageSize;
    // @ts-ignore
    this.keyName = keyName || 'id';
    this.firstDelay = firstDelay;

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
      this.entities = _.uniqBy([...this.entities, ...entities], this.keyName);
    } else {
      this.entities = entities;
    }
  }

  /**
   * Wrapper for get entities
   */
  public wrapRequest(callback: TGetEntities<TEntity>): TGetEntities<TEntity> {
    return async (pageVal) => {
      this.setFetching(true);

      const startTime = Date.now();
      const result = await callback(pageVal);

      if (this.firstDelay && Date.now() - startTime < this.firstDelay) {
        await wait(this.firstDelay);
      }

      runInAction(() => {
        this.setFetching(false);

        if (result === undefined) {
          return;
        }

        const { list, count, page } = result;

        this.currentPage = page;
        this.setTotalCountEntities(count);
        this.setEntities(list, page > 1);
      });

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

    // @ts-ignore
    return this.store[this.method](this.currentPage + 1) as Promise<IRequestReturn<TEntity>>;
  }

  /**
   * Set count entities
   */
  public setTotalCountEntities(count: number): void {
    this.totalEntities = count;
  }
}

export default FlatListStore;
