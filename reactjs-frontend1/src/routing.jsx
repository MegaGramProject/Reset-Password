import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DidYouForgetPasswordPage from './views/DidYouForgetPasswordPage';
import EnterNewPasswordPageWrapper from './views/EnterNewPasswordPage';
import NotFoundPage from './views/NotFoundPage';

const Routing = () => (
    <Routes>
        <Route exact path="/forgotPassword" element={<DidYouForgetPasswordPage />} />
        <Route exact path="/enterNewPassword/:username" element={<EnterNewPasswordPageWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

const Root = () => (
    <BrowserRouter>
        <Routing />
    </BrowserRouter>
);

export default Root;
