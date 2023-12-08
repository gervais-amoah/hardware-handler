import { renderHook } from "@testing-library/react-hooks";
import * as departmentApi from "../../services/departmentApi";
import { useDepartments } from "../useDepartments";
import mockDataSet from "../../__mocksData__/mockDataSet.json";
import { FETCH_DEPARTMENT_DATA_ERROR } from "../../constants/constants";

const renderUseDepartmentsHook = async () => {
  const { result, waitForNextUpdate } = renderHook(() => useDepartments());
  await waitForNextUpdate();
  return { result, waitForNextUpdate };
};

describe("the useDepartments hook", () => {
  const getAllDepartmentsMocked = jest.spyOn(
    departmentApi,
    "getAllDepartments"
  );

  beforeEach(() =>
    getAllDepartmentsMocked.mockResolvedValue(mockDataSet.departmentsData[0])
  );

  afterEach(() => jest.resetAllMocks());

  it("should return a list of departments when the 'departments' API returns", async () => {
    const { result } = await renderUseDepartmentsHook();
    const [departments, [loading, error]] = result.current;

    expect(departments).toStrictEqual(mockDataSet.departmentsData[0]);
    expect(loading).not.toBeTruthy();
    expect(error).not.toBeTruthy();
  });

  it("should return an error when the 'departments' API fails to return", async () => {
    getAllDepartmentsMocked.mockResolvedValueOnce(FETCH_DEPARTMENT_DATA_ERROR);

    const { result } = await renderUseDepartmentsHook();
    const [departments, [loading, error]] = result.current;

    expect(departments).toEqual([]);
    expect(loading).not.toBeTruthy();
    expect(error).toEqual(FETCH_DEPARTMENT_DATA_ERROR);
  });
});
