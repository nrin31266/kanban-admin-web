import React, { useEffect, useState } from 'react'
import { ProductResponse } from '../../../models/Products';
import { API } from '../../../configurations/configurations';
import handleAPI from '../../../apis/handleAPI';
import { PageResponse } from '../../../models/AppModel';
import Table, { ColumnProps } from 'antd/es/table';
import { RatingResponse } from '../../../models/RatingModel';
import { Button, Image, Typography } from 'antd';
interface Props {
    product: ProductResponse;
  }
const ProductRating = (props: Props) => {
    const {product}= props
    const [ isLoading, setIsLoading ] = useState(false);
    const [pageData, setPageData] = useState<PageResponse<RatingResponse>>({
        data: [],
        currentPage: 0,
        pageSize: 0,
        totalElements: 0,
        totalPages: 0,
      });

      useEffect(() => {
        if(product){
            getRatings();
        }
      }, [product]);

    const columns: ColumnProps<RatingResponse>[] = [
        {
            title:'#',
            dataIndex: '',
            render: (item: RatingResponse)=><div>
                <div>
                    <span>Created: </span>
                    <span>{item.created}</span>
                </div>
                <div>
                    <span>Updated: </span>
                    <span>{item.updated}</span>
                </div>
            </div>,
            width: 200
            
        },{
            title:'Info',
            dataIndex: '',
            render: (item: RatingResponse)=><div>
                <Image width={40} src={item.avatar?? ''} />
                <div>
                    <span>{item.name?? ''}</span>
                </div>
            </div>,
            width: 200
            
        }
        ,{
            title:'Reviews',
            dataIndex: 'comment',
            render: (comment: string)=><div>
               <Typography.Text>{comment}</Typography.Text>
            </div>
            
        }
        ,{
            title:'Image',
            dataIndex: 'imageUrls',
            render: (imageUrls: string[])=><div>
               {
                imageUrls.length>0 && imageUrls.map((imgUrl)=><Image width={50} src={imgUrl}/>)
               }
            </div>
            
        },{
            title:'Reply',
            dataIndex: 'reply',
            render: (reply: string)=><div>
               <Typography.Text>{reply?? ''}</Typography.Text>
            </div>
            
        }
        ,{
            title:'Actions',
            dataIndex: '',
            render: (item: RatingResponse)=><div>
                <Button type='primary'>Reply</Button>
            </div>,
            fixed: 'right'
            
        }
      ];

    const getRatings = async (page? : number) => {
        setIsLoading(true);
        const pageReq = page?? 1;
        const url = `${API.RATING}?productId=${product.id}&page=${pageReq}&size=10`;
        try {
          const res = await handleAPI(url);
          setPageData(res.data.result);
          console.log(res.data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <Table
    rowClassName={() => "custom-row"}
    scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
    pagination={{
      size: "small",
      current: pageData.currentPage,
      showQuickJumper: false,
      total: pageData.totalElements,
      onChange: (page, _pageSize) => {
        getRatings(page);
      },
      pageSize: pageData.pageSize,
    }}
    loading={isLoading}
    columns={columns}
    dataSource={pageData.data}
  ></Table>
  )
}

export default ProductRating