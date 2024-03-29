import React from 'react'
import './Css/ShopCategory.css'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import drop_down from '../Components/Assets/dropdown_icon.png'
import Item from '../Components/Items/Item'

const ShopCategory = (props) => {
  const {all_products} = useContext(ShopContext)
  console.log(all_products)
  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="" />
      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-12</span> Out Of 36 Products
        </p>
        <div className="shopcategory-sort">
          Sort By <img src={drop_down} alt="" />
        </div>
      </div>
      <div className="shopcategory-products">
        {all_products.map((item,i)=>{
          if(props.category === item.category){
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />

          }else{
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  )
}

export default ShopCategory
