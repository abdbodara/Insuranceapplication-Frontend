import * as Yup from "yup";
import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Field, Form, Formik } from "formik";
import moment from 'moment'
import {
  useInsuranceCreationMutation,
  useInsuranceEditMutation,
  useInsuranceListQuery
} from "../../store/api/insuranceApi";
import { toast } from "react-toastify";

const FormInput = ({ isOpen, setIsOpen, selectedPersonId }) => {
  const [
    createInsurance,
    {
      isLoading: createInsuranceIsLoading,
      data: createInsuranceData,
      error: createInsuranceError,
      status: createInsuranceStatus,
      isError: createInsuranceIsError,
      isSuccess: createInsuranceIsSuccess,
      reset: resetcreateInsurance
    }
  ] = useInsuranceCreationMutation();
  const { data, refetch } = useInsuranceListQuery();  
  function closeModal() {
    setIsOpen(false);
  }

  const initialValues = {
    first_name: selectedPersonId?.first_name || "",
    last_name: selectedPersonId?.last_name || "",
    date_of_birth: selectedPersonId?.date_of_birth ? moment(selectedPersonId?.date_of_birth).format("YYYY-MM-DD") : "",
    street: selectedPersonId?.street || "",
    city: selectedPersonId?.city || "",
    state: selectedPersonId?.state || "",
    zip_code: selectedPersonId?.zip_code || "",
    vehicles: selectedPersonId?.vehicles || [
      { vin: "", year: "", make: "", model: "" }
    ]
  };
  
  const currentYear = new Date().getFullYear();
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    date_of_birth: Yup.date()
      .required("Date of Birth is required")
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), 'You must be at least 16 years old')
      .nullable(),
    street: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State/Province is required"),
    zip_code: Yup.string().required("ZIP/Postal code is required").matches(/^\d{6}$/, 'The ZIP / Postal code must consist of 6 digits.'),
    vehicles: Yup.array().of(
      Yup.object().shape({
        vin: Yup.string().required("VIN is required"),
        year: Yup.number()
        .required("Year is required")
        .test('valid-year', 'Invalid year', (value) => {
          return Number.isInteger(value) && value >= 1985 && value <= currentYear + 1;
        })
        .integer()
        .min(1985, 'Year must be greater than or equal to 1985')
        .max(currentYear + 1, `Year must be less than or equal to ${currentYear + 1}`)
        .nullable(),
        make: Yup.string().required("Make is required"),
        model: Yup.string().required("Model is required")
      })
    )
  });

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const [
    editInsurance,
    {
      isLoading: editInsuranceIsLoading,
      data: editInsuranceData,
      error: editInsuranceError,
      status: editInsuranceStatus,
      isError: editInsuranceIsError,
      isSuccess: editInsuranceIsSuccess,
      reset: reseteditInsurance
    }
  ] = useInsuranceEditMutation();
  
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  enableReinitialize={true}
                  onSubmit={async (values) => {
                    if (selectedPersonId !== null && selectedPersonId.id !== null) {
                    const editInsuranceResult = await editInsurance({id:selectedPersonId.id,values});
                    if (editInsuranceResult.data.status) {
                      console.log("editInsuranceResult.isSuccess",editInsuranceResult.data.status)
                      reseteditInsurance()
                      toast.success(editInsuranceResult.data.status)
                      setIsOpen(false)
                      refetch()
                    } else {
                      console.error('Error editing insurance:', editInsuranceResult.error);
                    }
                   }else{
                    const createInsuranceResult = await createInsurance(values);
                    if (createInsuranceResult.data.message) {
                      console.log('Customer created successfully:',createInsuranceResult.data.message);
                      resetcreateInsurance()
                      toast.success(createInsuranceResult.data.message)
                      setIsOpen(false);
                      refetch()
                    } else {
                      console.error('Error creating customer:', createInsuranceResult.error);
                    }
                    
                   }
                  }}
                  >
                    {(formik) => {
                       const handleAddVehicle = () => {
                        const { vehicles } = formik.values;
                    
                        if (vehicles.length < 3) {
                          formik.setFieldValue("vehicles", [
                            ...vehicles,
                            { vin: "", year: "", make: "", model: "" }
                          ]);
                        } else {
                          toast.warning("You can not add more than 3 vehicle at a time")
                        }
                      };
                      return (
                        <Form
                          onSubmit={formik.handleSubmit}
                          className="bg-white w-full mx-auto shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
                        >
                          <div className="px-4 py-6 sm:p-8">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                              <div className="col-span-full ">
                                <label
                                  htmlFor="postal-code"
                                  className="block text-md font-semibold leading-6 text-gray-900"
                                >
                                  Insurance Details
                                </label>
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="first-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  First name
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                                      formik.errors.first_name &&
                                      formik.touched.first_name
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                  />
                                  {formik.touched.first_name &&
                                    formik.errors.first_name && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.first_name}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Last name
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="text"
                                    id="last-name"
                                    autoComplete="last_name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...formik.getFieldProps("last_name")}
                                  />
                                  {formik.touched.last_name &&
                                    formik.errors.last_name && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.last_name}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="sm:col-span-6">
                                <label
                                  htmlFor="date_of_birth"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Date of Birth
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="date"
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    autoComplete="bday"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...formik.getFieldProps("date_of_birth")}
                                  />
                                  {formik.touched.date_of_birth &&
                                    formik.errors.date_of_birth && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.date_of_birth}
                                      </p>
                                    )}
                                    
                                </div>
                              </div>
                              <div className="sm:col-span-6">
                                <label
                                  htmlFor="street"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Street address
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="text"
                                    id="street"
                                    autoComplete="street-address"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...formik.getFieldProps("street")}
                                  />
                                  {formik.touched.street &&
                                    formik.errors.street && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.street}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="city"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  City
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="text"
                                    id="city"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...formik.getFieldProps("city")}
                                  />
                                  {formik.touched.city &&
                                    formik.errors.city && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.city}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="state"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  State/Province
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="text"
                                    id="state"
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...formik.getFieldProps("state")}
                                  />
                                  {formik.touched.state &&
                                    formik.errors.state && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.state}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="zip-code"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  ZIP/Postal code
                                </label>
                                <div className="mt-2">
                                  <Field
                                    type="number"
                                    id="zip-code"
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    {...formik.getFieldProps("zip_code")}
                                  />
                                  {formik.touched.zip_code &&
                                    formik.errors.zip_code && (
                                      <p className="mt-1 text-sm text-red-500">
                                        {formik.errors.zip_code}
                                      </p>
                                    )}
                                </div>
                              </div>
                              {formik.values.vehicles.map((vehicle, index) => (
                                <React.Fragment key={index}>
                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor={`vin-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      VIN
                                    </label>
                                    <div className="mt-2">
                                      <Field
                                        type="text"
                                        id={`vin-${index}`}
                                        autoComplete="off"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        {...formik.getFieldProps(
                                          `vehicles[${index}].vin`
                                        )}
                                      />
                                      {formik.touched.vehicles?.[index]?.vin &&
                                        formik.errors.vehicles?.[index]
                                          ?.vin && (
                                          <p className="mt-1 text-sm text-red-500">
                                            {formik.errors.vehicles[index]?.vin}
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor={`year-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Year
                                    </label>
                                    <div className="mt-2">
                                      <Field
                                        type="number"
                                        id={`year-${index}`}
                                        autoComplete="off"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        {...formik.getFieldProps(
                                          `vehicles[${index}].year`
                                        )}
                                      />
                                      {formik.touched.vehicles?.[index]?.year &&
                                        formik.errors.vehicles?.[index]
                                          ?.year && (
                                          <p className="mt-1 text-sm text-red-500">
                                            {
                                              formik.errors.vehicles[index]
                                                ?.year
                                            }
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor={`make-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Make
                                    </label>
                                    <div className="mt-2">
                                      <Field
                                        type="text"
                                        id={`make-${index}`}
                                        autoComplete="off"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        {...formik.getFieldProps(
                                          `vehicles[${index}].make`
                                        )}
                                      />
                                      {formik.touched.vehicles?.[index]?.make &&
                                        formik.errors.vehicles?.[index]
                                          ?.make && (
                                          <p className="mt-1 text-sm text-red-500">
                                            {
                                              formik.errors.vehicles[index]
                                                ?.make
                                            }
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <label
                                      htmlFor={`model-${index}`}
                                      className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                      Model
                                    </label>
                                    <div className="mt-2">
                                      <Field
                                        type="text"
                                        id={`model-${index}`}
                                        autoComplete="off"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        {...formik.getFieldProps(
                                          `vehicles[${index}].model`
                                        )}
                                      />
                                      {formik.touched.vehicles?.[index]
                                        ?.model &&
                                        formik.errors.vehicles?.[index]
                                          ?.model && (
                                          <p className="mt-1 text-sm text-red-500">
                                            {
                                              formik.errors.vehicles[index]
                                                ?.model
                                            }
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="mt-2">
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                  
                                    <div className="mt-2">
                                      
                                    </div>
                                  </div>
                                </React.Fragment>
                              ))}
                              {!selectedPersonId && 
                              <>
                              <div className="sm:col-span-6">
                                <button
                                  type="button"
                                  onClick={handleAddVehicle}
                                  className="bg-gray-200 text-gray-900 font-medium px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-300 sm:text-sm"
                                >
                                  Add Vehicle
                                </button>
                              </div>
                              
                              </>
                              }
                              <div className="sm:col-span-6">
                                <button
                                  type="submit"
                                  className="bg-indigo-600 mr-5 text-white font-semibold px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-indigo-700 sm:text-sm"
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  className="mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                                  onClick={handleCloseModal}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};


export default FormInput;
