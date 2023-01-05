import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {selectIsAuthenticated, setAuthenticated, setCurrentUser} from '@/store/slices/authSlice';
import {getCurrentUser, UserInfoResponse} from '@/apis/auth';

import { getToken } from '@/helpers/local-storage';
import { goURL } from '@/helpers/router';
import {AxiosResponse} from "axios";

interface IProps {
  children: React.ReactElement;
}

const Auth: React.FC<IProps> = ({ children }) => {
  const [renderRoute, setRenderRoute] = useState(false);
  const dispatch = useDispatch();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response: AxiosResponse<UserInfoResponse> = await getCurrentUser();
      if (response && response.data && response.data.query && response.data.query.userinfo && response.data.query.userinfo.id !== 0) {
        window.localStorage.setItem("authenticated", "true");
        window.localStorage.setItem("currentUser", JSON.stringify(response.data.query.userinfo));

      } else {
          goURL('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash));
      }
    } catch (error) {
      goURL('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash));
    }
    setRenderRoute(true);
  }, [dispatch]);

  useEffect(() => {
    if (!window.localStorage.getItem("authenticated")) {
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return renderRoute ? children : null;
};

export default Auth;
