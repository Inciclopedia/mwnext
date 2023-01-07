import React from 'react';
import {useSelector} from 'react-redux';
import {selectDisplayLayout} from '@/store/slices/layoutSlice';
import MainAppBar from "@/components/appbar/appbar";

interface IMenuItem {
  name: string;
  href: string;
  label: string;
}

export const HEADERS: Array<IMenuItem> = [
  {
    name: '1',
    href: '#',
    label: 'Menu 1',
  },
];

const Header: React.FC = () => {
  const { header } = useSelector(selectDisplayLayout);
  if (!header) {
    return null;
  }
  return (
        <MainAppBar />
  );
};

export default Header;
