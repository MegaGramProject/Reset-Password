import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DidYouForgetPassword from './views/DidYouForgetPassword';
import EnterNewPassword from './views/EnterNewPassword';
import NotFound from './views/NotFound';

const Routing = () => (
    <Routes>
        <Route exact path="/forgotPassword" element={<DidYouForgetPassword />} />
        <Route exact path="/enterNewPassword/:username" element={<EnterNewPassword />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

const Root = () => (
    <BrowserRouter>
        <Routing />
    </BrowserRouter>
);

export default Root;
