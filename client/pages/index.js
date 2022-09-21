import React from 'react'
import {Map, Marker} from 'pigeon-maps'
import { stamenToner } from 'pigeon-maps/providers'

export default function Home() {
  return (
    <div className='text-center'>
      <h1 className="text-4xl font-bold mt-5">QRoute</h1>

      <div className="mt-5 mx-20 rounded-xl">
        <Map height={500} defaultCenter={[39.018, -77.012]} defaultZoom={11}>
          <Marker width={40} anchor={[39.018, -77.012]} color = "#c92e39"/>
        </Map>
      </div>
    </div>
  )
}
