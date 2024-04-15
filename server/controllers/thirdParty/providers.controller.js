import { ElementNotFound, MissingParameter } from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { STATUS_FAILED, STATUS_SUCCESS } from "../../constants/constants.js";
import { messages } from "../../i18n/messages.js";
import ThirdPartyProvider from "../../models/third_party/ThirdPartyProviders.model.js";
import {
  addProvider,
  providersList,
  removeProvider,
  updateProvider,
} from "../../services/thirdPartyProviders/thirdParty.service.js";

export const getAllProviders = catchAsync(async (req, res, next) => {
  // console.log(providersList());
  const providers = await providersList();
  return res.status(200).json({
    state: "success",
    providers: providers,
  });
});

export const postProvider = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new MissingParameter());
  const provider = ThirdPartyProvider.build(req.body);

  const createdProvider = await addProvider(provider);
  if (!createdProvider)
    return res.status(409).json({ message: messages.provider_exists });
  return res
    .status(200)
    .json({ status: STATUS_SUCCESS, provider: createdProvider });
});

export const deleteProvider = catchAsync(async (req, res, next) => {
  const providerName = req.params.name;
  const deletedProvider = await removeProvider(providerName);
  if (!deletedProvider)
    return next(new ElementNotFound(messages.provider_not_found));
  return res
    .status(200)
    .json({ status: STATUS_SUCCESS, message: messages.provider_deleted });
});
export const changeProvider = catchAsync(async (req, res, next) => {
  const providerName = req.params.name;
const updatedProvider = await updateProvider(providerName,req.body)
console.log("---------------",updatedProvider);
if (!updatedProvider) return res.status(304).json({messages:""})
  return res
    .status(200)
    .json({ status: STATUS_SUCCESS, message: messages.provider_updated,updatedProvider });
});


