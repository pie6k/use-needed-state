import React from 'react';
import { useNeededState } from './index';

interface AppInfo {
  loggedUserName: string;
  showLoggedUserInfo: boolean;
}

function SomeComponent() {
  /**
   * Initialize state the same way as with `useState`
   */
  const [appInfo, setAppInfo] = useNeededState<AppInfo>({
    loggedUserName: 'Bob',
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
