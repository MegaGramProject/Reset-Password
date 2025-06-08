import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SendLinkToResetPasswordPage from './views/SendLinkToResetPasswordPage';
import SetNewPasswordPageWrapper from './views/SetNewPasswordPage';
import NotFoundPage from './views/NotFoundPage';

const Routing = () => (
    <Routes>
        <Route exact path="/send-link-to-reset-password" element={<SendLinkToResetPasswordPage />} />
        <Route exact path="/set-new-password/:username/:passwordResetToken" element={<SetNewPasswordPageWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

const Root = () => (
    <BrowserRouter>
        <Routing />
    </BrowserRouter>
);

export default Root;
