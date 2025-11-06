import ApiService from "../../reducers/api/Api.jsx";

export const editUserField = async (field, action, data = {}, id = null) => {
  return ApiService.patch("/users/edit", {
    field,
    action,
    data,
    id,
  });
};