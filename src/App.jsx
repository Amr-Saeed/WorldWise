import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import CityList from "./Components/CityList";
// import { useEffect, useState } from "react";
import CountriesList from "./Components/CountriesList";
import City from "./Components/City";
import Form from "./Components/Form";
import SpinnerFullPage from "./Components/SpinnerFullPage";
import { CitiesProvider } from "./Contexts/CitiesContext";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./Contexts/FakeAuthContext";
import ProtectedRoute from "./Pages/ProtectedRoute";

// import Product from "./Pages/Product";
// import HomePage from "./Pages/HomePage";
// import Pricing from "./Pages/Pricing";
// import AppLayout from "./Pages/AppLayout";
// import Login from "./Pages/Login";

const HomePage = lazy(() => import("./Pages/HomePage"));
const Product = lazy(() => import("./Pages/Product"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const AppLayout = lazy(() => import("./Pages/AppLayout"));
const Login = lazy(() => import("./Pages/Login"));

// const BASE_URL = "http://localhost:4000";
function App() {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // // console.log(cities, isLoading);

  // useEffect(function () {
  //   async function fetchCities() {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch(`${BASE_URL}/cities`);
  //       const data = await res.json();
  //       setCities(data);
  //     } catch {
  //       console.log("error");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchCities();
  // }, []);
  return (
    <div>
      <AuthProvider>
        <CitiesProvider>
          <BrowserRouter>
            <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="/Product" element={<Product />} />
                <Route path="/Pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate replace to="cities" />} />
                  {/* The index Route */}
                  <Route
                    path="cities"
                    // element={<CityList cities={cities} isLoading={isLoading} />}
                    element={<CityList />}
                  />
                  <Route path="cities/:id" element={<City />} />
                  <Route
                    path="countries"
                    element={<CountriesList />}
                    // element={<CountriesList cities={cities} isLoading={isLoading} />}
                  />
                  <Route path="form" element={<Form />} />
                </Route>

                <Route path="*" element={<h1>404</h1>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CitiesProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
