import React from 'react';
import { SoilMap, SoilMapProps } from './map/SoilMap';

export type MapContainerProps = SoilMapProps;

export const MapContainer: React.FC<MapContainerProps> = (props) => {
  return <SoilMap {...props} />;
};

export default MapContainer;
