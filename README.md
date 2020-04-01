# use-needed-state

It looks the same as regualr `useState`, but it'll watch what parts of state were actually used during the render. If state is updated, but used part of state is equal - it'll skip re-render

## example

We'll create simple component with state that is object with 2 values.

One is 'loggedUserName' which is some string, and another is 'showLoggedUserInfo' which is boolean indicating if we want to show logged user name or no.

If 'showLoggedUserInfo' is false - we're not even accessing user name during the render.

It means that when user name will change while we're not showing it - we don't have to re-render and this is exactly what will happen.

```tsx
import React from 'react';
import { useNeededState } from 'use-needed-state';

interface AppInfo {
  loggedUserName: string;
  showLoggedUserInfo: boolean;
}

function SomeComponent() {
  /**
   * Initialize state the same way as with `useState`
   */
  const [appInfo, setAppInfo] = useNeededState<AppInfo>({
    // name of our user
    loggedUserName: 'Bob',
    // indicator telling if we want to show logged user name
    showLoggedUserInfo: false,
  });

  /**
   * If `showLoggedUserInfo` is false - we'll not even use
   * logged user name during the render, so we "dont care" what it is
   * It means that if loggedUserName will change - we don't have to
   * re-render as it'll not impact the result of rendering
   */
  if (!appInfo.showLoggedUserInfo) {
    return (
      <div>
        Hello!
        {/* if we'll change user name while `showLoggedUserInfo` is false - component will not re-render */}
        <button onClick={changeUserName}>Change user name</button>
        <button onClick={toggleShowUserInfo}>Toggle show user info</button>
      </div>
    );
  }

  /**
   * If showLoggedUserInfo is true - we're actually accessing user name
   * so now component will re-render if it's changed in the state
   */
  return <div>Hello, {appInfo.loggedUserName}!</div>;

  function changeUserName() {
    const newName = window.prompt('New name');

    setAppInfo((state) => {
      return { ...state, loggedUserName: newName };
    });
  }

  function toggleShowUserInfo() {
    setAppInfo((state) => {
      return { ...state, showLoggedUserInfo: !state.showLoggedUserInfo };
    });
  }
}
```
