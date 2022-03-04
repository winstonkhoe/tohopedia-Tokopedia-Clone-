import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Footer } from "../../components/Footer/Powered";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import styles from "../../styles/Shop.module.scss";
// import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import RupiahFormat from "../../misc/currency";
import { Carousel, Item } from "../../components/carousel/Carousel";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
const banners = [1, 2, 3];
// import existsSync from "fs";

const Shop: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  const { shopDomain } = router.query;
  const [offset, setOffset] = useState(0);
  const limit = 10;

  var page = 1;
  var pages = 1;

  const GET_SHOP_QUERY = gql`
    query getShop($slug: String!) {
      getShop(slug: $slug) {
        id
        name
        type
        city
        image
        reputationPoint
        products {
          id
          name
          price
          discount
          images {
            image
          }
        }
      }
    }
  `;

  const {
    loading: shopLoading,
    error: shopError,
    data: shopData,
  } = useQuery(GET_SHOP_QUERY, {
    variables: {
      slug: shopDomain,
    },
  });

  useEffect(() => {}, [offset, shopData]);

  var nProd = shopData?.getShop?.products?.length;
  page = Math.ceil(offset / limit + 1);
  pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);

  const GET_SHOP_PRODUCT_QUERY = gql`
    query getShopProductsPaginate($slug: String!, $limit: Int!, $offset: Int!) {
      getShopProductsPaginate(slug: $slug, limit: $limit, offset: $offset) {
        id
        name
        price
        discount
        images {
          image
        }
      }
    }
  `;

  const {
    loading: productPaginateLoad,
    error: productPaginateErr,
    data: productPaginateData,
  } = useQuery(GET_SHOP_PRODUCT_QUERY, {
    variables: {
      slug: shopDomain,
      limit: limit,
      offset: offset,
    },
  });

  const TOP_DISCOUNT_PRODUCT_QUERY = gql`
    query GetTopDiscountProduct {
      topProductDiscount {
        id
        name
        price
        discount
        images {
          image
        }
        shop {
          name
          city
          type
        }
      }
    }
  `;

  // const [products, setProducts] = useState(null);

  console.log("offset :" + offset);
  const {
    loading: TopDiscountProductLoading,
    error: TopDiscountProductError,
    data: TopDiscountProductData,
  } = useQuery(TOP_DISCOUNT_PRODUCT_QUERY);

  function getAllBanner() {
    let bannerItems = [];
    bannerItems = banners.map((bannerIndex: number) => {
      return (
        // <div key={bannerIndex} className={styles.carousel_image_container}>
        //   <Image
        //     src={`/assets/banner/${bannerIndex}.webp`}
        //     alt={`Banner ${bannerIndex}`}
        //     layout="fill"
        //   />
        // </div>
        `/assets/banner/${bannerIndex}.webp`
        // <Item key={bannerIndex} src={`/assets/banner/${bannerIndex}.webp`}/>
      );
    });

    return bannerItems;
  }

  function Product(props: {
    productId: string;
    productName: string;
    productDiscount: number;
    productPrice: number;
    shopName?: string;
    shopCity?: string;
    shopType?: number;
    imageSrc: string;
  }) {
    return (
      <div className={styles.product_outer_card}>
        <div className={styles.product_card}>
          <div className={styles.product_inner_card}>
            <Link href={`/${props.shopName}/${props.productId}`}>
              <a href="">
                <div className={styles.product_card_outline}>
                  <div className={styles.product_outer_image_container}>
                    <div className={styles.product_image_container}>
                      <Image
                        src={`/uploads/${props.imageSrc}`}
                        alt="Product Image"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>

                  <div className={styles.product_detail_container}>
                    <a href="">
                      <div className={styles.product_detail_name}>
                        {props.productName}
                      </div>
                      <div className={styles.product_detail_price}>
                        {RupiahFormat(
                          (props.productPrice * (100 - props.productDiscount)) /
                            100
                        )}
                      </div>
                      {props.productDiscount > 0 ? (
                        <div
                          className={styles.product_detail_discount_container}
                        >
                          <div
                            className={styles.product_detail_discount_percent}
                          >
                            {props.productDiscount}%
                          </div>
                          <div
                            className={
                              styles.product_detail_discounted_original_price
                            }
                          >
                            {RupiahFormat(props.productPrice)}
                          </div>
                        </div>
                      ) : null}

                      <div
                        className={styles.product_detail_location_ratings_sells}
                      >
                        {props?.shopName ? (
                          <div className={styles.product_detail_location}>
                            {props?.shopType > 0 ? (
                              <div className={styles.product_store_badge}>
                                <div
                                  className={
                                    styles.product_store_badge_container
                                  }
                                >
                                  <Image
                                    src={`/logo/${
                                      props.shopType == 1
                                        ? "badge_pm.png"
                                        : props.shopType == 2
                                        ? "badge_pmp.svg"
                                        : props?.shopType == 3
                                        ? "badge_os.png"
                                        : null
                                    }`}
                                    alt=""
                                    layout="fill"
                                  />
                                </div>
                              </div>
                            ) : null}

                            <div className={styles.product_store_location}>
                              <span className={styles.store_location}>
                                {props.shopCity}
                              </span>
                              <span className={styles.store_name}>
                                {props.shopName}
                              </span>
                            </div>
                          </div>
                        ) : null}

                        <div
                          className={styles.product_detail_ratings_sells}
                        ></div>
                      </div>
                    </a>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function SectionProduct(props: { data: any; name: string; href?: any }) {
    return (
      <section className={styles.product_section}>
        {props?.data?.map((product: any) => {
          return (
            <>
              <Product
                key={product.id}
                productId={product.id}
                imageSrc={product.images[0].image}
                productName={product.name}
                productPrice={product.price}
                productDiscount={product.discount}
                shopType={product?.shop?.type ? product?.shop?.type : null}
                shopCity={product?.shop?.city ? product?.shop?.city : null}
                shopName={product?.shop?.name ? product?.shop?.name : null}
              ></Product>
            </>
          );
          // <Product imageSrc="" productName="" productPrice={1} shopBadge="" shopCity="" shopName="" key={0}></Product>
        })}
      </section>
    );
  }
  if (shopLoading || TopDiscountProductLoading) {
    return <h2>Loading...</h2>;
  }

  console.log("page: " + page);
  console.log("pages: " + pages);
  console.log(shopData);
  console.log(shopData?.getShop?.products);
  console.log(productPaginateData);
  // if (productData) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Tohopedia</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <InitFont />
      </Head>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.main_container}>
          {/* Seller Details */}
          <div className={styles.seller_detail_wrapper}>
            <div className={styles.seller_detail_inner_container}>
              <div className={styles.seller_detail_container}>
                <div className={styles.seller_detail_left_container}>
                  <div className={styles.seller_detail_info_container}>
                    <div className={styles.seller_profile_image_container}>
                      <div className={styles.seller_profile_image_inner}>
                        <picture>
                          <Image
                            src={`/uploads/${shopData?.getShop?.image}`}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                          />
                        </picture>
                      </div>
                    </div>
                    <div className={styles.seller_name_location_container}>
                      <div className={styles.seller_name_badge_container}>
                        <i>
                          <Image
                            src={`/logo/${
                              shopData?.getShop?.type == 1
                                ? "badge_pm.png"
                                : shopData?.getShop?.type == 2
                                ? "badge_pmp.svg"
                                : shopData?.getShop?.type == 3
                                ? "badge_os.png"
                                : null
                            }`}
                            alt=""
                            layout="fill"
                          />
                        </i>
                        <h1>{shopData?.getShop?.name}</h1>
                        <div className={styles.seller_badge_container}>
                          <div className={styles.seller_badge_relative}>
                            <Image
                              src={"/logo/logo_diamond_4.gif"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                          <div className={styles.badge_onhover_info}>
                          {shopData?.getShop?.reputationPoint} points
                            <div></div>
                          </div>
                        </div>
                      </div>
                      <ul className={styles.seller_info_container}>
                        <div className={styles.seller_info_flex}>
                          <li className={styles.seller_info_item}>
                            <div>Buka</div>
                          </li>
                          <li className={styles.seller_info_item}>
                            <p>Dibalas ± 10 tahun</p>
                          </li>
                          <li className={styles.seller_info_item}>
                            <p>
                              <svg viewBox="0 0 16 16" height="16" width="16">
                                <use href="#shop-location"></use>
                              </svg>
                              Kabupaten Tangerang
                            </p>
                          </li>
                        </div>
                      </ul>
                      <div className={styles.seller_buttons_container}></div>
                    </div>
                  </div>
                </div>
                <div className={styles.seller_detail_right_container}>
                  <div className={styles.seller_detail_right_inner_container}>
                    <div className={styles.seller_detail_right_wrapper}>
                      <div className={styles.seller_detail_product_quality}>
                        <p>Nilai Kualitas Produk</p>
                        <h2>4.9</h2>
                        <div>
                          <div>
                            <Image
                              src={"/logo/icon_star.svg"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                          <div>
                            <Image
                              src={"/logo/icon_star.svg"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                          <div>
                            <Image
                              src={"/logo/icon_star.svg"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                          <div>
                            <Image
                              src={"/logo/icon_star.svg"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                          <div>
                            <Image
                              src={"/logo/icon_star.svg"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END Seller Details */}

          <div className={styles.tab_navigator}></div>

          {/* Banner and Product Details */}
          <div className={styles.banner_product_container}>
            <div className={styles.banner_home_container}>
              <div className={styles.shop_widget_container}>
                {/* One Widget Item */}
                <div className={styles.shop_widget_item_container}>
                  <div className={styles.shop_widget_item_inner_container}>
                    <div className={styles.shop_widget_item_column_container}>
                      <picture>
                        <Image
                          src={"/assets/banner/shop/1.jpg"}
                          alt=""
                          layout="fill"
                        />
                      </picture>
                    </div>
                  </div>
                </div>
                {/* END One Widget Item */}

                {/* One Widget Item YOUTUBE */}
                <div className={styles.shop_widget_item_container}>
                  <div className={styles.shop_widget_item_iframe_container}>
                    <iframe
                      src="https://www.youtube.com/embed/gCOXoULubyI"
                      className={styles.shop_widget_item_column_container}
                      allowFullScreen
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    >
                      {/* <picture>
                        <Image
                          src={"/assets/banner/shop/1.jpg"}
                          alt=""
                          layout="fill"
                        />
                      </picture> */}
                    </iframe>
                    {/* <picture>
                                              <Image src={"https://i.ytimg.com/vi_webp/1RNtay6vj-Y/maxresdefault.webp"} layout="fill" alt="" objectFit="cover"/>
                                          </picture> */}
                  </div>
                </div>
                {/* END One Widget Item */}
              </div>
            </div>
            <div className={styles.all_product_container}></div>
          </div>
          {/* END Banner and Product Details */}
          <div className={styles.carousel_container}>
            <Carousel srcs={getAllBanner()} slideInterval={3000} />
          </div>
          {/* <Section
            data={TopDiscountProductData.topProductDiscount}
            name={"Top Discount"}
            href={"/product/top-discount"}
          /> */}
          <SectionProduct
            data={productPaginateData?.getShopProductsPaginate}
            name={""}
          />
          <div className={styles.pagination_container}>
            <ul>
              {offset - 1 >= 0 && (
                <a onClick={() => setOffset(offset - limit)}>❮</a>
              )}
              {/* {page} */}
              {page + 1 <= pages && (
                <a
                  onClick={() => {
                    setOffset(limit * page);
                  }}
                >
                  ❯
                </a>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
  // }
};

export default Shop;