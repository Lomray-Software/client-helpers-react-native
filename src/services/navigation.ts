interface ITabsInfo {
  [tabIndex: number | string]: {
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
   * Opened overlays
   * @private
   */
  private overlayStack: { id: string; name: string }[] = [];

  /**
   * Last modal id
   * @private
   */
  private modalId: string;

  /**
   * Last modal name
   * @private
   */
  private modalName: string;

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
   * Set current component info
   */
  public setComponentInfo(componentId: string, componentName: string): void {
    this.componentId = componentId;
    this.componentName = componentName;

    const tabId = this.modalId || this.bottomTabId;

    this.tabsInfo[tabId] = { componentId, componentName };
  }

  /**
   * Update bottom tab info
   */
  public setBottomTabInfo(bottomTabId: number, prevBottomTabId?: number): void {
    this.prevBottomTabId = prevBottomTabId ?? this.bottomTabId;
    this.bottomTabId = bottomTabId;
  }

  /**
   * Set overlay info
   */
  public setOverlayInfo(overlayId: string, overlayName: string): void {
    this.overlayStack.push({
      id: overlayId,
      name: overlayName,
    });
  }

  /**
   * Remove overlay from stack
   */
  public closeOverlay(overlayId: string, overlayName: string): void {
    this.overlayStack = this.overlayStack.filter(
      ({ id, name }) => id !== overlayId && name !== overlayName,
    );
  }

  /**
   * Set modal info
   */
  public setModalInfo(modalId: string, modalName: string): void {
    this.modalId = modalId;
    this.modalName = modalName;
  }

  /**
   * Close modal
   */
  public closeModal(): void {
    this.modalId = '';
    this.modalName = '';

    // restore nav info
    const { componentId, componentName } = this.tabsInfo[this.bottomTabId];

    this.componentId = componentId;
    this.componentName = componentName;
  }

  /**
   * Get current overlay id
   */
  public getOverlayId(): string {
    return this.overlayStack?.[this.overlayStack.length - 1]?.id;
  }

  /**
   * Get current overlay name
   */
  public getOverlayName(): string {
    return this.overlayStack?.[this.overlayStack.length - 1]?.name;
  }

  /**
   * Get current modal id
   */
  public getModalId(): string {
    return this.modalId;
  }

  /**
   * Get current overlay name
   */
  public getModalName(): string {
    return this.modalName;
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
    const tabId = this.modalId || this.bottomTabId;

    return this.tabsInfo[bottomTabId ?? tabId]?.componentId;
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
