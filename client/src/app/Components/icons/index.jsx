

import { ReactComponent as FaClock } from "../../public/svgs/light/clock.svg";
import { ReactComponent as FaSave } from "../../public/svgs/light/floppy-disk.svg";
import { ReactComponent as FaEdit } from "../../public/svgs/light/pen.svg";
import { ReactComponent as FaJoin } from "../../public/svgs/light/user-plus.svg";
import { ReactComponent as FaCancel } from "../../public/svgs/light/xmark.svg";
import { ReactComponent as FaDelete } from "../../public/svgs/light/trash.svg";
import { ReactComponent as FaCheck } from "../../public/svgs/light/check.svg";
import { ReactComponent as FaPlus } from "../../public/svgs/light/plus.svg";
import { ReactComponent as FaArrowDown } from "../../public/svgs/light/chevron-down.svg";



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
export const CustomCheckIcon = ({ className }) => (
  <FaCheck className={className} /> // Customize the width and height as needed
);
export const CustomPlusIcon = ({ className }) => (
  <FaPlus className={className} /> // Customize the width and height as needed
);
export const CustomArrowDownIcon = ({ className }) => (
  <FaArrowDown className={className} /> // Customize the width and height as needed
);
