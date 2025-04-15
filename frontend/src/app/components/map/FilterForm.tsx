import {useState} from "react";
import StartMap from '@/app/components/map/StartMap';
import Search from '@/app/components/map/Search';
import {Loader} from "@googlemaps/js-api-loader";

const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                version: 'weekly'
});

const { PriceLevel } = await loader.importLibrary('places');

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

    // @ts-ignore
    // @ts-ignore
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
                            <option value={PriceLevel.INEXPENSIVE}> Inexpensive </option>
                            <option value={PriceLevel.MODERATE}> Moderate </option>
                            <option value={PriceLevel.EXPENSIVE}> Expensive </option>
                            <option value={PriceLevel.VERY_EXPENSIVE}> Very Expensive </option>
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