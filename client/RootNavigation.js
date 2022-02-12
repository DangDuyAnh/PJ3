import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigate(name, params = null) {
  if (navigationRef.isReady()) {
    if (params === null) {
    navigationRef.navigate(name);
    } else {
        navigationRef.navigate(name, params);
    }
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
