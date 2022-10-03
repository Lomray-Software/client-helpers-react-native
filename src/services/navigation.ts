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
   * Set current component id
   */
  public setComponentId(componentId: string): void {
    this.componentId = componentId;
  }

  /**
   * Get current component id
   */
  public getComponentId(): string {
    return this.componentId;
  }
}

export default new Navigation();
