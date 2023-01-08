import React from 'react';
import {useSelector} from 'react-redux';
import {selectDisplayLayout} from '@/store/slices/layoutSlice';
import {useTranslation} from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { footer } = useSelector(selectDisplayLayout);
  if (!footer) {
    return null;
  }
  return (
    <div id="footer">

    </div>
  );
};

export default Footer;
