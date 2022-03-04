import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Footer } from "../components/Footer/Powered";
import InitFont from "../components/initialize_font";
import Navbar from "../components/navbar";
import styles from "../styles/Order_List.module.scss";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import React, { Children, useState } from "react";
import { UserNavbar } from "../components/user/user_navbar";
import Router, { useRouter } from "next/router";
import TransactionCard from "../components/transaction/TransactionCard";

const OrderList = (props: { children: any }) => {
  const router = useRouter();
  //   const [kotak, setKotak] = useState(true);
  //   const [pembelian, setPembelian] = useState(true);
  //   const [profil, setProfil] = useState(true);
  // console.log(router.pathname)
  // console.log(router.pathname.split('/'))

  function checkPathExists(array: any, path: string) {
    return array.indexOf(path) >= 0;
  }

  const paths = router.pathname.split("/");
  const [activeTab, setActiveTab] = useState(
    checkPathExists(paths, "address") ? "address" : "index"
  );
  const indicatorStyle = {
    index: { width: "131px", left: "0px" },
    address: { width: "148px", left: "131px" },
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Settings | Tohopedia</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InitFont />
      <Navbar />

      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.main_inner_container}>
            <UserNavbar />
            {/* Summary User Nav

              {/* END Summary User Nav */}

            {/* Menu Settings */}
            <div className={styles.main_right_container}>
              {/* <span className={styles.main_right_container_header}>
                  Winston
                </span> */}
              <div className={styles.settings_tab_outer_container}>
                <div className={styles.filter_wrapper}>
                  <div className={styles.filter_top_options_container}>
                    <div className={styles.search_field_container}>
                      <div>
                        <button></button>
                        <input
                          type="text"
                          placeholder="Cari transaksimu di sini"
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.category_dropdown_container}></div>
                    <div className={styles.date_choose_container}>
                      <div className={styles.date_choose_container_border}>
                        <input type="date" name="" id="" />
                      </div>
                    </div>
                  </div>
                  <div className={styles.filter_bottom_options_container}>
                    <div className={styles.filter_bottom_options_wrapper}>
                      <div className={styles.filter_bottom_options_header}>
                        <p>Status</p>
                      </div>
                      <div
                        className={styles.filter_options_container_flex_wrapper}
                      >
                        <div className={styles.filter_options_container_flex}>
                          <div className={`${styles.filter_options_item} ${styles.filter_selected}`}>
                            Semua
                          </div>
                          <div className={styles.filter_options_item}>
                            Berlangsung
                          </div>
                          <div className={styles.filter_options_item}>
                            Berhasil
                          </div>
                          <div className={styles.filter_options_item}>
                            Tidak Berhasil
                          </div>
                        </div>
                      </div>
                                          <div className={styles.filter_reset_container}>
                                              <p>Reset Filter</p>
                      </div>
                    </div>
                  </div>
                </div>
                              <div className={styles.transaction_container}>
                                  <div className={styles.transaction_card_container}>

                        <TransactionCard/>
                                  </div>
                </div>
                <div className={styles.pagination_container}></div>

                {/* <div className={styles.settings_tab_navigator_container}>
                    <div
                      className={styles.settings_tab_navigator_container_flex}
                    >
                      <div
                        className={activeTab == "index" ? styles.settings_tab_navigator_item_active : styles.settings_tab_navigator_item_inactive}
                        onClick={() => { setActiveTab("index");  Router.replace('/user/settings')}}
                                          >
                        Biodata Diri
                        
                      </div>
                      <div
                                              className={activeTab == "address" ? styles.settings_tab_navigator_item_active : styles.settings_tab_navigator_item_inactive}
                        onClick={() => { setActiveTab("address"); Router.replace('/user/settings/address')}}
                      >
                        Daftar Alamat
                      </div>
                      <div
                        className={
                          styles.settings_tab_navigator_active_indicator
                        }
                        style={indicatorStyle[activeTab]}
                        // style={{width: "131px", left: "0px"}}
                      ></div>
                    </div>
                  </div> */}
              </div>
            </div>
            {/* END Menu Settings */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
  // }
};

export default OrderList;
