import React, { useEffect, useState } from "react";
import {
  CategoryModel,
  FilterProductValue,
  FilterValueResponse,
  ProductModel,
  ProductResponse,
  ProductsFilterValuesRequest,
} from "../models/Products";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { API } from "../configurations/configurations";
import handleAPI from "../apis/handleAPI";
import { PaginationResponseModel } from "../models/AppModel";
import { SelectModel } from "../models/FormModel";
import { IoArrowForward } from "react-icons/io5";

interface Props {
  onFilter: (values: ProductsFilterValuesRequest) => void;
}

const FilterProduct = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const { onFilter } = props;
  const [filterValues, setFilterValues] = useState<{
    categories: SelectModel[];
    colors: SelectModel[];
    prices: number[];
    sizes: SelectModel[];
  }>({
    categories: [],
    colors: [],
    prices: [],
    sizes: [],
  });

  const [form] = Form.useForm();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsInitLoading(true);
    try {
      await getCategories();
      await getFilterValues();
    } catch (error) {
      console.log(error);
    } finally {
      setIsInitLoading(false);
    }
  };

  const handleSetFilterValue = (key: string, value: any) => {
    setFilterValues((pre) => ({ ...pre, [key]: value }));
  };

  const getCategories = async () => {
    const api = `${API.CATEGORY}`;
    const res = await handleAPI(api);
    const paginationRes: PaginationResponseModel = res.data.result;
    handleSetFilterValue(
      "categories",
      paginationRes.data.length > 0
        ? paginationRes.data.map((category: CategoryModel) => ({
            label: category.name,
            value: category.id,
          }))
        : null
    );
  };

  const getFilterValues = async () => {
    const api = `${API.GET_PRODUCT_FILTER_VALUES}`;
    const res = await handleAPI(api);

    const filterValuesResponse: FilterValueResponse[] = res.data.result;
    filterValuesResponse.forEach((filterValue) => {
      handleSetFilterValue(
        filterValue.key,
        filterValue.selectData.map((value, _index) => ({
          label: value,
          value: value,
        }))
      );
    });
  };
  const handleOnFilter = (valuesSubmit: ProductsFilterValuesRequest) => {
    onFilter(valuesSubmit);
  };

  return (
    <>
      <Card
        title={"Filter product"}
        style={{
          width: "400px",
        }}
        size="small"
        className="box-shadow-1"
      >
        {isInitLoading ? (
          <Spin />
        ) : (
          <>
            {filterValues ? (
              <div>
                <Form
                  onFinish={handleOnFilter}
                  layout="vertical"
                  form={form}
                  disabled={isLoading}
                >
                  <Form.Item name="categoryIds" label="Categories">
                    <Select
                      placeholder="Categories"
                      allowClear
                      options={filterValues.categories}
                      mode="multiple"
                      disabled={false}
                    />
                  </Form.Item>
                  <Form.Item name="colors" label="Colors">
                    <Select
                      placeholder="Colors"
                      allowClear
                      options={filterValues.colors}
                      mode="multiple"
                      disabled={false}
                      optionRender={(option) => (
                        <div className="d-flex">
                          <div
                            style={{
                              background: option.value,
                              height: "20px",
                              width: "20px",
                              border: "1px solid black",
                            }}
                          ></div>
                          <Typography.Text>{option.label}</Typography.Text>
                        </div>
                      )}
                    />
                  </Form.Item>
                  <Form.Item name="sizes" label="Sizes">
                    <Select
                      placeholder="Sizes"
                      allowClear
                      options={filterValues.sizes}
                      mode="multiple"
                      disabled={false}
                    />
                  </Form.Item>
                  <div className="row p-0">
                    <div className="col-5" style={{ paddingRight: "0px" }}>
                      <Form.Item
                        name="minPrice"
                        label="Min price"
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value == null || value === "") {
                                return Promise.resolve();
                              }
                              if (isNaN(value) || Number(value) < 0) {
                                return Promise.reject(
                                  new Error(
                                    "Number must be greater than or equal to 0!"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          disabled={false}
                          type="number"
                          placeholder="MIN"
                        />
                      </Form.Item>
                    </div>
                    <div
                      className="col-2 text-center"
                      style={{ marginTop: "30px" }}
                    >
                      <IoArrowForward size={30} />
                    </div>
                    <div className="col" style={{ paddingLeft: "0px" }}>
                      <Form.Item
                        name="maxPrice"
                        label="Max price"
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value == null || value === "") {
                                return Promise.resolve();
                              }
                              if (isNaN(value) || Number(value) < 0) {
                                return Promise.reject(
                                  new Error(
                                    "Number must be greater than or equal to 0!"
                                  )
                                );
                              }
                              if (
                                form.getFieldValue("minPrice") != null &&
                                value <= Number(form.getFieldValue("minPrice"))
                              ) {
                                return Promise.reject(
                                  new Error(
                                    "Max price must be greater than Min price!"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input
                          disabled={false}
                          type="number"
                          placeholder="MAX"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
                <div className="text-right">
                  <Button type="primary" onClick={() => form.submit()}>
                    Filter
                  </Button>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default FilterProduct;
