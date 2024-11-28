import {
  Empty,
  Spin,
  Tabs,
  TabsProps,
  Typography
} from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import { API } from "../../configurations/configurations";
import {
  ProductResponse
} from "../../models/Products";
import ProductRating from "./components/ProductRating";
import SubProductDetail from "./components/SubProductDetail";

const ProductDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitLoading, setIsInitLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<ProductResponse>();
  const productId = searchParams.get("id");

  const items: TabsProps["items"] = [
    { key: "sub", label: "Sub product" },
    { key: "rating", label: "Rating" },
  ];

  const [keyTab, setKeyTab] = useState<string>('sub');

  useEffect(() => {
    if (productId) {
      getInitData();
    }
  }, []);

  const getInitData = async () => {
    setIsInitLoading(true);
    await getProductDetail();
    // await getSubProducts();
    setIsInitLoading(false);
  };

  const getProductDetail = async () => {
    const api = `${API.PRODUCTS}/${productId}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);
      setProduct(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (key: string) => {
    setKeyTab(key);
  };

  const renderContent = () => {
    if(product){
      if (keyTab === 'sub') {
        return <SubProductDetail product={product} />;
      } else {
        return <ProductRating product={product} />;
      }
    }
  };

  return isInitLoading ? (
    <Spin />
  ) : product ? (
    <>
      <div
        className="container-fluid"
        style={{ backgroundColor: "", width: "96%", height: "96%" }}
      >
        <Typography.Title level={3} className="mb-0">
          Product: {product.title}
        </Typography.Title>
        <Tabs
          type="card"
          activeKey={keyTab}
          items={items.map((item) => ({
            ...item,
            disabled: isLoading,
          }))}
          onChange={onChange}
        />
        <div>
          {
            renderContent()
          }
        </div>
      </div>
    </>
  ) : (
    <Empty />
  );
};

export default ProductDetail;
