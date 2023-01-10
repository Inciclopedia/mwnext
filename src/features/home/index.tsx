import React from 'react';
import ArticleView from "@/features/home/ArticleView";
import usePageSource from "@/hooks/usePageSource";

const Home: React.FC = () => {
  const { source: mainpage } = usePageSource("MediaWiki:Mainpage");
  console.log("mainpage: "+ mainpage);
  return mainpage && <ArticleView page={mainpage} mwnextHideTitle />
};

export default Home;
