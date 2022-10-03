import auth from '@react-native-firebase/auth';
import type { ConfigureParams } from '@react-native-google-signin/google-signin';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from '../../services/config';

interface IGoogleOptions {
  config?: ConfigureParams & { webClientId: string };
}

const initGoogleProvider = (config?: ConfigureParams) =>
  GoogleSignin.configure({
    offlineAccess: true,
    ...Config.get('googleSignInConfig', {}),
    ...config,
  });

/**
 * Sign in through Google
 */
const GoogleSignIn = async ({ config }: IGoogleOptions = {}) => {
  initGoogleProvider(config);

  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
};

/**
 * Sign out from Google
 * @constructor
 */
const GoogleSignOut = ({ config }: IGoogleOptions = {}): Promise<null> | undefined => {
  initGoogleProvider(config);

  try {
    // For android need special logout
    const isGoogleProvider = auth().currentUser?.providerData.some(
      ({ providerId }) => providerId === 'google.com',
    );

    if (isGoogleProvider) {
      return GoogleSignin.signOut();
    }
  } catch (e) {
    Config.get('logger')?.error('Failed to sign out from Google:', e);
  }

  return undefined;
};

export { GoogleSignIn, GoogleSignOut };
