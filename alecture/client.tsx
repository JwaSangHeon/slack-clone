import React from 'react';
import { render } from 'react-dom';
import App from '@layouts/App';
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
);

// 폴더 구조

// pages - 각각의 서비스 페이지
// components - 재사용하는 컴포넌트
// layouts - 공통 레이아웃
