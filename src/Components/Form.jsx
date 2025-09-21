// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../Contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  //we need to fetch the conutry data on mount

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  useEffect(
    function () {
      if (!lat || !lng) return; //  don’t fetch if coords missing so we can't just access the from by changing the url and get a city name in the input also we need to only display the form if we have coords in the url

      async function fetchCityData() {
        try {
          setIsLoadingGeoCoding(true);
          /*
          without making he error empty at the first of the try block
          the error will still be there from the previous fetch like if we enter wrong coords first like not a city coords
          then the error will be there even if we enter correct coords after that so we must make the error empty at each fetch try
          like we are clearing the old error from previous fetch
          */
          setGeoCodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log(data);
          if (!data.countryName)
            throw new Error("No country found for this location, Try again😊");

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName || "");
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          setGeoCodingError(error.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    //YOU ARE SENDING TO THE API SO YOU MUST HAVE THE DATA EXACTLY THE SAME AS THE CITIES THAT'S ALREADY IN THE API
    // cityName, country, emoji, date, notes, position: {lat, lng}
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity); //if here we need to wait until the city is created in the backend before navigating to the cities page we can await it as in  citiesContext so we make this handleSubmit asunc function
    navigate("/app/cities");
  }

  if (isLoadingGeoCoding) return <Spinner />;

  if (!lat || !lng) return <Message message="Start by clicking on a map" />;

  if (geoCodingError) return <Message message={geoCodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
