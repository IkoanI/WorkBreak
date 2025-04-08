import RouteMap from '@/app/components/map/RouteMap';

export default function TESTPage() {
    const mcdonaldsLocation = {
        lat: 33.7490,
        lng: -84.3880,
    };

    return (
        <div>
            <h1>McDonald's TEST</h1>
            <p>Directions to McDonald's</p>
            <RouteMap destination={mcdonaldsLocation} />
        </div>
    )

}