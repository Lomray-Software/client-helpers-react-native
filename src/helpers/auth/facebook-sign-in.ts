import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

/**
 * Sign in through Facebook
 */
const FacebookSignIn = async () => {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
    'user_friends',
  ]);

  if (result.isCancelled) {
    const error = new Error('User cancelled the login process');

    // @ts-ignore set this for prevent show error
    error.code = '-5';

    throw error;
  }

  // Once signed in, get the users AccessToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw new Error('Something went wrong obtaining access token');
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
};

export default FacebookSignIn;
