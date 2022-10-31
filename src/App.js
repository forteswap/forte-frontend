import "./App.scss";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Main from "./layouts/Main.js";
import Pools from "./views/pools/Index.js";
import CreatePool from "./views/pools/Create.js";
import AddLiquidity from "./views/pools/liquidity/Add.js";
import RemoveLiquidity from "./views/pools/liquidity/Remove.js";
import Swap from "./views/swap/Index.js";

const App = () => {
    return (
        <Main>
            <ToastContainer />
            <Routes>
                <Route exact path="/pool" element={<Pools/>}/>
                <Route exact path={"/pool/create"} element={<CreatePool/>}/>
                <Route exact path={"/pool/add-liquidity/:slug"} element={<AddLiquidity/>}/>
                <Route exact path={"/pool/remove-liquidity/:slug"} element={<RemoveLiquidity/>}/>
                <Route exact path={"/"} element={<Swap/>}/>
            </Routes>
        </Main>
    )
}

export default App
