import { action, makeObservable, observable } from 'mobx';

/**
 * Simple switch store
 */
class SwitchStore {
  /**
   * State
   */
  public isVisible = false;

  /**
   * @constructor
   */
  constructor() {
    makeObservable(this, {
      isVisible: observable,
      onOpen: action.bound,
      onClose: action.bound,
    });
  }

  /**
   * Open
   */
  public onOpen(): void {
    this.isVisible = true;
  }

  /**
   * Close
   */
  public onClose(): void {
    this.isVisible = false;
  }

  /**
   * Toggle
   */
  public onToggle(): void {
    this.isVisible = !this.isVisible;
  }
}

export default SwitchStore;
