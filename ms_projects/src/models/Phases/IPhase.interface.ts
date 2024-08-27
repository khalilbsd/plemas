// Define a type named TPhase with the specified attributes
export type TPhase = {
  name: string;
  abbreviation: string;
  description:String;
  default:Boolean
};

// Define an interface named IPhase with the specified attributes
export interface IPhase extends TPhase , Document {}

