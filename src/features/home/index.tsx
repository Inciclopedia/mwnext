import React from 'react';
import {useTranslation} from 'react-i18next';
import {ITag} from './types';
import ViIcon from '@/static/images/icon/vi.svg';
import EnIcon from '@/static/images/icon/en.svg';
import useAccount from "@/hooks/useAccount";

const keywords: Array<ITag> = [
  { label: 'React.js' },
  { color: '#84c6e8', label: 'Webpack 5' },
  { color: '#764abc', label: 'Redux' },
  { color: '#f5da55', label: 'Babel' },
  { color: '#15c213', label: 'jest' },
  { color: '#e94949', label: 'react-router' },
  { color: '#bf4080', label: 'sass' },
  { color: '#764abc', label: 'redux-thunk' },
  { color: '#2b037a', label: 'pm2' },
];

const languageOptions = [
  {
    label: (
      <div className="lang-item">
        <ViIcon width={14} /> <span>&nbsp;&nbsp;</span> Vietnamese
      </div>
    ),
    value: 'vi',
  },
  {
    label: (
      <div className="lang-item">
        <EnIcon width={14} />
        <span>&nbsp;&nbsp;</span> English
      </div>
    ),
    value: 'en',
  },
];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  return (
      <p>{account !== null ? "Logged in as " + account.name : "Not logged in"}</p>
  );
};

export default Home;
