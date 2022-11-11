import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Main from "./layouts/Main";
import Pools from "./views/pools/Index";
import CreatePool from "./views/pools/Create";
import AddLiquidity from "./views/pools/liquidity/Add";
import RemoveLiquidity from "./views/pools/liquidity/Remove";
import Swap from "./views/swap/Index";

const App = () => {
    return (
        <Main>
            <Routes>
                <Route exact path={"/pool"} element={<Pools/>}/>
                <Route exact path={"/pool/create"} element={<CreatePool/>}/>
                <Route exact path={"/pool/add-liquidity/:slug"} element={<AddLiquidity/>}/>
                <Route exact path={"/pool/remove-liquidity/:slug"} element={<RemoveLiquidity/>}/>
                <Route exact path={"/"} element={<Swap/>}/>
                <Route exact path={"/swap"} element={<Swap/>}/>
            </Routes>
        </Main>
    )
}

export default App
