"use client"
import { useState, useEffect } from "react";
import StartMap from '@/app/components/map/StartMap';
import Search from '@/app/components/map/Search';
import { placesLibrary } from "@/app/AppContext";

const formStyle = {
    backgroundColor: 'tan',
};

type Props = {
  destination: { lat: number; lng: number };
};

export default function FilterForm({destination} : Props) {

    const [formData, setFormData] = useState({cuisine: "", distance: "", budget: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [loadStartMap, setLoadStartMap] = useState(true);

    const onFinish = () => {
        // @ts-ignore
        event.preventDefault();
        setIsLoading(true);
        setLoadStartMap(false);
        setIsLoading(false);
    }

    return (
        <div>
            <form style={formStyle} onSubmit={onFinish}>
                <div className="form-group">
                    <div className="form-item">
                        <label htmlFor="cuisine">Cuisine</label>
                        <input
                            name="cuisine"
                            value={formData.cuisine}
                            onChange={(event) =>
                                setFormData({...formData, cuisine: event.target.value})}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="distance">Distance</label>
                        <input
                            required
                            name="cuisine"
                            type="number"
                            value={formData.distance}
                            onChange={(event) =>
                                setFormData({...formData, distance: event.target.value})}
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="budget">Budget</label>
                        <select
                            required
                            name="budget"
                            value={formData.budget}
                            onChange={(event) =>
                                setFormData({...formData, budget: event.target.value})}
                        >
                            <option value=""> Select </option>
                            <option value={placesLibrary.PriceLevel.INEXPENSIVE}> Inexpensive </option>
                            <option value={placesLibrary.PriceLevel.MODERATE}> Moderate </option>
                            <option value={placesLibrary.PriceLevel.EXPENSIVE}> Expensive </option>
                            <option value={placesLibrary.PriceLevel.VERY_EXPENSIVE}> Very Expensive </option>
                        </select>
                    </div>
                </div>
                <div>
                    <button disabled={isLoading} className="add-button" type="submit">
                        Submit
                    </button>
                </div>
            </form>
            <div>
                {loadStartMap ? <StartMap destination={destination} /> :
                    //@ts-ignore
                    <Search position={destination} formData={formData} />}
            </div>
        </div>
    );
}