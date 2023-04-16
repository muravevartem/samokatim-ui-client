import {MdElectricScooter, MdInfo, MdPedalBike} from "react-icons/md";

export const equipmentIcons = {
    BIKE: ({size, color}) => <MdPedalBike size={size ? size : 48} color={color ? color : 'black'}/>,
    SCOOTER: ({size, color}) => <MdElectricScooter size={size ? size : 48} color={color ? color : 'black'}/>,
    UNKNOWN: ({size, color}) => <MdInfo size={size ? size : 48} color={color ? color : 'black'}/>
}
