import React, {Fragment} from 'react';

import Header from './header';
import Main from './main';

const Layout: React.FC = () => {
  return (
    <Fragment>
      <Header />
      <Main />
    </Fragment>
  );
};

export default Layout;
