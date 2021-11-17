import React, { Component } from "react";
import { Redirect, Route } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";

import "./custom.css";
import { Article } from "./components/Article";
import { NotFound } from "./components/NotFound";
import { NotImplemented } from "./components/NotImplemented";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path="/" component={Home} />
                <Route exact path="/article/:id" component={Article} />
                <Route exact path="/notfound" component={NotFound} />
                <Route exact path="/notimplemented" component={NotImplemented} />
                {/* <Route exact component={() => <Redirect to="/notfound" />} /> */}
            </Layout>
        );
    }
}
