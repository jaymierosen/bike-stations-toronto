import "./App.css";

import { useState, useEffect } from "react";

const App = () => {
  // bikes
  const [bikesData, setBikesData] = useState([]);
  // station status
  const [statusData, setStatusData] = useState([]);

  const fetchBikes = async () => {
    // multiple api calls
    Promise.all([
      fetch(
        "https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/station_information"
      ),
      fetch(
        "https://toronto-us.publicbikesystem.net/ube/gbfs/v1/en/station_status"
      ),
    ])
      .then((res) => {
        // get a JSON object from each of the responses
        return Promise.all(res.map((res) => res.json()));
      })
      .then((data) => {
        setBikesData(data[0].data.stations);
        setStatusData(data[1].data.stations);
      })
      .catch((err) => {
        // if there's an error, log it
        console.log(`Error: ${err}`);
      });
  };

  useEffect(() => {
    fetchBikes();
  });

  let availBikes = [];
  bikesData.forEach((bike) => {
    statusData.forEach((status) => {
      if (bike.station_id === status.station_id) {
        availBikes.push({
          name: bike.name,
          station_id: bike.station_id,
          numBikesAvail: status.num_bikes_available,
        });
      }
    });
  });

  // capping sizes at 100 because app runs very slow if entire data is shown
  // there is probably a better way of doing this though!
  bikesData.length = 100;
  statusData.length = 100;

  return (
    <div className="container">
      <table>
        <tbody>
          <tr>
            <th>Alphabetical order</th>
          </tr>
          {availBikes
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((bike, i) => {
              return (
                <tr key={`${i}`}>
                  <td>Bike location: {bike.name}</td>
                  <td>Station ID: {bike.station_id}</td>
                  <td>Number of bikes available: {bike.numBikesAvail}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>Number of bikes available (ascending order)</th>
          </tr>
          {availBikes
            .sort((a, b) => a.numBikesAvail - b.numBikesAvail)
            .map((bike, i) => {
              return (
                <tr key={`${i}`}>
                  <td>Bike location: {bike.name}</td>
                  <td>Station ID: {bike.station_id}</td>
                  <td>Number of bikes available: {bike.numBikesAvail}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
