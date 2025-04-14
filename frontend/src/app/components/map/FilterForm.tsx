import {useState} from "react";
import StartMap from '@/app/components/map/StartMap';
import Search from '@/app/components/map/Search';

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
                        <input
                            required
                            name="budget"
                            type="number"
                            value={formData.budget}
                            onChange={(event) =>
                                setFormData({...formData, budget: event.target.value})}
                        />
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
                    <Search position={destination} formData={formData} />}
            </div>
        </div>
    );
}