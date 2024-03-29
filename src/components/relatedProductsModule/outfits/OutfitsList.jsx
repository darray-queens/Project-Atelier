import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../shared/ProductCard';
import scrollButtonClick from '../shared/scrollButtonClick';
import fetchSalePrice from '../shared/fetchSalePrice';
import {
  Grid,
  Col,
  ProductModuleRow,
  StyledButton,
} from '../../shared/containers';

function OutfitsList({ currentProduct }) {
  const currOutfitItems = localStorage.getItem('outfits');
  const parsedCurrOutfitItems = JSON.parse(currOutfitItems);

  const [outfitList, setOutfitList] = useState(() => (
    (currOutfitItems === null) ? [{}] : parsedCurrOutfitItems));
  const [salePriceValue, setSalePriceValue] = useState(undefined);

  const OutfitModuleRef = useRef(null);

  useEffect(() => {
    if (Object.keys(currentProduct).length > 0) {
      const appendSalePrice = async (id) => {
        const fetchResult = await fetchSalePrice(id);
        if (fetchResult !== null) {
          setSalePriceValue(fetchResult);
        }
        return undefined;
      };
      appendSalePrice(currentProduct.id);
    }
  }, [currentProduct]);

  if (Object.keys(currentProduct).length === 0) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const setJSONItem = (outfits) => {
    const outfitsJSON = JSON.stringify(outfits);
    localStorage.setItem('outfits', outfitsJSON);
  };

  const writeOutfitToLocalStorage = () => {
    const outfits = [];

    if (localStorage.length > 0) {
      parsedCurrOutfitItems.forEach((element) => {
        outfits.push(element);
      });
    }

    outfits.push({ ...currentProduct, salePrice: salePriceValue });
    setJSONItem(outfits);
  };

  const deleteOutfitFromLocalStorage = (id) => {
    const newOutfitList = [];
    parsedCurrOutfitItems.forEach((element) => {
      if (element.id !== id) {
        newOutfitList.push(element);
      }
    });

    if (newOutfitList.length === 0) {
      localStorage.clear();
    } else {
      setJSONItem(newOutfitList);
    }
  };

  const addToOutfitList = (id) => {
    if (Object.keys(outfitList[0]).length === 0) {
      writeOutfitToLocalStorage();
      setOutfitList([{ ...currentProduct, salePrice: salePriceValue }]);
    } else {
      const listOfIds = [];
      outfitList.forEach((element) => {
        listOfIds.push(element.id);
      });
      if (!listOfIds.includes(id)) {
        writeOutfitToLocalStorage();
        setOutfitList((prevList) => [
          ...prevList, { ...currentProduct, salePrice: salePriceValue }]);
      }
    }
  };

  const removeFromOutfitList = (id) => {
    const newOutfitList = [];

    deleteOutfitFromLocalStorage(id);
    if (outfitList.length === 1) {
      newOutfitList.push({});
    } else {
      outfitList.forEach((element) => {
        if (element.id !== id) {
          newOutfitList.push(element);
        }
      });
    }
    setOutfitList(newOutfitList);
  };

  return (
    <Grid>
      <h2>Your Outfit</h2>
      <ProductModuleRow>
        <Col size={1}>
          <StyledButton type="button">&nbsp;</StyledButton>
        </Col>
        <ProductCard
          key={currentProduct.id}
          product={currentProduct}
          actionButtonClick={addToOutfitList}
          imageClick={() => null}
          textValue="&#10753;"
          salePrice={salePriceValue}
        />
        <Col size={1}>
          <StyledButton type="button" onClick={() => scrollButtonClick(OutfitModuleRef.current, 'left')}>&lt;</StyledButton>
        </Col>
        <Col size={18}>
          <ProductModuleRow ref={OutfitModuleRef} width={72.5}>
            {Object.keys(outfitList[0]).length === 0 ? <div />
              : outfitList.map((element) => (
                <ProductCard
                  key={element.id}
                  product={element}
                  actionButtonClick={removeFromOutfitList}
                  imageClick={() => null}
                  textValue="ⓧ"
                  salePrice={element.salePrice}
                />
              ))}
          </ProductModuleRow>
        </Col>
        <Col size={1}>
          <StyledButton type="button" onClick={() => scrollButtonClick(OutfitModuleRef.current, 'right')}>&gt;</StyledButton>
        </Col>
      </ProductModuleRow>
    </Grid>

  );
}
export default OutfitsList;
