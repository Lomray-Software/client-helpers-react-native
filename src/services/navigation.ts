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
   * Set current component id
   */
  public setComponentInfo(componentId: string, componentName: string): void {
    this.componentId = componentId;
    this.componentName = componentName;
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
}

export default new Navigation();
