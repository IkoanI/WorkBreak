// GLOBAL VARIABLES FOR THE APP
import React, {createContext, useContext, useState} from 'react';
import {Loader} from "@googlemaps/js-api-loader";


// CHANGE IN PRODUCTION
export const backendURL = "http://127.0.0.1:8000"

export const default_image_url = backendURL + "/media/workbreak.png"

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: 'weekly'
});


export const  placesLibrary = await loader.importLibrary('places');

export const  markerLibrary = await loader.importLibrary('marker');

export const  mapsLibrary = await loader.importLibrary('maps');
