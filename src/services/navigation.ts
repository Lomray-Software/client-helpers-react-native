interface ITabsInfo {
  [tabIndex: number]: {
    componentId: string;
    componentName: string;
  };
}

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
   * Component id and name by tab
   * @private
   */
  private tabsInfo: ITabsInfo = {};

  /**
   * Current bottom tab number
   * @private
   */
  private bottomTabId = 0;

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
    this.tabsInfo[this.bottomTabId] = { componentId, componentName };
  }

  /**
   * Update bottom tab info
   */
  public setBottomTabInfo(bottomTabId: number, prevBottomTabId?: number): void {
    this.prevBottomTabId = prevBottomTabId ?? this.bottomTabId;
    this.bottomTabId = bottomTabId;
  }

  /**
   * Get current component id
   */
  public getComponentId(): string {
    return this.componentId;
  }

  /**
   * Get current component id for tab
   */
  public getTabComponentId(bottomTabId?: number): string | undefined {
    return this.tabsInfo[bottomTabId ?? this.bottomTabId]?.componentId;
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
