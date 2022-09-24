import React, {useState} from 'react'
import {Map, Marker} from 'pigeon-maps'
//import { stamenToner } from 'pigeon-maps/providers'

export default function Home() {
  const [address, setAddress] = useState('')
  const [drop, setDrop] = useState(false)
  const [dropSelection, setDropSelection] = useState("");

  const [paths, setPaths] = useState([
    {
      color: "#c92e39",
      route: "6999",
      anchors: [
        {
          address: "Montgomery Blair HS",
          coords: [39.018, -77.012]
        },
        {
          address: "Marilyn J. Praisner Community Library",
          coords: [39.102 ,-76.940]
        }
      ]
    },
    {
      color: "teal",
      route: "4991",
      anchors: [
        {
          address: "Montgomery Blair HS",
          coords: [39.018, -77.012]
        },
        {
          address: "Travilah ES",
          coords: [39.082,-77.247]
        }
      ]
    }
  ]);

  const updateAddress = (e) => {
    setAddress(e.target.value);
  }

  const add = () => {
    if (address === null) return false
    let temp = paths;
    temp[0].anchors.push({address: address, coords: [39.018, -76.940]})
    setAddress('')
    setPaths(temp);
  }

  return (
    <div className='text-center mx-20'>
      <img className = 'h-20 mt-5 m-auto' src = "/logo.svg" alt="qroute logo" />

      <div className='my-5 inline-flex gap-4 w-full'>
        <div
          className="flex-2 inline-flex items-stretch bg-white border-2 border-black rounded-md dark:bg-gray-900 dark:border-gray-800"
          >
          <a
            className="m-auto px-4 py-2 text-sm text-black dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 hover:bg-gray-50 rounded-l-md"
          >
            {dropSelection || "Route ID"}
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDrop(!drop)}
              onBlur={() => setDrop(false)}
              className="inline-flex items-center justify-center h-full px-2 text-black border-l-2 border-black dark:text-gray-300 dark:border-gray-700 dark:hover:text-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 rounded-r-md hover:bg-gray-50"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  />
              </svg>
            </button>

            {drop && <div
              className="absolute right-0 z-10 w-28 mt-4 bg-white border border-gray-100 shadow-lg origin-top-right dark:bg-gray-900 dark:border-gray-800 rounded-md"
              role="menu"
              >
              <div className="p-2">
                {paths.map((path, index) => (
                  <a
                    key={index}
                    onClick={() => setDropSelection(path.route)}
                    href="/edit"
                    className="block px-4 py-2 text-sm text-black rounded-lg hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                    role="menuitem"
                  >
                    {path.route}
                  </a>
                ))}
              </div>
            </div>}
          </div>
        </div>

        <div className="flex-1 relative">
          <label className="sr-only" htmlFor="name">Address</label>
          <input value = {address || ''} onChange = {updateAddress} className="w-full py-4 pl-3 pr-16 text-sm border-2 border-black rounded-lg" placeholder="Address" type="text" id="address" />

          <button className="absolute p-2 text-white bg-black rounded-full -translate-y-1/2 top-1/2 right-4" type="button" onClick = {add}>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      
      {paths.map(({anchors, route}) => (
        <div className="text-left" key = {route}>
          <p className='font-bold'>{route}</p>
          <ul className="text-left">
            {anchors.map((point, key) => 
              <li key = {key}>{point.address}</li>
            )}
          </ul>
        </div>
      ))}

      <div className="mt-5">
        <Map className="rounded-2xl" height={500} defaultCenter={[39.018, -77.012]} defaultZoom={11}>
          {paths.map(({color, anchors}) => (
            anchors.map((point, key) => (
              <Marker key = {key} width={40} anchor={point.coords} color={color}/>
            ))
          ))}
        </Map>
      </div>
    </div>
  )
}
