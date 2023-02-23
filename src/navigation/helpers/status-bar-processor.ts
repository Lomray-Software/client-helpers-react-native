import type { OptionsStatusBar } from 'react-native-navigation';
import { Navigation } from 'react-native-navigation';
import Config from '../../services/config';
import NavigationService from '../../services/navigation';

/**
 * Handle status bar options
 */
class StatusBarProcessor {
  /**
   * @private
   */
  private static isAttached = false;

  /**
   * Attach processor
   */
  public static attach(): void {
    if (StatusBarProcessor.isAttached) {
      return;
    }

    StatusBarProcessor.isAttached = true;

    Navigation.addOptionProcessor<OptionsStatusBar>(
      'statusBar',
      (statusBar: OptionsStatusBar): OptionsStatusBar => {
        // prevent loop
        if (!statusBar['preventLoop']) {
          Navigation.mergeOptions(NavigationService.getOverlayId(), {
            statusBar: {
              ...statusBar,
              // @ts-ignore prevent loop
              preventLoop: true,
            },
          });
        }

        return statusBar;
      },
    );

    Config.get('logger')?.info('Status bar processor attached.');
  }
}

export default StatusBarProcessor;
