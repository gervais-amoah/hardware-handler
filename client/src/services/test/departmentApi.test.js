import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import dataSet from "../../__mocksData__/mockDataSet.json";
import * as departmentApi from "../departmentApi";
import { FETCH_DEPARTMENT_DATA_ERROR } from "../../constants/constants";

describe("Testing the departmentApi service", () => {
  let mock;
  beforeEach(() => (mock = new MockAdapter(axios)));

  it("should return all departments data when the getAllDepartments function is called", async () => {
    const mockAllDepartments = dataSet.departmentsData[0];
    mock.onGet("/departments").reply(200, mockAllDepartments);
    const actualDepartments = await departmentApi.getAllDepartments();
    expect(actualDepartments).toEqual(mockAllDepartments);
  });

  it("should return an error message when the getAllDepartments call fails", async () => {
    mock.onGet("/departments").reply(500, FETCH_DEPARTMENT_DATA_ERROR);
    const actualResponse = await departmentApi.getAllDepartments();
    expect(actualResponse).toEqual(FETCH_DEPARTMENT_DATA_ERROR);
  });
});
