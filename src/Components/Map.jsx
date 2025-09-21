import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useCities } from "../Contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { map } from "leaflet";
import { useUrlPosition } from "../hooks/useUrlPosition";
// import { position } from "../data";
function Map() {
  const [mapLat, mapLng] = useUrlPosition();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities(); //we need this here to get the cities data (as we need to make a marker for each city)
  //of course now we need to get our location so we will use our useGeolocation hook

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  /* now after we have made this ChangeCenter to change the map center to each city we clikc on 
  when we go back from the city we clicked on the map center go back to the default position [40,0]
  so to fix this we need use useEffect and listen to the changes in the searchParams and when it changes we change the mapPosition to the new position
  */

  //so as you see useEffect usede for sync as here it sync the mapPosition with the searchParams
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  /*now we need to sync between mapPosition and geolocationPosition so we will use useEffect*/

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClickk={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        {geolocationPosition && (
          <Marker
            position={[geolocationPosition.lat, geolocationPosition.lng]}
            key="geolocation"
          >
            <Popup>
              <span>Your Location</span>
            </Popup>
          </Marker>
        )}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

/*first we need when we click on a city the map center on this city we don't have a builtin function in leaflet for this
so we need to make a component and why comp? because leaflet works with component so every functionality you wanna add in leaflet it needs component
*/

function ChangeCenter({ position }) {
  //this is a leaflet hook that gives us the map instance
  const map = useMap();
  //then we use the setView method to change the center of the map
  map.setView(position);
  return null; //because each component needs to return something and here we don't need to return anything
}

/* now what we need to make is when I click on any place in the map so a new form open so that I can enter this city information
also I need to take the coordinates of the place I clicked on and put them in the form automatically
so to do this we need to use the useMapEvent hook from leaflet
but before that we need to make a new route for this form in the App.jsx file
*/

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    // click: (e) => navigate(`form`), if I write only form so we didn't get the coordinates in the url so it will not go to the form so we will not be able to put marker on this new city
    // now we need to built again our query string with the new coordinates in the URL
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}
export default Map;
