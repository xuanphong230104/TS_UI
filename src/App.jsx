import { Suspense } from "react";
import { ConfigProvider, Spin } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import AppLayout from "./layouts";
import ErrorFallback from "./components/ErrorFallback";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/app.scss";

const renderLoading = () => (
  <div className="component-loading">
    <Spin />
  </div>
);

const App = () => {
  const getConfigRoute = (route) => {
    const defaultLayout = route.defaultLayout ? (
      <AppLayout>
        <Suspense fallback={renderLoading()}>{route.element}</Suspense>
      </AppLayout>
    ) : (
      <Suspense
        fallback={<div className="centered-container">{renderLoading()}</div>}
      >
        {route.element}
      </Suspense>
    );

    const privateElement = route.private ? (
      <PrivateRoute> {defaultLayout} </PrivateRoute>
    ) : (
      defaultLayout
    );

    return {
      element: privateElement,
      path: route.path,
      key: route.path,
    };
  };
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#2563EB" } }}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            {routes.map((route) => {
              const { key, ...restConfig } = getConfigRoute(route);
              return <Route key={key} {...restConfig} />;
            })}
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
