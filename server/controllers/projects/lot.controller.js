import {
    AppError,
    MissingParameter
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import Lot from "../../models/project/Lot.model.js.js";

  export const getAllLot = catchAsync(async (req, res, next) => {
    const lots = await Lot.findAll();
    if (!lots) return next(new AppError("Something went wrong", 500));
    return res.status(200).json({ status: "success", lots });
  });

  export const addLot = catchAsync(async (req, res, next) => {
    const lot = req.body;

    if (!lot.name)
      return next(new MissingParameter("the lot name is mandatory"));


    const isLotExist = await Lot.findOne({where:{name:lot.name}})

    if (isLotExist) return next(new AppError("lot already exist",400))


    const newLot = await Lot.create({ ...lot });
    if (!newLot) return next(new AppError("Something went wrong", 500));
    return res.status(200).json({ status: "success", lot: newLot });
  });

  export const filterLot = catchAsync(async (req, res, next) => {
  const filters= req.query
    const lots = await Lot.findAll({where:filters});
    if (!lots) return next(new AppError("Something went wrong", 500));
    return res.status(200).json({ status: "success", lots });

  });
