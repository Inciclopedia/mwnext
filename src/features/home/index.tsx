import React from 'react';
import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";

const Home: React.FC = () => {
  return <Article page="Inciclopedia:Portada" redirects={true} prop={[WikiProp.text]} useskin="vector" />
};

export default Home;
