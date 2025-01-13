import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './views/notFound';
import DidYouForgetPassword from './views/didYouForgetPassword';
import EnterNewPassword from './views/enterNewPassword';

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
