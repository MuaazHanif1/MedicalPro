import axiosApiClient from "@/axios";
import notify from "@/composables/notify";
import { defineStore } from "pinia";

export const useDepartmentStore = defineStore("dept", {
    state: () => ({
    }),
    getters: {},
    actions:{

      /**  Description: this method adds department
      * @param {name} String Department Name
      * Displays an error or successfull snack message depending upon the backend response
      * @return Object
     */
    async addDepartment(name) {
        try {
          const response = await axiosApiClient.post('practice/add-department',
          {name: name}
          );
            console.log(response.data.data)
          notify("Department Added Successfully !",'primary');
          return response;
        } catch (err) {
            console.log("ERROR",err.response.data.error.name[0]);
          notify(err.response.data.error.name[0],'negative');
        }
      },
      /**  Description: this method adds employee types into the respective department
       * Displays an error snack message if the API call returns an error
      * @param {deptID} String Department ID
      * @param {employeeTypes} Array An Array of Employee Types
      * @return Array
     */
      async addEmployeesDept(deptID, employeeTypes) {
        try {
          const response = await axiosApiClient.post('practice/add-department-employee-type',
          {
            department_id : deptID,
            name : employeeTypes
            }
          );
          console.log(response.data.data);
          return response.data.data;
        } catch (err) {
            console.log("ERROR",err.response.data.error);
          notify(err.response.data.error.name[0],'negative');
        }
      },
       /**  Description: this method returns all Departments with their respective employee Types
       * Displays an error snack message if the API call returns an error
      * @return Array
     */
      async getAllDeptsWithEmployees() {
        try {
          const response = await axiosApiClient.get('practice/departments',
          );
          console.log(response.data.data);
          return response.data.data;
        } catch (err) {
            console.log("ERROR",err.response.data.error.name[0]);
          notify(err.response.data.error.name[0],'negative');
        }
      },
       /**  Description: this method updates an employee type name and status in the respective department
       * Displays an error snack message if the API call returns an error
      * @param {empId} String Employee ID
      * @param {empName} String Employee Type Name
      * @param {empStatus} String Employee Type Status
      * @return Array
     */
      async updateEmployeeNameAndStatus(empId, empName, empStatus) {
        try {
          const response = await
           axiosApiClient.post(`practice/department-employee-type-status-update/${empId}`,
           {
            name: empName,
            status: empStatus,
           }
          );
          return response.data.data;
        } catch (err) {
            console.log("ERROR",err.response.data.error.name[0]);
          notify(err.response.data.error.name[0],'negative');
        }
      },

    },
});