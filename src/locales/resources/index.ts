import {Resource} from 'i18next';
import languages from '../languages';
import home from './home.json';
import footer from './footer.json';
import login from './login.json';
import logout from './logout.json';
import wfMessages from './wfMessages.json';
import appBar from './appBar.json';
import ui from './ui.json';
import actions from './actions.json';

interface IResource {
  [key: string]: Resource;
}

const mergeResource: IResource = {
  home,
  footer,
  login,
  logout,
  wfMessages,
  appBar,
  ui,
  actions
};

export const langs = Object.keys(languages);

const resources: Resource = {};

Object.keys(languages).map(lang => {
  Object.keys(mergeResource).map(fileName => {
    resources[lang] = {
      translation: {
        ...(resources[lang]?.translation as object),
        [fileName]: mergeResource[fileName][lang],
      },
    };
  });
});

export default resources;
