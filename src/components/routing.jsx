import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './app';
import App2Wrapper from './app2';
import NotFound from './notFound';

const Routing = () => (
<Routes>
    <Route exact path="/forgotPassword" element={<App />} />
    <Route exact path="/enterNewPassword/:username" element={<App2Wrapper />} />
    <Route path="*" element={<NotFound />} />
</Routes>
);

const Root = () => (
<BrowserRouter>
    <Routing />
</BrowserRouter>
);

export default Root;
