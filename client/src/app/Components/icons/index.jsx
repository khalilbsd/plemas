

import { ReactComponent as FaClock } from "../../public/svgs/light/clock.svg";
import { ReactComponent as FaSave } from "../../public/svgs/light/floppy-disk.svg";
import { ReactComponent as FaEdit } from "../../public/svgs/light/pen.svg";
import { ReactComponent as FaJoin } from "../../public/svgs/light/user-plus.svg";
import { ReactComponent as FaCancel } from "../../public/svgs/light/xmark.svg";
import { ReactComponent as FaDelete } from "../../public/svgs/light/trash.svg";



export const CustomSaveIcon = ({ className }) => (
  <FaSave className={className} /> // Customize the width and height as needed
);
export const CustomClockIcon = ({ className }) => (
  <FaClock className={className} /> // Customize the width and height as needed
);
export const CustomJoinIcon = ({ className }) => (
  <FaJoin className={className} /> // Customize the width and height as needed
);
export const CustomCancelIcon = ({ className }) => (
  <FaCancel className={className} /> // Customize the width and height as needed
);
export const CustomEditIcon = ({ className }) => (
  <FaEdit className={className} /> // Customize the width and height as needed
);
export const CustomDeleteIcon = ({ className }) => (
  <FaDelete className={className} /> // Customize the width and height as needed
);
