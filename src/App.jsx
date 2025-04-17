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
  const renderRoute = (route) => {
    const element = route.defaultLayout ? (
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

    const wrappedElement = route.private ? (
      <PrivateRoute>{element}</PrivateRoute>
    ) : (
      element
    );

    return (
      <Route
        key={route.path}
        path={route.path}
        element={wrappedElement}
      >
        {route.children?.map(child => renderRoute(child))}
      </Route>
    );
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#2563EB" } }}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            {routes.map(route => renderRoute(route))}
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
