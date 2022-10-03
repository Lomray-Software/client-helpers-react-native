import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

/**
 * Sign in through Apple
 */
const AppleSignIn = async () => {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // Create a Firebase credential from the response
  const { identityToken, nonce, fullName } = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

  const { givenName, familyName, middleName, nickname } = fullName || {};

  // Sign the user in with the credential
  await auth().signInWithCredential(appleCredential);
  await auth().currentUser?.updateProfile({
    displayName:
      [givenName, familyName, middleName].filter(Boolean).join(' ') || nickname || 'Unknown',
  });
};

export default AppleSignIn;
