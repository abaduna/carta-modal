"use client";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import ComponetFood from "../componets/ComponetFood";
import { useFetch } from "@/hock/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import { faBottleWater } from "@fortawesome/free-solid-svg-icons";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { SkeletonHome } from "@/componets/SkeletonHome";
import ComponetCarrito from "@/componets/ComponetCarrito";
export interface Menu {
  title: string;
  price: number;
  url_imagen?: string;
  id?: string;
  category?: string;
  setCarrito?: Function;
  removeProduct?: Function
  itemid?:number
}

export default function Home() {
  // const data = await getUser();
  const [serch, setSerch] = useState<string>("");
  const [foods, setFoods] = useState<Menu[]>([]);
  const [endpoint, setEndpoint] = useState<string>("api/menu");
  const [hamburger, setHamburger] = useState<Menu[]>([]);
  const [bottle, setBottle] = useState<Menu[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [carrito, setCarrito] = useState<Menu[]>([]);
  const { getData } = useFetch();
  useEffect(() => {
    const getDataFoods = async () => {
      try {
        const foods = await getData(endpoint);
        if (typeof foods !== "undefined") {
          setFoods(foods.data);
          console.log(foods.data);
        } else {
          console.log(`undefind`);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    getDataFoods();
  }, [endpoint]);

  const handlerCategoryHamburgesa = () => {
    setEndpoint("api/menu?category=hanburgesa");
    setShow(true);
  };
  const handlerCategoryBottles = () => {
    setEndpoint("api/menu?category=botellas");
    setShow(true);
  };

  const handleSerchClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShow(true);
    setEndpoint(`api/menu/${serch}`);
  };
  useEffect(() => {
    const sendCategory = async () => {
      const bottle = await getData("api/menu?category=botellas");
      if (typeof bottle !== "undefined") {
        setBottle(bottle.data);
        console.log(bottle.data);
      } else {
        console.log(`undefind`);
      }
      const hamburger = await getData("api/menu?category=hanburgesa");
      if (typeof hamburger !== "undefined") {
        setHamburger(hamburger.data);
        console.log(hamburger.data);
        console.log(hamburger);
        
      } else {
        console.log(`undefind`);
      }
    };
    sendCategory();
  }, []);
  const removeProduct=(product:Menu)=>{
    
    setCarrito((prev: Menu[]) =>
      prev.filter((item: Menu) => item.title !== product.title)
    );
  }
  
  return (
    <div>
      <div className={styles.header}>
        <img
          className={styles.headerImg}
          src="/sanmartin.png"
          alt="San Martin"
        />
      </div>

      <form className={styles.formContainerSerch} onSubmit={handleSerchClick}>
        <input
          placeholder="buscar"
          onChange={(e) => setSerch(e.target.value)}
          value={serch}
          className={styles.searchInput}
        />
        <div className={styles.containerBtn}>
          <button className={styles.searchButton} type="submit">
            Buscar
          </button>
        </div>
      </form>
      <div className={styles.categoiesBtns}>
        <button
          className={styles.categoryButton}
          onClick={handlerCategoryHamburgesa}
        >
          {" "}
          <FontAwesomeIcon icon={faBurger} style={{ fontSize: "25px" }} />
        </button>
        <button
          className={styles.categoryButton}
          onClick={handlerCategoryBottles}
        >
          {" "}
          <FontAwesomeIcon icon={faBottleWater} style={{ fontSize: "25px" }} />
        </button>
      </div>
      <ComponetCarrito carrito={carrito} />
      {show ? (
        <>
          <div className={styles.fooditem}>
            {foods.length > 0 &&
              foods?.map((food: Menu) => (
                <Suspense key={food.id} fallback={<SkeletonHome />}>
                  <ComponetFood
                    setCarrito={setCarrito}
                    removeProduct={removeProduct}
                    {...food}
                  ></ComponetFood>
                </Suspense>
              ))}
          </div>
        </>
      ) : (
        <>
          <p className={styles.categoryTitle}>Categoria</p>
          <p className={styles.categoryBottle}>Botellas</p>
          <div className={styles.fooditem}>
            {bottle.length > 0 &&
              bottle?.map((food: Menu) => (
                <Suspense key={food.id} fallback={<SkeletonHome />}>
                  <ComponetFood
                    setCarrito={setCarrito}
                    removeProduct={removeProduct}
                    {...food}
                  ></ComponetFood>
                </Suspense>
              ))}
          </div>
          <p className={styles.categoryHanburger}>Hamburgesa </p>
          <div className={styles.fooditem}>
            {hamburger.length > 0 &&
              hamburger?.map((food: Menu) => (
                <Suspense key={food.id} fallback={<SkeletonHome />}>
                  <ComponetFood
                    setCarrito={setCarrito}
                    removeProduct={removeProduct}
                    key={food.id}
                    {...food}
                  ></ComponetFood>
                </Suspense>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
