import React, { useEffect } from 'react'
import { useInsuranceListQuery, useValidateInsuranceMutation } from '../../store/api/insuranceApi'
import moment from 'moment';
import { toast } from 'react-toastify';

const Table = ({ isOpen, setIsOpen,setSelectedPersonId }) => {
  const { data,refetch } = useInsuranceListQuery();
  const [validateInsurance] = useValidateInsuranceMutation()
  const handleOpen = () =>{
    setSelectedPersonId(null)
    setIsOpen(!isOpen)
  }
  const handleEdit = (id) =>{
    setIsOpen(!isOpen)
    setSelectedPersonId(id)
  }
  const handleValidate = async(person) =>{
    const validateInsuranceResult = await validateInsurance({id:person.id});
    console.log("validateInsuranceResult:",  validateInsuranceResult)
    toast.success(validateInsuranceResult.data.message)
    refetch()
  }

  return (
    <div className="px-4 w-full sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Insurance List</h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={handleOpen}
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Insurance
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      First Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                     Last Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      DOB
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Address
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      City
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Vehicels
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Validate
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.data?.length > 0  ?
                  <>
                  
                  {data && data?.data.map((person) => (
                    <tr key={person.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {person.first_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.last_name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {moment(person.date_of_birth).format("DD/MM/YYYY")}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.street}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.city}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.vehicles.length}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.price ? "True" : "False"}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={()=>handleEdit(person)} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only"></span>
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={()=>handleValidate(person)} className="text-indigo-600 hover:text-indigo-900">
                          Validate<span className="sr-only"></span>
                        </button>
                        </td>
                    </tr>
                  ))} </>: <>
                  No data Found
                  </>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table