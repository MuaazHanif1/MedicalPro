// for wrapping value in form data
export const createFormData = (passedPayload) => {
  const formData = new FormData();
  for (const key in passedPayload) {
    formData.append(key, passedPayload[key]);
  }
  return formData;
};
