import {useState} from "react";

const formStyle = {
    backgroundColor: 'tan',
};

export default function FilterForm() {
    const [formData, setFormData] = useState({cuisine: "", distance: "", budget: ""});
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = () => {
        setIsLoading(true);
        let data = JSON.stringify(formData);
        console.log(data);
    }

    return (
        // @ts-ignore
        <form style={formStyle} onSubmit={onFinish}>
            <div className="form-group">
                <div className="form-item">
                    <label htmlFor="cuisine">Cuisine</label>
                    <input
                        required
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
    );
}