import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DidYouForgetPasswordPage from './views/DidYouForgetPasswordPage';
import SetNewPasswordPageWrapper from './views/SetNewPasswordPage';
import NotFoundPage from './views/NotFoundPage';

const Routing = () => (
    <Routes>
        <Route exact path="/forgotPassword" element={<DidYouForgetPasswordPage />} />
        <Route exact path="/setNewPassword/:username/:passwordResetToken"
        element={<SetNewPasswordPageWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

const Root = () => (
    <BrowserRouter>
        <Routing />
    </BrowserRouter>
);

export default Root;
