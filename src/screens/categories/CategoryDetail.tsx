import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const CategoryDetail = () => {
    const [searchParams] = useSearchParams();
    const params = useParams();
    const id = searchParams.get('id')
    console.log(params);
    console.log(id);
  return (
    
    <div>CategoryDetail</div>
  )
}

export default CategoryDetail