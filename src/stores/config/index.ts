import type { MatchKeyTypes } from '@lomray/client-helpers/interfaces';
import { action, makeObservable, observable } from 'mobx';

type TParamsKeys<TS> = keyof TS;
type TParamsBool<TS> = MatchKeyTypes<TS, boolean>;
type TParamsInt<TS> = MatchKeyTypes<TS, number>;

/**
 * Storage for global application parameters
 */
class ConfigStore<TParams> {
  static isGlobal = true;

  /**
   * State
   */
  public params: TParams;

  /**
   * @constructor
   */
  constructor() {
    makeObservable(this, {
      params: observable,
      set: action.bound,
      enable: action.bound,
      disable: action.bound,
      increase: action.bound,
      decrease: action.bound,
    });
  }

  /**
   * Set value of key
   */
  public set<TKey extends TParamsKeys<TParams>>(key: TKey, value: TParams[TKey]): void {
    this.params[key] = value;
  }

  /**
   * Get param value
   */
  public get<TKey extends TParamsKeys<TParams>>(key: TKey): TParams[TKey] {
    return this.params[key];
  }

  /**
   * Toggle on
   */
  public enable<TKey extends TParamsBool<TParams>>(key: TKey): void {
    // @ts-ignore
    this.params[key] = true;
  }

  /**
   * Toggle off
   */
  public disable<TKey extends TParamsBool<TParams>>(key: TKey): void {
    // @ts-ignore
    this.params[key] = false;
  }

  /**
   * Return key value
   */
  // @ts-ignore
  public isEnabled = <TKey extends TParamsBool<TParams>>(key: TKey): boolean => this.params[key];

  /**
   * Check value
   */
  public is = <TKey extends TParamsKeys<TParams>>(key: TKey, value: any): boolean =>
    this.params[key] === value;

  /**
   * Increase param
   */
  public increase<TKey extends TParamsInt<TParams>>(key: TKey): void {
    // @ts-ignore
    this.params[key] += 1;
  }

  /**
   * Increase decrease
   */
  public decrease<TKey extends TParamsInt<TParams>>(key: TKey): void {
    // @ts-ignore
    this.params[key] -= 1;
  }
}

export default ConfigStore;
