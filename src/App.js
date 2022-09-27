import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";

import { getPlacesData, getWeatherData } from "./api";

import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";


const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [childClicked, setChildClicked] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [type, setType ] = useState('restaurants');
    const [rating, setRating ] = useState('');

    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
          setCoordinates({ lat: latitude, lng: longitude });
        });
      }, []);
    
      useEffect(() => {
        const filteredPlaces = places.filter((place) => Number(place.rating) > rating);
    
        setFilteredPlaces(filteredPlaces);
      }, [places, rating]);
    
    useEffect(() => {
        if(bounds) {
        setIsLoading(true);

        getWeatherData(coordinates.lat, coordinates.lng)
            .then((data) => setWeatherData(data))

        getPlacesData(type, bounds.sw, bounds.ne)
            .then((data) => {
                setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
                setFilteredPlaces([]);
                setRating('');
                setIsLoading(false);
            })
        }
    }, [bounds, coordinates.lat, coordinates.lng, type]);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();

        setCoordinates({ lat, lng });
    };


    return (
        <>
            <CssBaseline />
            <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
            <Grid container spacing={3} style= {{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid> 
                {/*xs: on mobile devices is going to be full width taking 12 spaces
                md: on medium and larger devices is going to take only 4spaces  */}

                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates}
                        setBounds= {setBounds}
                        coordinates = {coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid> 
            </Grid> 

            
        </>
    )
}

export default App;