import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import routes from '@/router';
import {compareTwoObject} from '@/utils';
import {ILayout, selectDisplayLayout, setDisplayLayout,} from '@/store/slices/layoutSlice';
import {useShallowEqualSelector} from '@/hooks/useShallowEqualSelector';
import {useMediaQuery, useTheme} from "@mui/material";

const Main: React.FC = () => {
  const layout: ILayout = useShallowEqualSelector(selectDisplayLayout);
  const dispatch = useDispatch();

  const updateDisplayLayout = (currentLayout: ILayout, layout: ILayout) => {
    const layoutUpdated = currentLayout
      ? { header: !!currentLayout.header, footer: !!currentLayout.footer }
      : { header: true, footer: true };

    if (!compareTwoObject(layoutUpdated, layout)) {
      setTimeout(() => dispatch(setDisplayLayout(layoutUpdated)));
    }
  };
  const { header } = useSelector(selectDisplayLayout);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div id="main" style={{
      height: header ? "calc(100%-72px)" : "100%",
      overflow: "hidden",
      paddingTop: header ? (isMobile ? "64px" : "72px") : 0
    }}>
      <Switch>
        {routes.map(
          ({
            component: Component,
            path,
            layout: currentLayout,
            ...rest
          }: {
            component: any;
            path: string;
            layout: object;
          }) => {
            return (
              <Route
                key={path}
                path={path}
                render={props => {
                  updateDisplayLayout(currentLayout, layout);
                  /**
                   * Use this code for authorization like admin page
                   */
                  // return (
                  //   <Auth>
                  //     <Component {...props} />
                  //   </Auth>
                  // );
                  return <Component {...props} />;
                }}
                {...rest}
              />
            );
          },
        )}
      </Switch>
    </div>
  );
};

export default Main;
