import { createContext, useCallback, useReducer } from "react";
import { useState, useEffect } from "react";
import { useContext } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:4000";

//reducer functions are pure so you can't make them async so you can't make API calls in them
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload, //so when we create a city we make it the current city
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  // console.log(cities, isLoading);

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        console.log("error");
        // } finally {
        //   setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity.id) return; //if the id is the same as the current city id we don't need to fetch it again (id is a string  as it comes from url and everything comes from url is a string)
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        // setCurrentCity(data);

        dispatch({ type: "city/loaded", payload: data });
      } catch {
        console.log("error");
        // } finally {
        //   setIsLoading(false);
      }
    },
    [currentCity.id]
  );

  //WE MAKE THIS FUNCTION HERE IN THIS FILE AS IT HAS THE CITIES STATE AND SETCITIES FUNCTION SO IT LIVES ALONG WITH ALL THAT UPDATE CITIES STATE
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await res.json();

      // setCities((cities) => [...cities, data]); //here we need to have the same cities with the new city we have just added WE MUST UPDATE THE UI OFC
      dispatch({ type: "city/created", payload: data });
    } catch {
      console.log("error");
      // } finally {
      //   // setIsLoading(false);
    }
  }
  //WE MAKE THIS FUNCTION HERE IN THIS FILE AS IT HAS THE CITIES STATE AND SETCITIES FUNCTION SO IT LIVES ALONG WITH ALL THAT UPDATE CITIES STATE
  //we are like making all of functuions working with the cities state here in this file
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      console.log("error");
      // } finally {
      //   setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside of CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
