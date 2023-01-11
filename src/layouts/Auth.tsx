import React, {useCallback, useEffect, useState} from 'react';
import {getCurrentUser, UserInfoResponse} from '@/apis/auth';

import {goURL} from '@/helpers/router';
import {AxiosResponse} from "axios";

interface IProps {
  children: React.ReactElement;
}

const Auth: React.FC<IProps> = ({ children }) => {
  const [renderRoute, setRenderRoute] = useState(false);
  const [authenticated, setAuthenticated] = useState(window.localStorage.getItem("authenticated"));
  const [authenticating, setAuthenticating] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response: AxiosResponse<UserInfoResponse> = await getCurrentUser();
      if (response && response.data && response.data.query && response.data.query.userinfo && response.data.query.userinfo.id !== 0) {
        window.postMessage("authenticated", "*");
        window.localStorage.setItem("authenticated", "true");
        window.localStorage.setItem("currentUser", JSON.stringify(response.data.query.userinfo));
        setAuthenticated("true");
        setAuthenticating(false);
      } else {
        setAuthenticated("false");
        setAuthenticating(false);
        goURL('/wiki/Special:UserLogin?redirect=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash));
      }
    } catch (error) {
      setAuthenticated("false");
      setAuthenticating(false);
      goURL('/wiki/Special:UserLogin?redirect=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash));
    }
    setRenderRoute(true);
  }, []);

  useEffect(() => {
    if (!authenticated && !authenticating) {
      setAuthenticating(true);
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  return renderRoute ? children : null;
};

export default Auth;
