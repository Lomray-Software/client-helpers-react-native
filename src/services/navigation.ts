/**
 * Navigation service
 */
class Navigation {
  /**
   * Current component id
   * @private
   */
  private componentId: string;

  /**
   * Current component name
   * @private
   */
  private componentName: string;

  /**
   * Current bottom tab number
   * @private
   */
  private bottomTabId: number;

  /**
   * Previous bottom tab number
   * @private
   */
  private prevBottomTabId: number;

  /**
   * Set current component id
   */
  public setComponentInfo(componentId: string, componentName: string): void {
    this.componentId = componentId;
    this.componentName = componentName;
  }

  /**
   * Update bottom tab info
   */
  public setBottomTabInfo(bottomTabId: number, prevBottomTabId: number): void {
    this.bottomTabId = bottomTabId;
    this.prevBottomTabId = prevBottomTabId;
  }

  /**
   * Get current component id
   */
  public getComponentId(): string {
    return this.componentId;
  }

  /**
   * Get current component id
   */
  public getComponentName(): string {
    return this.componentName;
  }

  /**
   * Get current bottom tab id
   */
  public getBottomTabId(): number {
    return this.bottomTabId;
  }

  /**
   * Get previous bottom tab id
   */
  public getPrevBottomTabId(): number {
    return this.prevBottomTabId;
  }
}

export default new Navigation();
